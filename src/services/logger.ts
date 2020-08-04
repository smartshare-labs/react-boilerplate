/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-new */
/* eslint-disable no-underscore-dangle */
/* eslint-disable */

import Moment from "moment";
import SleepUtil from "./sleepUtil";

export enum LogLevel {
  Trace = "trace",
  Debug = "debug",
  Info = "info",
  Warning = "warning",
  Error = "error",
  None = "none"
}

export class LogOptions {
  sumoURL?: string | null = "";
  sendIntervalMs?: number = 2000;

  bufferSize?: number = 100;

  timeoutMs?: number = 10000;

  protocol?: string = "https";

  level: LogLevel = LogLevel.Info;

  // only error, warning, and info msgs will show - no debug or trace
  toConsole?: boolean = false;
}

export default class Logger {
  private static _theLogger: Logger;

  private messages: Array<any>;

  private closed = false;

  private options: LogOptions;

  private timer = -1;

  private levelStatuses: { [level: string]: boolean };

  public static CreateLogger(options: LogOptions) {
    if (Logger._theLogger !== undefined) {
      // This class is used as a singleton -- this should only be called once
      return;
    }

    // Create the logger
    // tslint:disable-next-line:no-unused-expression
    new Logger(options);
  }

  //
  // Static helper functions (fetch the instance for the caller)
  //
  public static trace(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    Logger.instance.log(LogLevel.Trace, sourceFunction, message, data, action);
  }

  public static debug(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    Logger.instance.log(LogLevel.Debug, sourceFunction, message, data, action);
  }

  public static info(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    Logger.instance.log(LogLevel.Info, sourceFunction, message, data, action);
  }

  public static warning(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    Logger.instance.log(
      LogLevel.Warning,
      sourceFunction,
      message,
      data,
      action
    );
  }

  public static error(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    Logger.instance.log(LogLevel.Error, sourceFunction, message, data, action);
  }

  //
  // Private static helpers
  //
  private static safeObjectToJSON(input: any): string {
    try {
      return JSON.stringify(input);
    } catch (error) {
      console.log(`Logger - Exception serializing log messages: ${error}`);
      return "";
    }
  }

  //
  // Public interface
  //

  public log(
    level: LogLevel,
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    // Wrap a string with an Object
    if (typeof message === "string") {
      message = { message };
    }

    if (data) {
      // if (typeof data === 'object') {
      //   data = JSON.stringify(data);
      // }
      message.data = data;
    } else {
      message.data = {};
    }

    // add metadata here
    this.addMetadata(message);

    if (action) {
      message.action = action;
    }

    message.level = level.toString();
    message.function = sourceFunction;

    if (this.levelStatuses[level] === true) {
      if (this.options.toConsole) {
        let msgToLog = `${Moment().format(
          "HH:mm:ss.SS"
        )} - ${level.toString()} - ${sourceFunction}() - ${message.message}`;
        if (message.data) {
          msgToLog += ` - ${JSON.stringify(message.data)}`;
        }
        console.log(msgToLog);
      }

      this.logInternal(message);
    }
  }

  public trace(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    this.log(LogLevel.Trace, sourceFunction, message, data, action);
  }

  public debug(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    this.log(LogLevel.Debug, sourceFunction, message, data, action);
  }

  public info(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    this.log(LogLevel.Info, sourceFunction, message, data, action);
  }

  public warning(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    this.log(LogLevel.Warning, sourceFunction, message, data, action);
  }

  public error(
    sourceFunction: string,
    message: string | any,
    data?: string | any,
    action?: string
  ): void {
    this.log(LogLevel.Error, sourceFunction, message, data, action);
  }

  //
  // Private helpers
  //

