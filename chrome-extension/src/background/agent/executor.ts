import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { AgentContext, type AgentOptions } from './types';
import { NavigatorAgent, NavigatorActionRegistry } from './agents/navigator';
import { PlannerAgent } from './agents/planner';
import { ValidatorAgent } from './agents/validator';
import { NavigatorPrompt } from './prompts/navigator';
import { PlannerPrompt } from './prompts/planner';
import { ValidatorPrompt } from './prompts/validator';
import { createLogger } from '@src/background/log';
import MessageManager from './messages/service';
import type BrowserContext from '../browser/context';
import { ActionBuilder } from './actions/builder';
import { EventManager } from './event/manager';
import { Actors, type EventCallback, EventType, ExecutionState } from './event/types';
import { ChatModelAuthError } from './agents/errors';
import nodemailer from 'nodemailer'; // For sending emails
import type { Page } from 'puppeteer-core';

const logger = createLogger('Executor');

export interface ExecutorExtraArgs {
  plannerLLM?: BaseChatModel;
  validatorLLM?: BaseChatModel;
  extractorLLM?: BaseChatModel;
  agentOptions?: Partial<AgentOptions>;
}

export class Executor {
  private readonly navigator: NavigatorAgent;
  private readonly planner: PlannerAgent;
  private readonly validator: ValidatorAgent;
  private readonly context: AgentContext;
  private readonly plannerPrompt: PlannerPrompt;
  private readonly navigatorPrompt: NavigatorPrompt;
  private readonly validatorPrompt: ValidatorPrompt;
  private tasks: string[] = [];
  constructor(
    task: string,
    taskId: string,
    browserContext: BrowserContext,
    navigatorLLM: BaseChatModel,
    extraArgs?: Partial<ExecutorExtraArgs>,
  ) {
    const messageManager = new MessageManager({});

    const plannerLLM = extraArgs?.plannerLLM ?? navigatorLLM;
    const validatorLLM = extraArgs?.validatorLLM ?? navigatorLLM;
    const extractorLLM = extraArgs?.extractorLLM ?? navigatorLLM;
    const eventManager = new EventManager();
    const context = new AgentContext(
      taskId,
      browserContext,
      messageManager,
      eventManager,
      extraArgs?.agentOptions ?? {},
    );

    this.tasks.push(task);
    this.navigatorPrompt = new NavigatorPrompt(context.options.maxActionsPerStep);
    this.plannerPrompt = new PlannerPrompt();
    this.validatorPrompt = new ValidatorPrompt(task);

    const actionBuilder = new ActionBuilder(context, extractorLLM);
    const navigatorActionRegistry = new NavigatorActionRegistry(actionBuilder.buildDefaultActions());

    // Initialize agents with their respective prompts
    this.navigator = new NavigatorAgent(navigatorActionRegistry, {
      chatLLM: navigatorLLM,
      context: context,
      prompt: this.navigatorPrompt,
    });

    this.planner = new PlannerAgent({
      chatLLM: plannerLLM,
      context: context,
      prompt: this.plannerPrompt,
    });

    this.validator = new ValidatorAgent({
      chatLLM: validatorLLM,
      context: context,
      prompt: this.validatorPrompt,
    });

    this.context = context;
    // Initialize message history
    this.context.messageManager.initTaskMessages(this.navigatorPrompt.getSystemMessage(), task);
  }

  subscribeExecutionEvents(callback: EventCallback): void {
    this.context.eventManager.subscribe(EventType.EXECUTION, callback);
  }

  clearExecutionEvents(): void {
    // Clear all execution event listeners
    this.context.eventManager.clearSubscribers(EventType.EXECUTION);
  }

  addFollowUpTask(task: string): void {
    this.tasks.push(task);
    this.context.messageManager.addNewTask(task);
    // update validator prompt
    this.validatorPrompt.addFollowUpTask(task);

    // need to reset previous action results that are not included in memory
    this.context.actionResults = this.context.actionResults.filter(result => result.includeInMemory);
  }

