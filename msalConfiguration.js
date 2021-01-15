import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig, photoScope, loginScope } from './scopeConfig';


// https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications
// Initialize MSAL.js 2.x apps
export const msalApp = new PublicClientApplication(msalConfig);

export const getAccounts = () => {
    let username = '';
    const currentAccounts = msalApp.getAllAccounts();

    console.log('handleResponse : ', currentAccounts)
    if (currentAccounts === null) {
        console.error("No accounts detected!");
        return;
    } else if (currentAccounts.length > 1) {
        // Add choose account code here
        console.warn("Multiple accounts detected.");
        username = currentAccounts[0].username;
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].username;
    }
    console.log('After getAccounts UserName:', username)
}

export const handleResponse = (response) => {
    if (response !== null) {
        username = response.account.username;
        console.log('After handleResponse UserName:', username)
    } else {
        /**
         * See here for more info on account retrieval: 
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
         */
        getAccounts();
    }
}

export const acquireToken = async (tokenType) => {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    const getUser = msalApp.getAllAccounts();
    tokenType.account = getUser[0];

    // Do not redirect to other page with acquireTokenSilent, if fails - redirect
    return msalApp.acquireTokenSilent(tokenType)
        .catch(error => {
            console.warn("silent token acquisition fails. acquiring token using redirect");
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                tokenType.account = getUser[0];

                return msalApp.acquireTokenRedirect(tokenType)
                    .then(handleResponse)
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                console.warn(error);
            }
        });
}

// Function to signIn the user
export const signIn = async () => {
    return msalApp.loginRedirect(photoScope);
}
// Function to signOut the user
export const signOut = async () => {
    const logoutRequest = {
        // account: msalApp.getAccountByUsername(username)
        account: msalApp.getAllAccounts()[0]
    };

    return msalApp.logout(logoutRequest);
}

// Graph EndPoints in Azure AD. We ask them to retrieve user data.
export const GRAPH_ENDPOINTS = {
    MEGROUPS: "https://graph.microsoft.com/v1.0/me/checkMemberObjects",
    MAIL: "https://graph.microsoft.com/v1.0/me/messages",
    PHOTO: "https://graph.microsoft.com/v1.0/me/photo/$value"
};

// Fetch data from provided Graph Endpoint
export const fetchMsGraph = async (url, method, accessToken, body = null) => {
    let response;
    if (body) {
        response = await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': "application/json"
            }
        });
    } else {
        response = await fetch(url, {
            method: method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': "application/json"
            }
        });
    }

    return response.json();
};

// Fetch User Photo from provided Graph Endpoint.
export const fetchMsGraphPhoto = async (url, accessToken) => {
    let response;

    response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': "image/jpg"
        }
    });

    return response;
};

// Returns any data from Azure AD per the user like, isAdmin, Photo etc.
export const userAzureGraph = async (accessToken) => {
    let isAdmin = false;
    let photoURL = false;

    const ids = ["<it can be Azure IDs of Groups>"];

    if (accessToken) {
        await fetchMsGraph(
            GRAPH_ENDPOINTS.MEGROUPS,
            "post",
            accessToken,
            {
                "ids": ids
            }
        ).then(data => {
            // Assign any data
            isAdmin = data.value.includes(adminID);
        })

        // Get User Image and set Base64 to PhotoURL
        const graphProfilePhoto = await fetchMsGraphPhoto(
            GRAPH_ENDPOINTS.PHOTO,
            accessToken
        );
        
        // Create readable stream in new Response and convert to blob format.
        const getReader = graphProfilePhoto.body.getReader();
        let stream = new ReadableStream({
            start(controller) {
                return pump();
                function pump() {
                    return getReader.read().then(({ done, value }) => {
                        // When no more data needs to be consumed, close the stream
                        if (done) {
                            controller.close();
                            return;
                        }
                        // Enqueue the next data chunk into our target stream
                        controller.enqueue(value);
                        return pump();
                    });
                }
            }
        });

        let response = new Response(stream);
        let blob = await response.blob();

        // Convert blob to Base64, so we can use it in HTML for example
        const blobToBase64 = blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise(resolve => {
                reader.onloadend = () => {
                    resolve(reader.result);
                };
            });
        };

        await blobToBase64(blob).then(res => {
            photoURL = res;
        });
    }

    // Return all data that you need in Object
    return {
        isAdmin: isAdmin,
        userImage: photoURL
    }
}


// BI GRAPHs Endpoint
const BI_TOKEN_API = "https://api.powerbi.com/v1.0/myorg/GenerateToken"

// Fetch for Power BI, where we need to set our IDs for datasets or reports.
export const fetchBIToken = async (url, accessToken) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "datasets": [
                {
                    "id": "<id>"
                }
            ],
            "reports": [
                {
                    "id": "<id>"
                }
            ]
        }),
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
    })
};

// Call and get Power BI token, which will have access to all configuret datasets and reports above.
export const biGraph = async (accessToken) => {
    if (accessToken) {
        return await fetchBIToken(
            BI_TOKEN_API,
            accessToken
        )
            .then(res => res.json())
            .then(result => result.token ? result.token : result.error.code)
            .catch(error => console.error(error));
    }
}