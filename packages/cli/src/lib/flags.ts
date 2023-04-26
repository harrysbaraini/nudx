import { homedir } from 'os';
import { resolve } from 'path';

export const APP_NAME = 'Nudx';
export const CLICONF_ENV_PREFIX = 'NUDX';
export const USER_HOME = homedir();
export const CLICONF_JSON_VERSION = '0.1';
export const CLICONF_PATH = resolve(USER_HOME, '.local/share/nudx');
export const CLICONF_SERVER = resolve(CLICONF_PATH, 'server');
export const CLICONF_STATE = resolve(CLICONF_PATH, 'state');
export const CLICONF_SETTINGS = resolve(CLICONF_PATH, 'settings.json');
export const CLICONF_SITES = resolve(CLICONF_PATH, 'sites');
export const CADDY_API = 'http://127.0.0.1:2019';
