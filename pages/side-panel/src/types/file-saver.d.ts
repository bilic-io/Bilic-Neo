declare module 'file-saver' {
  export function saveAs(data: Blob, filename?: string, options?: Object): void;
  export function saveAs(data: Blob, filename?: string, disableAutoBOM?: boolean): void;
  export function saveAs(data: string, filename?: string, disableAutoBOM?: boolean): void;
}
