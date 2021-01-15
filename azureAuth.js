import {
    signIn,
    signOut,
    msalApp,
    acquireToken,
    userAzureGraph,
    biGraph
} from "./msalConfiguration";
import {
    loginScope,
    photoScope,
    loginScopeBI
} from './scopeConfig';


export function* authUser() {
    try {
        const getUserAccount = yield msalApp.getAllAccounts();
        if (getUserAccount.length === 0) {
            yield signIn();
        } else {
            // ############################# User Auth agains Azure AD #############################
            // acquireToken to Authenticate User in Azure AD.
            const tokenResponse = yield acquireToken(loginScope);
            // Returns a object, example:
            console.log(
                tokenResponse.idToken,
                tokenResponse.accessToken,
                tokenResponse.account.username,
                tokenResponse.account.name,
                tokenResponse.idTokenClaims.preferred_username,
                tokenResponse.idTokenClaims.oid
            )

            // ############################# User PHOTO #############################
            // acquireToken to read User Photo from Azure AD.
            const tokenResponsePhoto = yield acquireToken(photoScope);
            // Use token to get User Photo
            const getUserData = yield userAzureGraph(tokenResponsePhoto.accessToken);
            // Returns a object, example:
            console.log(getUserData.userImage)

            // ############################# Integration with other Azure services #############################
            // acquireToken to Authenticate agains Power BI in Azure AD and read resource
            const getBIAccess = yield acquireToken(loginScopeBI);
            // Use token to get Power BI new Token, which can be used to direct integration
            const getBIToken = yield biGraph(getBIAccess.accessToken);
            // Return Power BI token, for Power BI access and integration, example
            console.log(getBIToken)
        }

    } catch (error) {
        yield signOut();
        console.warn('Error: ', error)
    }
}