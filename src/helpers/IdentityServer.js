import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client';

import { identityServerConfig } from '../constants/defaultValues.js';
import axios from 'axios';


export class AuthService {
  userManager
  user

  constructor() {
    const settings = {
      userStore: new WebStorageStateStore({ store: window.localStorage }),
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

    Log.logger = console;
    Log.level = Log.INFO;
  }

  // public async getUser(): Promise<User | null> {
  //   const user = await this.userManager.getUser();
  //   return user;
  // }

//   getUser() {
//     const usr = this.userManager.getUser();
//     // if (!user) {
//     //   return await this.userManager.signinRedirectCallback();
//     // }

//     return usr;
// }

getUser = async () => {
  return await this._userManager.getUser().then((user) => {
    console.log(user.access_token, 'moje')
  });
  
  }

async postCall (data) {
  const response = await fetch('http://localhost:5000/api/auth', {
      method: 'POST',
      forms: {
        grant_type: 'authorization_code',
        client_id: 'spa',
        code_verifier: '1cec975724fc439184a761746b4661213e406791360b4fa19cb2f6d109e0d2d2fd0504e5ae204139809b758cd5bc061b',
        code: '1cec975724fc439184a761746b4661213e406791360b4fa19cb2f6d109e0d2d2fd0504e5ae204139809b758cd5bc061b',
        redirect_uri: 'http://localhost:3000'
      },
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      //   'Access-Control-Allow-Credentials': true,
      //   'Access-Control-Allow-Headers': '*',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    return response.json();
}

async login2() {
  // await this.userManager.signinRedirect().then((data) => {
  //   console.log(data, 'data');
  // }).catch((error) => console.log(error, 'ERROR!'));
  await this.postCall ({
    username: 'bob',
    password: 'bob',
    returnUrl: 'http://localhost:3000/user/login'
  })
    .then(authUser => {
      console.log(authUser, 'ajmo matori')
      //this.setUser(authUser);
    })
    .catch(error => error);
    await this.completeLogin(). then(() => {
      console.log(this.user, 'ajde vise2')
    }
    );
}

setUser(user) {
  this.userManager.storeUser(user);
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
    return await axios.post('http://localhost:5000/api/authentication', {
      username: username,
      password: password,
      returnUrl: 'http://localhost:3000/'
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
    return await this.userManager.signinRedirectCallback().then(user => {
      this.user = user;
    })
  }


  // public async login(): Promise<any> {
  //   return await this.userManager.signinRedirect().then(user => {
  //     console.log(user, 'user')
  //     this.userManager.storeUser(user);
  //   }, error => {
  //     console.error(error);
  //   });
  // }

  renewToken() {
    return this.userManager.signinSilentCallback();
  }

  logout() {
    return this.userManager.signoutRedirect({post_logout_redirect_uri: "http://localhost:3000"});
  }
}
