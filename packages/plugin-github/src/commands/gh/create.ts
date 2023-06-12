import {Args, Flags} from '@oclif/core'
import { BaseCommand } from '@nudx/cli/lib/core/base-command';
import { cwd } from 'process';
import { resolve } from 'path';
import { existsSync, readFileSync, writeFileSync, rmSync, copyFileSync } from 'fs';
import { SiteFile } from '@nudx/cli/lib/core/interfaces/sites';

const inquirer = require('inquirer');

interface GithubTemplateConfig {
  repo?: string;
  clonePath?: string;
  files?: {
    [key: string]: string;
  }
}

interface SiteFileWithGithubConfig extends SiteFile {
  github?: GithubTemplateConfig;
}

/**
 * This command will clone a GitHub repository into a new directory.
 */
export default class Create extends BaseCommand<typeof Create> {
  static description = 'Create a new site definition from a GitHub repository';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    force: Flags.boolean({char: 'f'}),
    path: Flags.string({char: 'p'}),
    repo: Flags.string({
      description: 'owner/repository to clone',
      char: 'r',
      required: false,
      parse: async (input: string) => {
        const value = input.trim();
        if (value.length === 0) {
          throw new Error('repo is required');
        }

        return value.trim();
      }
    }),
    branch: Flags.string({
      description: 'Branch or Pull Request to use',
      char: 'b',
      required: false,
      parse: async (input: string) => {
        const value = input.trim();
        if (value.length === 0) {
          throw new Error('repo is required');
        }

        return value.trim();
      }
    }),
  }

  static args = {};

  private repo!: string;
  private branch!: string;
  private path!: string;
  private cwd: string = cwd();
  private template: string|null = null;
  private devJson: SiteFileWithGithubConfig | null = null;
  private githubConfig: GithubTemplateConfig|null = null;

  private cleanUp: boolean = false;

  protected catch(err: Error & { exitCode?: number | undefined; }): Promise<unknown> {
    if (err?.exitCode === 1) {
      this.log('Aborting...');
    }

    if (this.cleanUp) {
      rmSync(this.path, {recursive: true});
    }

    return super.catch(err);
  }

  public async run(): Promise<void> {
    await this.buildOptions();

    // - Clone the repository into a temporary directory (using mktemp if --temp is set)
    // - Switch the branch/PR to the one specified (if branch is set)
    await this.cloneRepository();

    //  - If dev.json exists, just run `nudx site build`
    //  - If dev.template.json exists, use it to create a dev.json in the new cloned path
    //  - Otherwise, run `nudx site create`
    if (existsSync(resolve(this.path, 'dev.json'))) {
      await this.config.runCommand('site:build', ['--path', this.path, '--force']);
      return;
    }

    // If we have a dev.json configuration we will create dev.json from it
    if (this.devJson) {
      writeFileSync(resolve(this.path, 'dev.json'), JSON.stringify(this.devJson, null, 2));
      await this.config.runCommand('site:build', ['--path', this.path, '--force']);
      return;
    }

    // dev.json needs to be created...
    await this.config.runCommand('site:create', ['--path', this.path]);

    // Copy files as configured in dev.template.json
    if (this.githubConfig?.files) {
      for (let [origin, dest] of Object.entries(this.githubConfig.files)) {
        copyFileSync(resolve(this.path, origin), resolve(this.path, dest));
      }
    }
}

  private async buildOptions(): Promise<void> {
    if (this.flags.repo) {
      this.repo = this.flags.repo;
    } else {
      // If a dev.template.json exists in the current directory,
      // we will use it to create a dev.json and also attempt to
      // clone repository and checkout branch from its configuration.
      const tmplPath = resolve(this.cwd, 'dev.template.json');

      if (existsSync(tmplPath)) {
        this.log('dev.template.json found.');

        this.template = readFileSync(tmplPath).toString();
        const tmplJson = JSON.parse(this.template);
        this.githubConfig = {
          repo: tmplJson?.github?.repo,
          files: tmplJson?.github?.files,
          clonePath: tmplJson?.github?.clonePath,
        };

        if (Boolean(this.githubConfig?.repo?.length)) {
          this.repo = this.githubConfig.repo || '';
        }
      }

      // If no repository has been already set by the previous step,
      // we check if we need to ask it or if it was passed as an argument.
      if (this.repo.trim().length === 0) {
        this.repo = await inquirer.prompt({
          name: 'repo',
          message: 'GitHub repository to clone (owner/repository)',
          validate: (value: string) => {
            if (value.trim().length === 0) {
              return 'Repository is required';
            }

            // @todo validate repo exists
            return true;
          },
        });
      }
    }

    // Check if we need to ask for a branch
    this.branch = (Boolean(this.flags.branch?.length))
      ? this.flags.branch
      : (await inquirer.prompt({
        name: 'branch',
        message: 'Branch or PR (empty for default)',
        validate: (value: string) => {
          if (value.trim().length === 0) {
            return true;
          }

          // @todo validate branch or PR exists
          return true;
        },
      })).branch.trim();

    if (this.repo.trim().length === 0) {
      throw new Error('Repository is empty or invalid.');
    }

    // If dev.template.json exists, we will generate a configuration from it
    // by replacing some variables.
    if (this.template) {
      const [repoOwner, repoName] = this.repo.split('/');

      const devJson = JSON.parse(this.template
        .replace(/{{repo_name}}/g, repoName)
        .replace(/{{repo_owner}}/g, repoOwner)
        .replace(/{{branch}}/g, this.branch));

      this.devJson = devJson;
    }

    // Get the path where the repository will be cloned
    this.path = this.flags.path
      ? this.getCustomDir()
      : resolve(this.cwd, this.guessDir());
  }

  /**
   * Clone the given repository into a new directory.
   */
  private async cloneRepository(): Promise<void> {
    // Using gh command, so we're not using it for now.
    // const githubUrl = `https://github.com/${opts.repo}`;
    if (existsSync(this.path)) {
      this.log(`Directory ${this.path} already exists.`);
      this.log('Aborting...');
      this.exit(1);
    }

    // Clone the repository in the given path and checkout the branch if set
    this.log(`Cloning ${this.repo} into ${this.path}`);
    await this.server.runNixCmd(`gh repo clone ${this.repo} ${this.path}`);

    await this.checkoutBranch();
  }

  private async checkoutBranch(): Promise<unknown> {
    if (! Boolean(this.branch.length)) {
      return;
    }

    if (this.branch.startsWith('pull/')) {
      const pr = this.branch.replace('pull/', '');
      this.log(`Checking out Pull Request: ${pr}`);
      await this.server.runNixCmd(`cd ${this.repo} && gh pr checkout ${pr}`);
      return;
    }

    if (await this.branchExists()) {
      this.log(`Checking out branch: ${this.branch}`);
      await this.server.runNixCmd(`cd ${this.path} && git fetch origin ${this.branch} && git checkout ${this.branch}`);
      return;
    }

    const mainBranch = await this.getMainBranch();

    const createBranch = (await this.cliInstance.prompt({
      name: 'createBranch',
      message: `Branch "${this.branch}" does not exist. Do you want to create it based on the ${mainBranch} branch?`,
      type: 'confirm',
    })).createBranch;

    if (! createBranch) {
      this.cleanUp = true;
      this.exit(1);
    }

    this.log(`Creating branch ${this.branch} from ${mainBranch}`);
    await this.server.runNixCmd(`cd ${this.path} && git checkout -b ${this.branch} ${mainBranch}`);
  }

  private guessDir(): string {
    if (this.devJson) {
      return this.devJson.github?.clonePath || this.repo.replace('/', '-');
    }

    const parts = [
      this.repo,
    ];

    if (Boolean(this.branch?.length)) {
      parts.push(this.branch);
    }

    return parts.join('-').replace(/\//g, '-');
  }

  private getCustomDir(): string {
    if (! this.flags.path || this.flags.path.length === 0) {
      throw new Error('Flag "path" is not defined or is empty');
    }

    return this.flags.path;
  }

  private async branchExists(): Promise<boolean> {
    const output = await this.server.runNixCmd(`cd ${this.path} && git ls-remote --heads origin ${this.branch}`, {
      stdio: 'pipe',
    });

    return output.join(' ').includes(`refs/heads/${this.branch}`);
  }

  private async getMainBranch(): Promise<string> {
    // @todo For some reason, 'cut' works on temrinal but not here. That's why there's a replace in the end of this function.
    const output = await this.server.runNixCmd(`cd ${this.path} && git remote show origin | grep 'HEAD branch' | cut -d' ' -f5`, {
      stdio: 'pipe',
    });

    return output.toString().replace('HEAD branch: ', '').trim();
  }
}
