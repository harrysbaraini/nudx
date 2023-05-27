import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import { cwd } from 'process';
import { fileExists, writeJsonFile } from '../../lib/filesystem';
import { Dictionary, Json, SiteDefinition, SiteServiceDefinition } from '../../lib/types';
import { services } from '../../services';
import { OptionsState } from '../../lib/services';

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

  async run(): Promise<void> {
    const { flags } = await this.parse(Create);
    const siteConfigPath = path.resolve(process.cwd(), 'dev.json');

    if (!flags.force && fileExists(siteConfigPath)) {
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

    const enabledServices: Dictionary<SiteServiceDefinition> = {};
    for (const srvKey of responses.services) {
      const service = services.get(srvKey);

      const serviceOptions = service.options();
      const prompt = serviceOptions.filter((opt) => opt.prompt);

      const prompted = prompt.length > 0
        ? await inquirer.prompt(prompt)
        : {};

      const defaults = serviceOptions
        .filter((opt) => opt.onJsonByDefault)
        .reduce((val, opt) => {
          return {
            ...val,
            [opt.name]: opt.default,
          }
        }, {});

      const mergedOptions = { ...defaults, ...prompted };

      const optionsState = serviceOptions.reduce<OptionsState>((state, opt) => {
        if (mergedOptions.hasOwnProperty(opt.name)) {
          state[opt.name] = (opt.mutate)
            ? opt.mutate(mergedOptions[opt.name])
            : mergedOptions[opt.name];
        }

        return state;
      }, {});

      enabledServices[srvKey] = optionsState;
    }

    const json: SiteDefinition = {
      // @todo Rename to 'name' in all places it's used
      project: responses.siteName,
      // @todo Add a global setting to defined the default TLD
      hosts: [`${responses.siteName}.localhost`],
      autostart: false,
      serve: 'public',
      services: enabledServices,
    };

    if (responses.groupName) {
      json.group = responses.groupName;
    }

    await writeJsonFile(siteConfigPath, json as unknown as Json);
    this.log('dev.json created');

    // const buildFlags = ['--force'];

    // if (flags.reload && (await isServerRunning())) {
    //   buildFlags.push('--reload');
    // }

    // await Build.run(buildFlags);
  }
}
