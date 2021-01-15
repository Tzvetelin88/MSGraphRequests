// For a full list of msal.js configuration parameters, 
// visit https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md

export const msalConfig = {
    auth: {
        clientId: "<Application (client) ID>",
        authority: "https://login.microsoftonline.com/<Directory (tenant) ID>",
        // redirectUri: 'http://localhost:3000/',
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

const GRAPH_SCOPES = {
    OPENID: "openid",
    PROFILE: "profile",
    USER_READ: "User.Read",
    APP: "api://<Directory (tenant) ID>/<api_name>",
};

const GRAPH_SCOPES_BI = {
    PBI: "https://analysis.windows.net/powerbi/api/Report.Read.All"
};

// Set respective Scopes per type
export const GRAPH_REQUESTS = {
    LOGIN: {
        scopes: [
            GRAPH_SCOPES.USER_READ,
            GRAPH_SCOPES.OPENID,
            GRAPH_SCOPES.PROFILE
        ]
    },
    GROUP: {
        scopes: [GRAPH_SCOPES.USER_READ]
    },
    BI: {
        scopes: [
            GRAPH_SCOPES_BI.PBI
        ]
    },
};

// Authenticate agains Azure AD - oAuth
export const loginScope = {
    scopes: GRAPH_REQUESTS.LOGIN.scopes,
}

// Read object in Graph for User Photo
export const photoScope = {
    scopes: GRAPH_REQUESTS.GROUP.scopes,
};

// Integrate with another Azure Service like Power BI
export const loginScopeBI = {
    scopes: GRAPH_REQUESTS.BI.scopes
}