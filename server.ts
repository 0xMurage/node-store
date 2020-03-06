import * as express from 'express';
import * as path from 'path';

import {bootstrap} from './bootstrap/app';

bootstrap(); // !IMPORTANT :bootstrap the environment before importing other user custom modules

import {validateJWTTokenMiddleware} from './app/middleware/auth-middleware'

import storeFrontRouter from './routes/store-front';

const port = process.env.PORT || 3000;
const app = express();

// Middleware definitions
app.disable('x-powered-by');
app.use(express.json()); // form data to json
app.use(express.urlencoded({extended: true})); // support for multiform data

app.use(express.static(path.join(__dirname, 'public')));

app.use(validateJWTTokenMiddleware); // Token Authentication middleware

// router definition
app.use('/api/v1/store-front', storeFrontRouter); // store front for customer endpoints


// launch the server
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});
