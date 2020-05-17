import express from 'express';
var app = express(); // Start the express server
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import spec from './v1/swagger';
import swaggerUi from 'swagger-ui-express';

import { connect } from './v1/utils/db';
import { getClient } from './v2/utils/db';
import indexRouter from './v1/routes/index';
import visitsRouterV1 from './v1/routes/visits';
import visitsRouterV2 from "./v2/routes/visits";
import * as apiResponse from  './v1/helpers/apiResponse';

// Set up db connection for v1 api
connect();
// Set up connection for v2 api
getClient();

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`)
        else
            next()
    })
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true}));

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/v1/visit', visitsRouterV1);
app.use('/v2/visit', visitsRouterV2);

// throw 404 if URL not found
app.all("*", function (req, res) {
    return apiResponse.NotFoundResponse(res, "Page not found yo!");
});

export default app;
