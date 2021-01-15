# MSGraphRequests
Async way to get data from Microsoft Graph with Axios. Names, Pictures, Emails etc.
1. Register Azure Application Registration - follow simple steps in "Azure_Application_Registration".
   Read More here: https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app

2. Set Graph Scopes.
   Graph Scopes are diffent for each Graph Endpoint and the level of access that we need to have to read data
   scopeConfig.js - have 3 diffent scopes - Login, Group and BI (Power BI Example integration) and msalConfig for main auth.
   
3. Get data from MS REST API Graph
   msalConfiguration.js - contains all needed functions to get accessTokens, call Graph Endpoints with respective accessTokens.
 
4. Combine everything
   azureAuth.js - combine everything in one place and call all functions one by one with *yield
   

