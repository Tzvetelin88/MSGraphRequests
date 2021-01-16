# MSGraphRequests - Initialize MSAL.js 2.x apps
Async way to get data from Microsoft Graph with Fetch.
Get Names, Pictures, Emails, Integrate with other services like Power BI, etc.
1. Register Azure Application Registration - follow simple steps in "Azure_Application_Registration".
   Read More here: https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app

2. Set Graph Scopes.
   Graph Scopes are diffent for each Graph Endpoint and the level of access that we need to have to read data
   scopeConfig.js - have 3 diffent scopes - Login, Group and BI (Power BI Example integration) and msalConfig for main auth.
   
3. Get data from MS REST API Graph
   msalConfiguration.js - contains all needed functions to get accessTokens, call Graph Endpoints with respective accessTokens.
 
4. Combine everything
   azureAuth.js - combine everything in one place and call all functions one by one with *yield
   

