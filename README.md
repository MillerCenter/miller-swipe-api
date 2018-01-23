# miller-swipe-api
A serverless rest api that scrapes the Miller Center's event records. The only reason this exists is because [google scripts](https://www.google.com/script/start/) does not currently support [ntlm](https://en.wikipedia.org/wiki/NT_LAN_Manager) as an authentication protocol. 

## run
``mv config.template.js config.js``

Change the config variables 

``npm install``

``node index.js``
## deploy
``serverless deploy``
