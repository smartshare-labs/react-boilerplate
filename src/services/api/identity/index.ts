// Services
import ConfigGlobalLoader from "../../config";
import BaseAPI from "../base";

// Load global config
const configGlobal = ConfigGlobalLoader.config;

class IdentityAPI extends BaseAPI {
  public static async Login(email: string, password: string) {
    let responseBody = await this._post("login", {
      email,
      password,
    });

    return responseBody;
  }

  public static async GetTwitterAuthUrl() {
    let responseBody = await this._post("twitterauth", {});
    return responseBody;
  }

  public static async PostTwitterAccessToken(
    oauth_token: string,
    oauth_verifier: string
  ) {
    let responseBody = await this._post("twitterauth", {
      oauth_token,
      oauth_verifier,
    });

    return responseBody;
  }

  public static async Signup(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) {
    let responseBody = await this._post("signup", {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    });

    return responseBody;
  }

  public static async UpdateUser(
    firstName?: string,
    lastName?: string,
    bio?: string,
    imageSource?: string,
    email?: string
  ) {
    let responseBody = await this._post("user", {
      action: "update",
      first_name: firstName,
      last_name: lastName,
      bio: bio,
      image_url: imageSource,
      email: email,
    });

    return responseBody;
  }

  public static async GetUserInfo() {
    let responseBody = await this._post("user", {
      action: "retrieve",
    });

    return responseBody;
  }

  public static async GetUserProfile(id: string) {
    let responseBody = await this._post("profile", {
      action: "retrieve",
      profile_url: id,
    });

    return responseBody;
  }

  public static async UploadImage(data: any) {
    let responseBody = await this._post("upload_image", {
      action: "create",
      data: data,
    });

    return responseBody;
  }
}

export default IdentityAPI;
