import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import {bootstrap} from './bootstrap/app';

bootstrap(); // !IMPORTANT :bootstrap the environment before importing other user custom modules

import {validateJWTTokenMiddleware} from './app/middleware/auth-middleware'

import storeFrontRouter from './routes/store-front';
import adminRouter from './routes/admin'

const port = process.env.PORT || 3000;
const app = express();

// Middleware definitions
app.disable('x-powered-by');

// CORS middleware
const customCOROptions = {
    origin: (origin, cb) => {
        if (!process.env.whitelist || process.env.whitelist.indexOf(origin) !== -1) {
            cb(null, true)
        } else {
            cb('Your IP address is not authorized for the request', false)
        }
    },
};

app.use(cors(customCOROptions));

app.use(express.json()); // form data to json
app.use(express.urlencoded({extended: true})); // support for multiform data

app.use(express.static(path.join(__dirname, 'public')));

app.use(validateJWTTokenMiddleware); // Token Authentication middleware

// router definition
app.use('/api/v1/store-front', storeFrontRouter); // store front for customer endpoints
app.use('/api/v1/admin', adminRouter); // admin router end point


// launch the server
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});