  /**
   * Execute the task
   *
   * @returns {Promise<void>}
   */
  async execute(): Promise<void> {
    logger.info(`🚀 Executing task: ${this.tasks[this.tasks.length - 1]}`);
    // reset the step counter
    const context = this.context;
    context.nSteps = 0;
    const allowedMaxSteps = this.context.options.maxSteps;

    try {
      this.context.emitEvent(Actors.SYSTEM, ExecutionState.TASK_START, this.context.taskId);

      let done = false;
      let step = 0;
      let validatorFailed = false;

      for (step = 0; step < allowedMaxSteps; step++) {
        context.stepInfo = {
          stepNumber: context.nSteps,
          maxSteps: context.options.maxSteps,
        };

        logger.info(`🔄 Step ${step + 1} / ${allowedMaxSteps}`);
        if (await this.shouldStop()) {
          break;
        }

        // Run planner if configured
        if (this.planner && (context.nSteps % context.options.planningInterval === 0 || validatorFailed)) {
          validatorFailed = false;
          // The first planning step is special, we don't want to add the browser state message to memory
          if (this.tasks.length > 1 || step > 0) {
            await this.navigator.addStateMessageToMemory();
          }

          const planOutput = await this.planner.execute();
          if (planOutput.result) {
            logger.info(`🔄 Planner output: ${JSON.stringify(planOutput.result, null, 2)}`);
            this.context.messageManager.addPlan(
              JSON.stringify(planOutput.result),
              this.context.messageManager.length() - 1,
            );
            if (planOutput.result.done) {
              // task is complete, skip navigation
              done = true;
              this.validator.setPlan(planOutput.result.next_steps);
            } else {
              // task is not complete, let's navigate
              this.validator.setPlan(null);
              done = false;
            }

            if (!planOutput.result.web_task && planOutput.result.done) {
              break;
            }
          }
        }

        // execute the navigation step
        if (!done) {
          done = await this.navigate();
        }

        // validate the output
        if (done && this.context.options.validateOutput && !this.context.stopped && !this.context.paused) {
          const validatorOutput = await this.validator.execute();
          if (validatorOutput.result?.is_valid) {
            logger.info('✅ Task completed successfully');
            break;
          }
          validatorFailed = true;
        }

        // Check if Puppeteer execution is needed
        if (this.shouldExecuteWithPuppeteer()) {
          console.log('executing with pupetter');
          logger.info('....executing with pupeteer');
          // const taskDetails = {
          //   url: planOutput.result.url,
          //   checkLogin: planOutput.result.requiresLogin,
          //   taskDescription: planOutput.result.description // Assuming task description is part of the plan output
          // };
          // const email = context.getCurrentUserEmail();
          // await this.executeWithPuppeteer(taskDetails, email);
        }
      }

      if (done) {
        this.context.emitEvent(Actors.SYSTEM, ExecutionState.TASK_OK, this.context.taskId);
      } else if (step >= allowedMaxSteps) {
        logger.info('❌ Task failed: Max steps reached');
        this.context.emitEvent(Actors.SYSTEM, ExecutionState.TASK_FAIL, 'Task failed: Max steps reached');
      } else if (this.context.stopped) {
        this.context.emitEvent(Actors.SYSTEM, ExecutionState.TASK_CANCEL, 'Task cancelled');
      } else {
        this.context.emitEvent(Actors.SYSTEM, ExecutionState.TASK_PAUSE, 'Task paused');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.context.emitEvent(Actors.SYSTEM, ExecutionState.TASK_FAIL, `Task failed: ${errorMessage}`);
    }
  }

  private async navigate(): Promise<boolean> {
    const context = this.context;
    try {
      // Get and execute navigation action
      // check if the task is paused or stopped
      if (context.paused || context.stopped) {
        return false;
      }
      const navOutput = await this.navigator.execute();
      // check if the task is paused or stopped
      if (context.paused || context.stopped) {
        return false;
      }
      context.nSteps++;
      if (navOutput.error) {
        throw new Error(navOutput.error);
      }
      context.consecutiveFailures = 0;
      if (navOutput.result?.done) {
        return true;
      }
    } catch (error) {
      if (error instanceof ChatModelAuthError) {
        throw error;
      }
      context.consecutiveFailures++;
      logger.error(`Failed to execute step: ${error}`);
      if (context.consecutiveFailures >= context.options.maxFailures) {
        throw new Error('Max failures reached');
      }
    }
    return false;
  }

  private async shouldStop(): Promise<boolean> {
    if (this.context.stopped) {
      logger.info('Agent stopped');
      return true;
    }

    while (this.context.paused) {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (this.context.stopped) {
        return true;
      }
    }

    if (this.context.consecutiveFailures >= this.context.options.maxFailures) {
      logger.error(`Stopping due to ${this.context.options.maxFailures} consecutive failures`);
      return true;
    }

    return false;
  }

  async cancel(): Promise<void> {
    this.context.stop();
  }

  async resume(): Promise<void> {
    this.context.resume();
  }

  async pause(): Promise<void> {
    this.context.pause();
  }

  async cleanup(): Promise<void> {
    try {
      await this.context.browserContext.cleanup();
    } catch (error) {
      logger.error(`Failed to cleanup browser context: ${error}`);
    }
  }

  async getCurrentTaskId(): Promise<string> {
    return this.context.taskId;
  }

  private shouldExecuteWithPuppeteer(): boolean {
    // Implement your logic here to determine when to execute with Puppeteer
    return true; // This is just a placeholder
  }

  // async executeWithPuppeteer(
  //   taskDetails: { url: string; checkLogin: boolean; taskDescription: string },
  //   email: string,
  // ): Promise<void> {
  //   const browserContext = this.context.browserContext;
  //   let page: Page | null = null;

  //   console.log('Starting Puppeteer execution');
  //   logger.info('Starting Puppeteer execution');
  //   console.log(`Task details: ${JSON.stringify(taskDetails)}`);
  //   logger.debug(`Task details: ${JSON.stringify(taskDetails)}`);

  //   try {
  //     page = (await browserContext.getCurrentPage()) as unknown as Page;
  //     if (!page) {
  //       console.error('No page available from browser context');
  //       logger.error('No page available from browser context');
  //       return;
  //     }

  //     console.log(`Page obtained, setting viewport for URL: ${taskDetails.url}`);
  //     logger.info(`Page obtained, setting viewport for URL: ${taskDetails.url}`);
  //     await page.setViewport({ width: 1280, height: 800 });

  //     // Configure page options
  //     await page.setRequestInterception(true);
  //     page.on('request', req => {
  //       if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
  //         req.abort();
  //         console.log(`Request aborted for resource type: ${req.resourceType()}`);
  //         logger.debug(`Request aborted for resource type: ${req.resourceType()}`);
  //       } else {
  //         req.continue();
  //         console.log(`Request continued for resource type: ${req.resourceType()}`);
  //         logger.debug(`Request continued for resource type: ${req.resourceType()}`);
  //       }
  //     });

  //     // Navigate with timeout handling
  //     console.log(`Navigating to URL: ${taskDetails.url}`);
  //     logger.info(`Navigating to URL: ${taskDetails.url}`);
  //     const navigationPromise = page.goto(taskDetails.url, {
  //       waitUntil: 'networkidle2',
  //       timeout: 60000,
  //     });

  //     const timeoutPromise = new Promise((_, reject) =>
  //       setTimeout(() => reject(new Error('Navigation timeout')), 60000),
  //     );

  //     await Promise.race([navigationPromise, timeoutPromise]);
  //     console.log(`Navigation to ${taskDetails.url} completed`);
  //     logger.info(`Navigation to ${taskDetails.url} completed`);

  //     if (taskDetails.checkLogin) {
  //       console.log('Checking login status');
  //       logger.info('Checking login status');
  //       const isLoggedIn = await this.checkLoginStatus(page);
  //       if (!isLoggedIn) {
  //         console.warn('User not logged in, handling authentication');
  //         logger.warning('User not logged in, handling authentication');
  //         await this.handleAuthRequired(email, taskDetails.taskDescription);
  //         return;
  //       }
  //     }

  //     console.log('Performing task on page');
  //     logger.info('Performing task on page');
  //     const taskResult = await this.performTask(page, taskDetails.taskDescription);
  //     console.log(`Task completed with result: ${taskResult}`);
  //     logger.info(`Task completed with result: ${taskResult}`);
  //     await this.handleTaskCompletion(email, taskDetails.taskDescription, taskResult);
  //   } catch (error) {
  //     console.error(`Error during Puppeteer execution: ${error}`);
  //     logger.error(`Error during Puppeteer execution: ${error}`);
  //     await this.handleTaskFailure(email, taskDetails.taskDescription, error);
  //     throw error;
  //   } finally {
  //     if (page) {
  //       console.log('Cleaning up page');
  //       logger.info('Cleaning up page');
  //       await this.cleanupPage(page);
  //     }
  //   }
  // }

  // private async handleAuthRequired(email: string, taskDescription: string): Promise<void> {
  //   logger.warning('User authentication required');
  //   await this.sendEmail(email, 'Login Required', `Please log in to continue the task: ${taskDescription}`);
  //   this.context.emitEvent(Actors.SYSTEM, ExecutionState.TASK_PAUSE, 'User authentication needed');
  // }

  // private async handleTaskCompletion(email: string, description: string, result: string): Promise<void> {
  //   logger.info('Task completed successfully');
  //   await this.sendEmail(
  //     email,
  //     'Task Completed',
  //     `The task "${description}" has been completed successfully. Result: ${result}`,
  //   );
  //   this.context.emitEvent(Actors.SYSTEM, ExecutionState.TASK_OK, result);
  // }

  // private async handleTaskFailure(email: string, description: string, error: unknown): Promise<void> {
  //   const errorMessage = error instanceof Error ? error.message : String(error);
  //   logger.error(`Task failed: ${errorMessage}`);
  //   await this.sendEmail(email, 'Task Failed', `The task "${description}" failed. Error: ${errorMessage}`);
  //   this.context.emitEvent(Actors.SYSTEM, ExecutionState.TASK_FAIL, errorMessage);
  // }

  // private async cleanupPage(page: Page | null): Promise<void> {
  //   if (page && !page.isClosed()) {
  //     try {
  //       await page.removeAllListeners();
  //       await page.close();
  //       logger.debug('Page closed successfully');
  //     } catch (error) {
  //       logger.error(`Error closing page: ${error}`);
  //     }
  //   }
  // }

  // private async checkLoginStatus(page: Page): Promise<boolean> {
  //   try {
  //     // Check multiple indicators of logged-in state
  //     const [loginVisible, accountVisible] = await Promise.all([
  //       page.$('button#login:not([hidden])'),
  //       page.$('#user-account:not([hidden])'),
  //     ]);

  //     // If login button is visible AND account element is hidden
  //     return !loginVisible && !!accountVisible;
  //   } catch (error) {
  //     logger.error(`Login check failed: ${error}`);
  //     return false;
  //   }
  // }

  // private async performTask(page: Page, taskDescription: string): Promise<string> {
  //   try {
  //     const result = await Promise.race([
  //       this.executePageTask(page, taskDescription),
  //       new Promise((_, reject) => setTimeout(() => reject('Task timeout'), 120000)),
  //     ]);

  //     return JSON.stringify(result);
  //   } catch (error) {
  //     throw new Error(`Task execution failed: ${error instanceof Error ? error.message : error}`);
  //   }
  // }

  // private async executePageTask(page: Page, description: string): Promise<unknown> {
  //   const content = await page.evaluate(() => {
  //     return {
  //       title: document.title,
  //       text: document.body.innerText,
  //       links: Array.from(document.querySelectorAll('a')).map(a => ({
  //         text: a.innerText,
  //         href: a.href,
  //       })),
  //     };
  //   });

  //   return {
  //     task: description,
  //     result: content,
  //     timestamp: new Date().toISOString(),
  //   };
  // }

  // private async sendEmail(to: string, subject: string, body: string): Promise<void> {
  //   if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  //     throw new Error('Email configuration missing');
  //   }

  //   const transporter = nodemailer.createTransport({
  //     service: process.env.EMAIL_SERVICE,
  //     pool: true,
  //     auth: {
  //       user: process.env.EMAIL_USER,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });

  //   const mailOptions = {
  //     from: `"Nano Browser" <${process.env.EMAIL_USER}>`,
  //     to,
  //     subject,
  //     text: body,
  //     priority: 'high',
  //   };

  //   try {
  //     const info = await transporter.sendMail(mailOptions as nodemailer.SendMailOptions);
  //     logger.debug(`Email sent: ${info.messageId}`);
  //   } catch (error) {
  //     logger.error(`Email send failed: ${error}`);
  //     throw new Error(`Failed to send email: ${error instanceof Error ? error.message : error}`);
  //   } finally {
  //     transporter.close();
  //   }
  // }
}
