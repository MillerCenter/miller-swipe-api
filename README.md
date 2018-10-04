# miller-swipe-api
A serverless rest api that scrapes the Miller Center's event records. The only reason this exists is because [google scripts](https://www.google.com/script/start/) does not currently support [ntlm](https://en.wikipedia.org/wiki/NT_LAN_Manager) as an authentication protocol. 


### prereq
1. Set up a [serverless account](https://serverless.com/framework/docs/providers/aws/guide/installation/) 

2. Set up [AWS Credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/)


## Start the api

### rename the config template 
``mv config.template.js config.js``

Change the config variables for username, password, and domain 

``npm install``

### to run locally 
``serverless offline start``

## deploy
``serverless deploy``
