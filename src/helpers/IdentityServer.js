import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client';

import { identityServerConfig } from '../constants/defaultValues.js';
import axios from 'axios';


export class AuthService {
  userManager
  user
  currentUser = null

  constructor() {
    const settings = {
      userStore: new WebStorageStateStore({ store: localStorage }),
      authority: identityServerConfig.stsAuthority,
      //require_https_metadata: false,
      client_id: identityServerConfig.clientId,
      //client_name: Constants.clientName,
      client_secret: identityServerConfig.clientSecret,
      redirect_uri: `${identityServerConfig.clientRoot}/callback`,
      silent_redirect_uri: `${identityServerConfig.clientRoot}silent-refresh`,
      // tslint:disable-next-line:object-literal-sort-keys
      post_logout_redirect_uri: `${identityServerConfig.clientRoot}`,
      response_type: 'code',
      response_mode: 'query',
      //grant_type: 'password',
      //username: 'bob',
      //password: 'bob',
      scope: identityServerConfig.clientScope,
      filterProtocolClaims: true,
      loadUserInfo: true,
      state: 'abc',
      nonce: 'xyz'
      //userStore: new WebStorageStateStore(webSettings)
    };

    this.userManager = new UserManager(settings);

    this.userManager.events.addUserLoaded(user => {
      this.currentUser = user;
    });

    this.userManager.events.addUserUnloaded(() => {
      this.currentUser = null
    });

    Log.logger = console;
    Log.level = Log.INFO;
  }

getUser() {
  return this.userManager.getUser()
  }

  getCurrentUser() {
    return this.currentUser;
  }


setUser(user) {
  this.userManager.storeUser(user);
}

isUserLoggedIn() {
  return this.user;
}

  async signin() {
    return await this.userManager.signinRedirect().then((user) => {
      console.log(user, 'ssss')
    });
  }

  async redirect() {
    return await this.userManager.signinRedirectCallback().then(user => {
      this.user = user;
    })
  }

  async signInWithUsernameAndPassword(username, password) {
    return await axios.post('https://mypay-identity-provider.azurewebsites.net/api/authentication', {
      username: username,
      password: password,
      returnUrl: 'https://mypay-application.azurewebsites.net/'
    });
  }

  onRedirectSuccess = (user) => {
    //this.userManager.signinRedirectCallback(user);
    console.log(user, 'success');
    //this.setUser(user);
  };

  onRedirectError = (error) => {
    console.log(error);
  };

  async completeLogin2() {
    await this.userManager.signinRedirectCallback().then(user => {
      this.user = user;
    })
  }

  login = async () => {
    return await this.userManager.signinRedirect()
      .then((user) => this.onRedirectSuccess(user))
      .catch((error) => this.onRedirectError(error));
  }

  onRedirectSuccess = (user) => {
    //this.userManager.signinRedirectCallback(user);
    console.log(user, 'success');
    //this.setUser(user);
  };

  onRedirectError = (error) => {
    console.log(error);
  };

  completeLogin = async () => {
    this.user = true;
    return await this.userManager.signinRedirectCallback();
  }

  renewToken() {
    return this.userManager.signinSilentCallback();
  }

  logout() {
    this.user = false;
    return this.userManager.signoutRedirect({post_logout_redirect_uri: "https://mypay-application.azurewebsites.net/"});
  }
}
