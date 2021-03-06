import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {
  Http,
  Response,
  Headers,
  Request,
  RequestMethod,
  RequestOptions
} from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {
  UserType,
  UserData,
  AuthData,
  Angular2TokenOptions
} from './angular2-token.model';

@Injectable()
export class Angular2TokenService implements CanActivate {

  get currentUserType(): string {
    if (this._currentUserType != null) {
      return this._currentUserType.name;
    } else {
      return null;
    }
  }

  get currentUserData(): UserData {
    return this._currentUserData;
  }

  get currentAuthData(): AuthData {
    return this._currentAuthData;
  }

  private _options: Angular2TokenOptions;
  private _currentUserType: UserType;
  private _currentAuthData: AuthData;
  private _currentUserData: UserData;

  constructor(private _http: Http,
              private _activatedRoute: ActivatedRoute,
              private _router: Router) {
  }

  userSignedIn(): boolean {
    return !!this._currentAuthData;
  }

  canActivate() {
    if (this.userSignedIn()) {
      return true;
    } else {
      // Store current location in storage (usefull for redirection after signing in)
      if (this._options.signInStoredUrlStorageKey) {
        localStorage.setItem(
          this._options.signInStoredUrlStorageKey,
          window.location.pathname + window.location.search
        );
      }

      // Redirect user to sign in if signInRedirect is set
      if (this._options.signInRedirect) {
        this._router.navigate([this._options.signInRedirect]);
      }
      return false;
    }
  }

