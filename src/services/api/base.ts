import * as HttpStatus from "http-status-codes";

// Services
import ConfigGlobalLoader from "../config";
import Logger, { LogLevel } from "../logger";

// Load global config
const configGlobal = ConfigGlobalLoader.config;

export interface ApiCallback {
  updateCallsLoading: Function;
}

class APIService {
  private static authToken: string | undefined = undefined;
  private static callbacks: ApiCallback | undefined = undefined;
  private static headers: any = {
    "Content-Type": "application/json",
  };

  private static _requestSucceeded(responseStatus: number) {
    let requestSucceeded: boolean = true;
    switch (responseStatus) {
      case HttpStatus.OK:
      case HttpStatus.CREATED:
      case HttpStatus.NO_CONTENT:
        break;
      default:
        requestSucceeded = false;
    }

    return requestSucceeded;
  }

  public static setAuthToken(authToken: string) {
    this.authToken = authToken;
  }

  public static setCallbacks(callbacks: ApiCallback) {
    this.callbacks = callbacks;
  }

  protected static async _post(path: string, requestBody: any, headers?: any) {
    // Set auth token if we have one
    if (headers) {
      headers = { ...headers, Authorization: `identity ${this.authToken}` };
    } else {
      this.headers = {
        ...this.headers,
        Authorization: `identity ${this.authToken}`,
      };
    }

    let response = undefined;
    this.callbacks?.updateCallsLoading(1);

    try {
      response = await fetch(`${configGlobal.apiBaseUrl}/${path}`, {
        method: "POST",
        headers: headers ? headers : this.headers,
        body: JSON.stringify(requestBody),
      });
    } catch (e) {
      // do nothing
    } finally {
      this.callbacks?.updateCallsLoading(-1);
    }

    if (!response) {
      return undefined;
    }

    let requestSucceeded = this._requestSucceeded(response.status);
    if (!requestSucceeded) {
      return undefined;
    }

    if (!response) {
      return undefined;
    }

    try {
      return await response.json();
    } catch (error) {
      return response;
    }
  }
}

export default APIService;
