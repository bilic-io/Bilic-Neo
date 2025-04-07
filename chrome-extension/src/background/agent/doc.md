### 1. `executeWithPuppeteer()`
```typescript
async executeWithPuppeteer(taskDetails, email): Promise<void>
```
**Purpose**: Main entry point for browser automation tasks.

**Flow**:
1. Creates a new browser context.
2. Configures page settings (viewport, request interception).
3. Handles navigation with timeout.
4. Checks authentication state.
5. Executes task logic.
6. Manages cleanup operations.

**Parameters**:
- `taskDetails`: Contains URL, authentication check flag, and description.
- `email`: Notification recipient.

---

### 2. Lifecycle Management
```typescript
private async cleanupPage(page: Page | null): Promise<void>
async cancel(): Promise<void>
async cleanup(): Promise<void>
```
**Responsibility**:
- Ensure proper resource cleanup.
- Prevent memory leaks.
- Handle task interruption gracefully.

**Sequence**:
```
[Task Start] → [Execution] → [Success/Cancel/Failure] → [Cleanup]
```

---

### 3. Event Handling
```typescript
private handleAuthRequired()
private handleTaskCompletion()
private handleTaskFailure()
```
**Event Types**:
- `TASK_PAUSE`: Requires user intervention.
- `TASK_OK`: Successful completion.
- `TASK_FAIL`: Error state.

**Notification Flow**:
1. Browser events trigger state changes.
2. Email notifications sent via `nodemailer`.
3. Internal state updated through `EventManager`.

---

### 4. Core Automation Logic
```typescript
private checkLoginStatus()
private performTask()
private executePageTask()
```
**Authentication Check**:
- Checks for the presence of login button and account element.
- Uses CSS selectors with visibility filters.

**Task Execution**:
- Implements a 2-minute timeout.
- Captures page content, including:
    - Page title
    - Body text
    - Hyperlinks
- Returns structured JSON data.

---

### Error Handling Strategy

**Retry Logic**:
```typescript
context.options = {
    maxFailures: 3, // Retry attempts
    maxSteps: 10    // Max operations per task
}
```

**Error Types**:
| Error Case            | Handling Strategy                     |
|-----------------------|---------------------------------------|
| Navigation timeout    | Abort task, notify user              |
| Authentication required | Pause task, request credentials     |
| Email failures        | Log error, continue execution        |
| Browser crashes       | Cleanup resources, restart           |

---

### Best Practices

**Page Management**:
```typescript
// Always create new pages through browserContext
const page = await browserContext.newPage();
```

**Resource Cleanup**:
```typescript
// Proper cleanup sequence
await page.removeAllListeners();
await page.close();
await browserContext.close();
```

**Event Subscription**:
```typescript
// Subscribe to execution events
executor.subscribeExecutionEvents((event) => {
    console.log('State update:', event);
});
```
