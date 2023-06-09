import * as path from 'path';
import { cwd } from 'process';
import { BaseCommand } from '../../core/base-command';
import { fileExists, writeJsonFile } from '../../core/filesystem';
import { Dictionary, Json } from '../../core/interfaces/generic';
import { services } from '../../core/services';
import { Flags } from '@oclif/core';
import { ServiceSiteConfig } from '../../core/interfaces/services';
import { SiteFile } from '../../core/interfaces/sites';
import Build from './build';

const inquirer = require('inquirer');

interface PromptResponse {
  siteName: string;
  groupName: string;
  services: string[];
}

export default class Create extends BaseCommand<typeof Create> {
  static description = 'Create a new site definition in the current directory';

  static flags = {
    force: Flags.boolean({ char: 'f' }),
  };

  async run(): Promise<void> {
    const sitePath = cwd();
    const siteConfigPath = path.resolve(sitePath, 'dev.json');

    if (!this.flags.force && fileExists(siteConfigPath)) {
      this.log('dev.json already exists in this directory.');
      this.exit(1);
    }

    const responses: PromptResponse = await inquirer.prompt([
      {
        name: 'siteName',
        message: 'Site name',
        default: path.basename(cwd()),
        validate: (value: string) => {
          if (value.trim().length === 0) {
            return 'Site name is required';
          }

          return value.search(/^[a-zA-Z0-9-]+$/) !== -1
            ? true
            : 'Site name is invalid. It only should contain alphanumeric (a-zA-Z0-9) and dash (-) characters';
        },
      },
      {
        name: 'siteGroup',
        message: 'Optional site group',
        validate: (value: string) => {
          if (value.trim().length === 0) {
            return true;
          }

          return value.search(/^[a-zA-Z0-9-]+$/) !== -1
            ? true
            : 'Group name is invalid. It only should contain alphanumeric (a-zA-Z0-9) and dash (-) characters';
        },
      },
      {
        name: 'services',
        message: 'Select services',
        type: 'checkbox',
        choices: services.names().map((name) => ({ name })),
      },
    ]);

    // Call services to get their configuration to save it on dev.json
    const enabledServices: Dictionary<ServiceSiteConfig> = {};

    for (const srvKey of responses.services) {
      enabledServices[srvKey] = await services.get(srvKey).onCreate();
    }

    // Prepare the JSON definition for the site
    const json: SiteFile = {
      // @todo Rename to 'name' in all places it's used
      project: responses.siteName,
      // @todo Add a global setting to define the default TLD
      hosts: [`${responses.siteName}.localhost`],
      autostart: false,
      serve: 'public',
      services: enabledServices,
    };

    if (responses.groupName) {
      json.group = responses.groupName;
    }

    await writeJsonFile(siteConfigPath, json as unknown as Json);

    this.log('dev.json created. Edit it according to your needs and run `nudx site build`.');
  }
}
