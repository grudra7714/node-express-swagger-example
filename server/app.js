import express from 'express';
var app = express(); // Start the express server
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import spec from './v1/swagger';
import swaggerUi from 'swagger-ui-express';

import { connect } from './v1/utils/db';
import indexRouter from './v1/routes/index';
import visitsRouter from './v1/routes/visits';
import * as apiResponse from  './v1/helpers/apiResponse';

// Set up db connection 
connect();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true}));

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/visit', visitsRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
    return apiResponse.NotFoundResponse(res, "Page not found yo!");
});

export default app;
