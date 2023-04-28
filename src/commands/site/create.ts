import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import { cwd } from 'process';
import { fileExists, writeJsonFile } from '../../lib/filesystem';
import { isServerRunning } from '../../lib/server';
import { Dictionary, Json, SiteDefinition, SiteServiceDefinition } from '../../lib/types';
import { services } from '../../services';
import Build from './build';

const inquirer = require('inquirer');

interface PromptResponse {
  siteName: string;
  groupName: string;
  services: string[];
}

export default class Create extends Command {
  static description = 'Create a new site definition in the current directory';
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    force: Flags.boolean({ char: 'f' }),
    reload: Flags.boolean({ char: 'r' }),
  };

  async run(): Promise<any> {
    const { flags } = await this.parse(Create);
    const siteConfigPath = path.resolve(process.cwd(), 'dev.json');

    if (!flags.force && fileExists(siteConfigPath)) {
      this.log('dev.json already exists in this directory.');
      return 1;
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

    const processedServices: Dictionary<SiteServiceDefinition> = {};
    for (const srvKey of responses.services) {
      const service = services.get(srvKey);

      processedServices[srvKey] = service.prompt
        ? await inquirer.prompt(service.prompt())
        : service.getDefaults();
    }

    const json: SiteDefinition = {
      // @todo Rename to 'name' in all places it's used
      project: responses.siteName,
      hosts: {
        [`${responses.siteName}.localhost`]: '127.0.0.1',
      },
      autostart: true,
      serve: 'public',
      services: processedServices,
    };

    if (responses.groupName) {
      json.group = responses.groupName;
    }

    await writeJsonFile(siteConfigPath, json as unknown as Json);
    this.log('dev.json created');

    const buildFlags = ['--force'];

    if (flags.reload && (await isServerRunning())) {
      buildFlags.push('--reload');
    }

    await Build.run(buildFlags);
  }
}
