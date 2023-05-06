import { homedir } from 'os';
import { resolve } from 'path';

export const APP_NAME = 'Nudx';
export const USER_HOME = homedir();
export const CLICONF_ENV_PREFIX = 'NUDX';
export const CLICONF_SRC_PATH = resolve(__dirname, '../');
export const CLICONF_PATH = resolve(USER_HOME, '.local/share/nudx');
export const CLICONF_SERVER = resolve(CLICONF_PATH, 'server');
export const CLICONF_SERVER_STATE = resolve(CLICONF_SERVER, 'state');
export const CLICONF_FLAKE_FILE = resolve(CLICONF_SERVER, 'flake.nix');
export const CLICONF_CADDY_PATH = resolve(CLICONF_SERVER, 'caddy');
export const CLICONF_CADDY_CONFIG = resolve(CLICONF_SERVER, 'caddy.json');
export const CLICONF_SETTINGS = resolve(CLICONF_PATH, 'settings.json');
export const CLICONF_SITES = resolve(CLICONF_PATH, 'sites');
export const CLICONF_CADDY_API_URL = 'http://127.0.0.1:2019';
