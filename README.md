# node-express-swagger-example
Simple application for demonstrating swagger integration with node.js


# Installation

1. Clone this repo using the following command.

```
 git clone git@github.com:grudra7714/node-express-swagger-example.git

```

2. `npm install` all the dependencies.
3. Create an `.env` file and add the following contents

```
MONGO_HOST=<host>
MONGO_PORT=<port>
MONGO_DB=<db-name>
MONGO_USER=<user>
MONGO_PASSWORD=<password>
```

# API

There are 2 versions

- v1 
- v2 

v1 and v2 are created only for performance reasons. Ideally for high traffic sites, we should use a combination of v1 and v2 endpoints.

* `v1` version uses MongoDB.
The docs for this api can be found [here](https://node-express-swagger.herokuapp.com/api-docs)


* `v2` version uses Redis.
https://node-express-swagger.herokuapp.com/api-docs-v2