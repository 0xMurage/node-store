import * as config from '../.env.json';
let env = process.env.NODE_ENV; // default env


/**
 * Boots the app services + loads the environment configuration from .env
 * Reads the .env.json file found on the root of the project & loads the config into the environment
 *
 */

export const bootstrap = () => {
    const c:any = {...{}, ...config}; // deep copy
    if (c.database) { // If database config exist, do not load into environment process variables

        delete c.database; // then delete the object

    }

    if (!env) { // Defined the environment if not provided by runtime process
        env = c.APP_ENV || 'development';
    }

    loadConfiguration(c); // load the overall configuration
};

/**
 * This function does not overwrites existing environment configuration
 * @param data
 */
function loadConfiguration(data: { [key: string]: any }) {
    Object.defineProperty(RegExp.prototype, 'toJSON', {value: RegExp.prototype.toString}); // support for regex

    Object.keys(data).forEach((key) => {
        if (!process.env[key]) {
            process.env[key] = Array.isArray(data[key]) ? JSON.stringify(data[key]) : data[key];
        }
    });
}


export function databaseConfig() {

    return config.database[env];
}
