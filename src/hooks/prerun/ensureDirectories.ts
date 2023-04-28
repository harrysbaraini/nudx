import { Hook } from '@oclif/core';
import { createDirectory, fileExists } from '../../lib/filesystem';
import { CLICONF_SERVER, CLICONF_SITES } from '../../lib/flags';

const hook: Hook<'prerun'> = async function ensureDirectories() {
  if (!fileExists(CLICONF_SITES)) {
    createDirectory(CLICONF_SITES);
  }

  if (!fileExists(CLICONF_SERVER)) {
    createDirectory(CLICONF_SERVER);
  }
};

export default hook;
