# deis-node

## Install

```
npm install --save deis-node
```

## Usage

See [./src/index.js](./src/index.js#L75) for full usage.

```javascript
import initDeis from 'deis';
// if no options specified, reads ~/.deis/client.json
const deis = initDeis({
  controller: 'http://deis.local3.deisapp.com',
  token: 'some token',
});

deis.apps.list().then((res) => {
  console.log(res);
}).catch((err) => {
  console.error(err);
});

console.log(deis);

/*
{ apps:
   { get: [Function: get],
     del: [Function: del],
     list: [Function: list],
     create: [Function: create],
     config: [Function: config],
     builds: [Function: builds],
     limits: [Function: limits],
     releases: [Function: releases],
     containers: [Function: containers],
     domains: [Function: domains],
     scale: [Function: scale],
     logs: [Function: logs],
     run: [Function: run],
     calculate: [Function: calculate],
     perms: [Function: perms] },
  clusters:
   { get: [Function: get],
     del: [Function: del],
     list: [Function: list],
     create: [Function: create] },
  keys:
   { get: [Function: get],
     del: [Function: del],
     list: [Function: list],
     create: [Function: create] },
  auth:
   { register: [Function: register],
     del: [Function: del],
     login: [Function: login],
     logout: [Function: logout],
     apiKey: [Function: apiKey] },
  admin:
   { list: [Function: list],
     del: [Function: del],
     create: [Function: create] } }
*/

deis.apps.config('appId')
/*
{ list: [Function: list], create: [Function: create] }
*/
deis.apps.builds('appId')
/*
{ list: [Function: list],
  create: [Function: create],
  get: [Function: get] }
*/
deis.apps.limits('appId')
/*
{ get: [Function: get], create: [Function: create] }
*/
deis.apps.releases('appId')
/*
{ get: [Function: get],
  list: [Function: list],
  rollback: [Function: rollback] }
*/
deis.apps.containers('appId')
/*
{ list: [Function: list] }
*/
deis.apps.domains('appId')
/*
{ list: [Function: list],
  del: [Function: del],
  create: [Function: create] }
*/

deis.apps.list().then(console.log);
/*
{ count: 1,
  next: null,
  previous: null,
  results:
   [ { uuid: '8970bd16-47bc-4588-a302-bc6475473998',
       id: 'rocket',
       owner: 'olalonde',
       url: 'rocket.local3.deisapp.com',
       structure: {},
       created: '2016-01-24T19:53:18UTC',
       updated: '2016-01-24T19:53:18UTC' } ] }
*/
deis.apps.get('rocket').then(console.log);
/*
{ uuid: '8970bd16-47bc-4588-a302-bc6475473998',
  id: 'rocket',
  owner: 'olalonde',
  url: 'rocket.local3.deisapp.com',
  structure: {},
  created: '2016-01-24T19:53:18UTC',
  updated: '2016-01-24T19:53:18UTC' }
*/
deis.apps.config('rocket').list().then(console.log);
/*
{ uuid: 'bef80287-0003-470a-8c88-6f455b44fcc3',
  app: 'rocket',
  owner: 'olalonde',
  values:
   { BUILDPACK_URL: 'https://github.com/olalonde/heroku-buildpack-meteor.git',
     HEROKU_APP_NAME: 'rocket' },
  memory: {},
  cpu: {},
  tags: {},
  created: '2016-01-24T20:12:37UTC',
  updated: '2016-01-24T20:12:37UTC' }
*/
```

## Test

```
DEIS_CONTROLLER=http://deis.domain.com DEIS_TOKEN=... npm test
```
