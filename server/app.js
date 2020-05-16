import express from 'express';
var app = express(); // Start the express server
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { connect } from './utils/db';
import indexRouter from './routes/index';
import visitsRouter from './routes/visits';
import * as apiResponse from  './helpers/apiResponse';



// Set up db connection 
connect();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/visits', visitsRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
    return apiResponse.NotFoundResponse(res, "Page not found yo!");
});

export default app;
