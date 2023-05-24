import { Command } from '@oclif/core';
import { readdir, writeFile } from 'fs/promises';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { CLICONF_SRC_PATH } from '../../lib/flags';

import Listr = require('listr');
import Handlebars = require('handlebars');
import { CLIError } from '@oclif/core/lib/errors';

interface TemplateFile {
  name: string;
  dir: string;
  path: string;
}

export default class CompileTemplates extends Command {
  // hide the command from help
  static hidden = true;

  async run(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      throw new CLIError('INVALID COMMAND');
    }

    const cliTemplates = await this.getFiles(join(CLICONF_SRC_PATH, 'templates'));
    const serviceTemplates = await this.getFiles(join(CLICONF_SRC_PATH, 'services'));

    const tasks = new Listr(
      [...cliTemplates, ...serviceTemplates].map((templateFile: TemplateFile) => {
        return {
          title: `Compiling ${templateFile.path}`,
          task: async () => {
            const content = (await readFile(templateFile.path)).toString();

            const compiled = Handlebars.precompile(content);

            return writeFile(
              `${templateFile.dir}/${templateFile.name}.tpl.js`,
              `export default ${compiled}`,
            );
          },
        };
      }),
    );

    await tasks.run();

    this.exit(0);
  }

  private async getFiles(dir: string): Promise<TemplateFile[]> {
    let files: TemplateFile[] = [];

    const items = await readdir(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        files = [...files, ...(await this.getFiles(`${dir}/${item.name}`))];
      } else {
        if (item.name.endsWith('.handlebars')) {
          const path = `${dir}/${item.name}`;
          files.push({
            name: item.name.replace('.handlebars', ''),
            dir,
            path,
          });
        }
      }
    }

    return files;
  }
}
