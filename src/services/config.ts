import globalConfigDebug from "../ConfigGlobalDebug.json";
import globalConfigStaging from "../ConfigGlobalStaging.json";
import globalConfigProd from "../ConfigGlobalProd.json";

export interface ConfigGlobal {
  readonly version: string;
  readonly apiBaseUrl: string;
  readonly uiBaseUrl: string;
  readonly googleAnalyticsId: string;
  readonly intercomId: string;
}

//
// NOTE: The global config file is static and compiled into the JS bundle.
// Because the file is included in the bundle, as code, it's loading is synchronous and immediate,
// not async.  This makes the global config a little easier to work with than if it was opened
// as a user file.
//

class ConfigGlobalLoader {
  private static configGlobal: ConfigGlobal;

  private static Load(): ConfigGlobal {
    let config: ConfigGlobal = globalConfigDebug;

    if (process.env.REACT_APP_ENV === "local") {
      config = globalConfigDebug;
    } else if (process.env.REACT_APP_ENV === "staging") {
      config = globalConfigStaging;
    } else if (process.env.REACT_APP_ENV === "prod") {
      config = globalConfigProd;
    }

    return config;
  }

  public static get config(): ConfigGlobal {
    if (ConfigGlobalLoader.configGlobal === undefined) {
      ConfigGlobalLoader.configGlobal = ConfigGlobalLoader.Load();
    }
    return ConfigGlobalLoader.configGlobal;
  }
}

export default ConfigGlobalLoader;
