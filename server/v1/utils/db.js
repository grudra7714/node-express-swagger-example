import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connect = function ()  {
    const MONGODB_URL = process.env.MONGODB_URL;

    let { MONGO_HOST, MONGO_PORT, MONGO_USER, MONGO_PASSWORD, MONGO_DB} = process.env;

    // Assemble required env and build the connection string for mongodb to use
    // Also, the encodeURIComponent is used to make sure we encode any special characters.

    const connectionString = "mongodb://" + MONGO_USER + ":" + encodeURIComponent(MONGO_PASSWORD) + "@" + MONGO_HOST + ":" + MONGO_PORT + "/" + MONGO_DB;

    // TODO: Set up a promise response

    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        //don't show the log when it is test
        if (process.env.NODE_ENV !== "test") {
            console.log("Connected to %s", MONGODB_URL);
            console.log("App is running ... \n");
            console.log("Press CTRL + C to stop the process. \n");
        }
    })
    .catch(err => {
        console.error("App starting error:", err.message);
        process.exit(1);
    });
}

export const db = mongoose.connection;