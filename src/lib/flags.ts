import { homedir } from 'os';
import { resolve } from 'path';

export const APP_NAME = 'Nudx';
export const CLI_SRC_PATH = resolve(__dirname, '../');
export const CLI_TEMPLATES_PATH = resolve(__dirname, '../../');
export const CLICONF_ENV_PREFIX = 'NUDX';
export const USER_HOME = homedir();
export const CLICONF_PATH = resolve(USER_HOME, '.local/share/nudx');
export const CLICONF_SERVER = resolve(CLICONF_PATH, 'server');
export const CLICONF_SERVER_CONFIG = resolve(CLICONF_SERVER, 'config');
export const CLICONF_SERVER_STATE = resolve(CLICONF_SERVER, 'state');
export const CLICONF_SETTINGS = resolve(CLICONF_PATH, 'settings.json');
export const CLICONF_SITES = resolve(CLICONF_PATH, 'sites');
export const CADDY_API = 'http://127.0.0.1:2019';