  // Inital configuration
  init(options?: Angular2TokenOptions) {

    const defaultOptions: Angular2TokenOptions = {
      apiPath: null,

      signInPath: 'auth/sign_in',
      signInRedirect: null,
      signInStoredUrlStorageKey: null,

      signOutPath: 'auth/sign_out',
      validateTokenPath: 'auth/validate_token',
      refreshTokenPath: 'auth/refresh_token',

      registerAccountPath: 'auth',
      deleteAccountPath: 'auth',
      registerAccountCallback: window.location.href,

      updatePasswordPath: 'auth',

      resetPasswordPath: 'auth/password',
      resetPasswordCallback: window.location.href,

      userTypes: null,

      oAuthPaths: {
        github: 'auth/github'
      },

      globalOptions: {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    };

    this._options = (<any>Object).assign(defaultOptions, options);

    this._tryLoadAuthData();
    this._tryRefreshToken();
  }

  // Register request
  registerAccount(email: string, password: string, passwordConfirmation: string, userType?: string): Observable<Response> {

    if (userType == null) {
      this._currentUserType = null;
    } else {
      this._currentUserType = this._getUserTypeByName(userType);
    }

    const body = JSON.stringify({
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      confirm_success_url: this._options.registerAccountCallback
    });

    return this.post(this._constructUserPath() + this._options.registerAccountPath, body);
  }

  // Delete Account
  deleteAccount(): Observable<Response> {
    return this.delete(this._constructUserPath() + this._options.deleteAccountPath);
  }

  // Sign in request and set storage
  signIn(email: string, password: string, userType?: string): Observable<Response> {

    if (userType == null) {
      this._currentUserType = null;
    } else {
      this._currentUserType = this._getUserTypeByName(userType);
    }

    const body = JSON.stringify({
      email: email,
      password: password
    });

    const observ = this.post(this._constructUserPath() + this._options.signInPath, body);

    observ.subscribe(res => {
      this._currentUserData = res.json().user;
      this.setToken(res.json());
    }, error => null);

    return observ;
  }

  setToken(data: any) {
    this._options.globalOptions.headers['Authorization'] = `JWT ${data.token}`;
    localStorage.setItem('token', `JWT ${data.token}`);
  }

  signInOAuth(oAuthType: string) {

    let oAuthPath: string;

    if (oAuthType === 'github') {
      oAuthPath = this._options.oAuthPaths.github;
    }

    window.open(this._constructUserPath() + oAuthPath);
  }

  // Sign out request and delete storage
  signOut(): boolean {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('client');
    localStorage.removeItem('expiry');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('uid');

    this._currentAuthData = null;
    this._currentUserType = null;
    this._currentUserData = null;

    return true;
  }

  // Validate token request
  validateToken(): Observable<Response> {
    let token = localStorage.getItem('token');
    if (token) {
      token = token.substr(4);
    }
    const observ = this.post(this._constructUserPath() + this._options.validateTokenPath, {token: token});

    observ.subscribe(res => this._currentUserData = res.json().user, error => null);

    return observ;
  }

  // refresh token
  refreshToken(token) {
    this._options.globalOptions.headers['Authorization'] = `JWT ${token}`;
    localStorage.setItem('token', `JWT ${token}`);
  }

  // Update password request
  updatePassword(password: string, passwordConfirmation: string, currentPassword?: string, userType?: string): Observable<Response> {

    if (userType != null) {
      this._currentUserType = this._getUserTypeByName(userType);
    }


    let body: string;

    if (currentPassword == null) {
      body = JSON.stringify({
        password: password,
        password_confirmation: passwordConfirmation
      });
    } else {
      body = JSON.stringify({
        current_password: currentPassword,
        password: password,
        password_confirmation: passwordConfirmation
      });
    }

    return this.put(this._constructUserPath() + this._options.updatePasswordPath, body);
  }

  // Reset password request
  resetPassword(email: string, userType?: string): Observable<Response> {

    if (userType == null) {
      this._currentUserType = null;
    } else {
      this._currentUserType = this._getUserTypeByName(userType);
    }

    const body = JSON.stringify({
      email: email,
      redirect_url: this._options.resetPasswordCallback
    });

    return this.post(this._constructUserPath() + this._options.resetPasswordPath, body);
  }

  // Standard HTTP requests
  get(path: string): Observable<Response> {
    return this.sendHttpRequest(new RequestOptions({
      method: RequestMethod.Get,
      url: this._constructApiPath() + path
    }));
  }

  post(path: string, data: any): Observable<Response> {
    return this.sendHttpRequest(new RequestOptions({
      method: RequestMethod.Post,
      url: this._constructApiPath() + path,
      body: data
    }));
  }

  put(path: string, data: any): Observable<Response> {
    return this.sendHttpRequest(new RequestOptions({
      method: RequestMethod.Put,
      url: this._constructApiPath() + path,
      body: data
    }));
  }

  delete(path: string): Observable<Response> {
    return this.sendHttpRequest(new RequestOptions({
      method: RequestMethod.Delete,
      url: this._constructApiPath() + path
    }));
  }

  patch(path: string, data: any): Observable<Response> {
    return this.sendHttpRequest(new RequestOptions({
      method: RequestMethod.Patch,
      url: this._constructApiPath() + path,
      body: data
    }));
  }

  head(path: string): Observable<Response> {
    return this.sendHttpRequest(new RequestOptions({
      method: RequestMethod.Head,
      url: this._constructApiPath() + path
    }));
  }

  options(path: string): Observable<Response> {
    return this.sendHttpRequest(new RequestOptions({
      method: RequestMethod.Options,
      url: this._constructApiPath() + path
    }));
  }

  // Construct and send Http request
  sendHttpRequest(requestOptions: RequestOptions): Observable<Response> {

    let baseRequestOptions: RequestOptions;
    const baseHeaders: { [key: string]: string; } = this._options.globalOptions.headers;

    // Merge auth headers to request if set
    if (this._currentAuthData != null) {
      (<any>Object).assign(baseHeaders, {
        'token': this._currentAuthData.token,
        'access-token': this._currentAuthData.accessToken,
        'client': this._currentAuthData.client,
        'expiry': this._currentAuthData.expiry,
        'token-type': this._currentAuthData.tokenType,
        'uid': this._currentAuthData.uid
      });
    }

    baseRequestOptions = new RequestOptions({
      headers: new Headers(baseHeaders)
    });

    // Merge standard and custom RequestOptions
    baseRequestOptions = baseRequestOptions.merge(requestOptions);

    const response = this._http.request(new Request(baseRequestOptions)).share();

    this._handleResponse(response);

    return response;
  }

  // Check if response is complete and newer, then update storage
  private _handleResponse(response: Observable<Response>) {
    response.subscribe(res => {
      this._parseAuthHeadersFromResponse(<any>res);
    }, error => {
      this._parseAuthHeadersFromResponse(<any>error);
      console.error('Session Service: Error Fetching Response');
    });
  }

  private _parseAuthHeadersFromResponse(data: any) {
    const headers = data.headers;
    let token = localStorage.getItem('token')
      || this._options.globalOptions.headers['Authorization']
      || data.json().token;
    token = token.replace(/^JWT /, '');
    const authData: AuthData = {
      token: token,
      accessToken: headers.get('access-token'),
      client: headers.get('client'),
      expiry: headers.get('expiry'),
      tokenType: headers.get('token-type'),
      uid: headers.get('uid')
    };
    this._setAuthData(authData);
  }

  // Try to get auth data from storage.
  private _getAuthDataFromStorage() {

    const authData: AuthData = {
      token: localStorage.getItem('token'),
      accessToken: localStorage.getItem('accessToken'),
      client: localStorage.getItem('client'),
      expiry: localStorage.getItem('expiry'),
      tokenType: localStorage.getItem('tokenType'),
      uid: localStorage.getItem('uid')
    };

    if (this._checkIfComplete(authData)) {
      this._currentAuthData = authData;
    }
  }

  // Try to get auth data from url parameters.
  private _getAuthDataFromParams() {
    if (this._activatedRoute.queryParams) {// Fix for Testing, needs to be removed later
      this._activatedRoute.queryParams.subscribe(queryParams => {
        const authData: AuthData = {
          token: queryParams['token'],
          accessToken: queryParams['token'],
          client: queryParams['client_id'],
          expiry: queryParams['expiry'],
          tokenType: 'Bearer',
          uid: queryParams['uid']
        };

        if (this._checkIfComplete(authData)) {
          this._currentAuthData = authData;
        }

      });
    }
  }


  // Write auth data to storage
  private _setAuthData(authData: AuthData) {
    if (this._checkIfComplete(authData) && this._checkIfNewer(authData)) {
      this._currentAuthData = authData;

      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('client', authData.client);
      localStorage.setItem('expiry', authData.expiry);
      localStorage.setItem('tokenType', authData.tokenType);
      localStorage.setItem('uid', authData.uid);

      if (this._currentUserType != null) {
        localStorage.setItem('userType', this._currentUserType.name);
      }
    }
  }

  // Check if auth data complete
  private _checkIfComplete(authData: AuthData): boolean {
    return authData.token != null; // &&
    // authData.client != null &&
    // authData.expiry != null &&
    // authData.tokenType != null &&
    // authData.uid != null;
  }

  // Check if response token is newer
  private _checkIfNewer(authData: AuthData): boolean {
    // if (this._currentAuthData != null) {
    //   return authData.expiry >= this._currentAuthData.expiry;
    // } else {
    //   return true;
    // }
    return true;
  }

  // Try to refresh token
  private _tryRefreshToken() {
    let token = localStorage.getItem('token');
    if (token) {
      token = token.substr(4);
      this.post(this._constructUserPath() + this._options.refreshTokenPath, {token: token}).subscribe(res => {
        let newToken = res.json().token;
        this._currentUserData = res.json().user;
        this.refreshToken(newToken);
      }, error => {
        this.signOut();
      });
    }
  }

  // Try to load user config from storage
  private _tryLoadAuthData() {

    const userType = this._getUserTypeByName(localStorage.getItem('userType'));
    if (userType) {
      this._currentUserType = userType;
    }
    this._getAuthDataFromStorage();
    this._getAuthDataFromParams();

    if (this._currentAuthData != null) {
      this.validateToken();
    }
  }

  // Match user config by user config name
  private _getUserTypeByName(name: string): UserType {
    if (name == null || this._options.userTypes == null) {
      return null;
    }

    return this._options.userTypes.find(
      userType => userType.name === name
    );
  }

  private _constructUserPath(): string {
    if (this._currentUserType == null) {
      return '';
    } else {
      return this._currentUserType.path + '/';
    }

  }

  private _constructApiPath(): string {
    if (this._options.apiPath == null) {
      return '';
    } else {
      return this._options.apiPath + '/';
    }
  }
}
