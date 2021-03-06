export interface AuthData {
    token:          string;
    accessToken:    string;
    client:         string;
    expiry:         string;
    tokenType:      string;
    uid:            string;
}

export interface UserData {
    id:             number;
    provider:       string;
    uid:            string;
    name:           string;
    nickname:       string;
    image:          any;
    email:          string;
    role:           number;
    group_id:       number;
}

// Configuration Options

export interface UserType {
    name:           string;
    path:           string;
}

export interface OAuthPaths {
    github?:        string;
}

export interface GlobalOptions {
    headers?:       { [key: string]: string; };
}

export interface Angular2TokenOptions {
    apiPath?:                   string;

    signInPath?:                string;
    signInRedirect?:            string;
    signInStoredUrlStorageKey?: string;

    signOutPath?:               string;
    validateTokenPath?:         string;
    refreshTokenPath?:          string;

    deleteAccountPath?:         string;
    registerAccountPath?:       string;
    registerAccountCallback?:   string;

    updatePasswordPath?:        string;

    resetPasswordPath?:         string;
    resetPasswordCallback?:     string;

    userTypes?:                 UserType[];

    oAuthPaths?:                OAuthPaths;

    globalOptions?:             GlobalOptions;
}
