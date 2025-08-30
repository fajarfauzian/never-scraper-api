export class Logger {
  static info(message: string, ...args: any[]) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static error(message: string, error?: Error | any) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }

  static warn(message: string, ...args: any[]) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static debug(message: string, ...args: any[]) {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
  }
}