  private constructor(options: LogOptions) {
    this.messages = new Array<any>();
    this.options = new LogOptions();
    for (const prop in options) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(prop)) {
        // @ts-ignore
        this.options[prop] = options[prop];
      }
    }

    if (!this.options.bufferSize) {
      this.options.bufferSize = 1000;
    }

    this.levelStatuses = {};
    this.setupEnabledLevels(options.level);

    this.periodicUploaderAsync = this.periodicUploaderAsync.bind(this);

    Logger._theLogger = this;

    // Start the periodic uploads if SumoLogic URL was provided
    if (this.options.sumoURL) {
      this.periodicUploaderAsync();
    }
  }

  private async addMetadata(msg: any) {
    // add timestamp
    msg["timestamp"] = msg["timestamp"] || new Date().toISOString();

    const assignmentId = localStorage.getItem("assignmentId");
    const operatorId = localStorage.getItem("operatorId");

    if (assignmentId) {
      msg.assignmentId = assignmentId;
    }

    if (operatorId) {
      msg.operatorId = operatorId;
    }
  }

  private setupEnabledLevels(level: LogLevel) {
    switch (level) {
      case LogLevel.None:
        this.levelStatuses = {
          error: false,
          warning: false,
          info: false,
          debug: false,
          trace: false
        };
        break;
      case LogLevel.Error:
        this.levelStatuses = {
          error: true,
          warning: false,
          info: false,
          debug: false,
          trace: false
        };
        break;
      case LogLevel.Warning:
        this.levelStatuses = {
          error: true,
          warning: true,
          info: false,
          debug: false,
          trace: false
        };
        break;
      case LogLevel.Info:
        this.levelStatuses = {
          error: true,
          warning: true,
          info: true,
          debug: false,
          trace: false
        };
        break;
      case LogLevel.Debug:
        this.levelStatuses = {
          error: true,
          warning: true,
          info: true,
          debug: true,
          trace: false
        };
        break;
      case LogLevel.Trace:
        this.levelStatuses = {
          error: true,
          warning: true,
          info: true,
          debug: true,
          trace: true
        };
        break;
      default:
        this.levelStatuses = {
          error: true,
          warning: true,
          info: false,
          debug: false,
          trace: false
        };
    }
  }

  private async periodicUploaderAsync() {
    while (true) {
      if (this.messages.length > 0) {
        console.log(
          `Logger.periodicUploader - Sending ${this.messages.length} messages`
        );

        if (
          this.options.bufferSize &&
          this.messages.length > this.options.bufferSize
        ) {
          console.log(
            `Logger.periodicUploader - ${this.messages.length} messages exceeds buffer size of ${this.options.bufferSize}, not sending`
          );
          this.sendWarningMessageAsync();
        } else {
          await this.sendAsync();
        }
      }

      await SleepUtil.SleepAsync(this.options.sendIntervalMs);
    }
  }

  private logInternal(msg: any): void {
    if (this.closed) {
      throw new Error("Logger is already closed");
    }

    if (msg && msg !== "") {
      this.messages.push(msg);
    }

    // Check if it's time to send
    if (
      this.options.bufferSize &&
      this.messages.length >= this.options.bufferSize
    ) {
      this.trace("logInternal", "Logger - Buffer is full, sending messages");
      this.sendAsync();
    }
  }

  private payload(): string {
    let payload = "";

    for (let i = 0; i < this.messages.length; i += 1) {
      const message = Logger.safeObjectToJSON(this.messages[i]);
      if (message === "") continue;
      payload += `${message}\n`;
    }

    return payload;
  }

  private async sendWarningMessageAsync() {
    try {
      // Bail if we're not configured for upload
      if (!this.options.sumoURL) {
        // Clear the buffer
        this.messages = new Array<any>();
        return;
      }
      const message = {
        message: "Too many messages: buffer overflow hit",
        level: "ERROR",
        function: "sendWarningMessageAsync"
      };

      this.addMetadata(message);
      const msg = Logger.safeObjectToJSON(message);
      const payload = `${msg}\n`;

      const url = `${this.options.sumoURL}`;

      // Send the request
      const result = (await fetch(url, {
        method: "POST",
        body: payload
        // timeout: this.options.timeoutMs,
      })) as Response;

      // TODO: Eventually care about retrying if it fails...
      // NOTE: This just drops a chunk of logs on the floor if the upload fails

      if (!result.ok) {
        console.log(`Logger - Response not ok: ${result.status}`);
      } else {
        console.log("Logger - Upload appears to have worked");
      }
    } catch (error) {
      console.log(`Logger - Exception during upload: ${JSON.stringify(error)}`);
    }
  }

  private async sendAsync(): Promise<void> {
    try {
      // Bail if we're not configured for upload
      if (!this.options.sumoURL || this.options.sumoURL === "") {
        // Clear the buffer
        this.messages = new Array<any>();
        return;
      }

      const payload = this.payload();

      // Blank out the pending messages
      this.messages = new Array<any>();

      const url = `${this.options.sumoURL}`;

      // Send the request
      const result = (await fetch(url, {
        method: "POST",
        body: payload
        // timeout: this.options.timeoutMs,
      })) as Response;

      // TODO: Eventually care about retrying if it fails...
      // NOTE: This just drops a chunk of logs on the floor if the upload fails

      if (!result.ok) {
        console.log(`Logger - Response not ok: ${result.status}`);
      } else {
        console.log("Logger - Upload appears to have worked");
      }
    } catch (error) {
      console.log(`Logger - Exception during upload: ${JSON.stringify(error)}`);
    }
  }

  //
  // Public static interface
  //

  public static get instance(): Logger {
    return Logger._theLogger;
  }
}
