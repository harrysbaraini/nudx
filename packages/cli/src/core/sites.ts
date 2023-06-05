import { CLIError } from '@oclif/core/lib/errors';
import { ChildProcess } from 'node:child_process';
import * as crypto from 'node:crypto';
import * as path from 'node:path';
import { CliInstance } from './cli';
import { fileExists, readJsonFile } from './filesystem';
import { SiteConfig, SiteFile } from './interfaces/sites';
import { runNixDevelop } from './nix';
import { ExecOptions } from './process';
import { ProcessFile } from './processes';

export class SiteHandler {
  private nixProfilePath: string;

  private constructor(
    public readonly definition: SiteFile,
    public readonly config: SiteConfig,
    private settings: CliInstance,
  ) {
    this.nixProfilePath = path.join(config.statePath, 'nix-profile');
  }

  /**
   * Check if hash matches the one saved in settings.
   * @returns
   */
  public checkHash(): boolean {
    const settingsInfo = this.settings.getSites()[this.config.projectPath] || undefined;

    return settingsInfo && settingsInfo.hash === this.config.hash;
  }

  /**
   * Run a nix command in the site.
   * @param args
   * @param options
   * @param callback
   * @returns
   */
  public runNixCmd(cmd = '', options: ExecOptions = {}, callback?: (proc: ChildProcess) => void) {
    const flakeDir = this.config.flakePath.replace('/flake.nix', '');

    return runNixDevelop(flakeDir, `--profile ${this.nixProfilePath} --command bash -c '${cmd}'`, options, callback);
  }

  /**
   * Load the site by name or by current directory.
   * @param site
   * @param settings
   * @returns
   */
  public static async load(site: string | null = null, settings: CliInstance): Promise<SiteHandler> {
    const siteConfig = await (async () => {
      if (site) {
        const sitePath = Object.keys(settings.getSites()).find((s) => settings.getSites()[s].project === site);

        if (!sitePath) {
          throw new CLIError('Project name is not registered');
        }

        return SiteHandler.loadByPath(sitePath, settings);
      }

      return SiteHandler.loadByPath(process.cwd(), settings);
    })();

    if (!siteConfig?.config.definition.project) {
      throw new CLIError('No project name provided');
    }

    const savedSite = Object.keys(settings.getSites()).find(
      (site) => settings.getSites()[site].project === siteConfig.config.definition.project,
    );

    if (!savedSite) {
      throw new CLIError('Project name is not registered');
    }

    return siteConfig;
  }

  /**
   * Load the site by the path to the project.
   * @param projectPath
   * @param settings
   * @returns
   */
  public static async loadByPath(projectPath: string, settings: CliInstance): Promise<SiteHandler> {
    const siteJsonFile = path.join(projectPath, 'dev.json');

    if (!fileExists(siteJsonFile)) {
      throw new CLIError('No dev.json found in this directory.');
    }

    const definition = (await readJsonFile(siteJsonFile)) as unknown as SiteFile;
    const configHash = hash(JSON.stringify(definition));

    const basePath = path.join(settings.getDataPath(), 'sites', definition.project);
    const configPath = path.join(basePath, 'config');

    // Processes.json file is written by the nix file, when site is built from its flake file.
    const processesJsonFie = path.join(configPath, 'processes.json');

    const processesConfig = fileExists(processesJsonFie)
      ? await readJsonFile<ProcessFile>(`${configPath}/processes.json`)
      : { environment: {}, processes: [] };

    const siteId = (definition.group ? definition.group + '-' : '') + definition.project.replace('_', '-');

    // Create the site configuration object
    const config: SiteConfig = {
      id: siteId,
      projectPath,
      configPath,
      definition: definition,
      basePath,
      statePath: path.join(basePath, 'state'),
      serverConfigPath: path.join(configPath, 'server.json'),
      flakePath: path.join(configPath, 'flake.nix'),
      shellenvPath: path.join(configPath, 'shellenv.txt'),
      envrcPath: path.join(configPath, '.envrc'),
      sourceEnvrcPath: path.join(projectPath, '.envrc'),
      mainHost: definition.hosts[0],
      hash: configHash,
      processesConfig,
    };

    config.processesConfig.processes = processesConfig.processes.map((proc) => {
      const procName = `${siteId}-${proc.name}`;

      return {
        ...proc,
        name: procName,
        instance_var: procName,
        interpreter: 'none',
        // @todo: Move it to flakes?
        error_file: path.join(config.statePath, `${proc.name}-error.log`),
        out_file: path.join(config.statePath, `${proc.name}-out.log`),
        pid_file: path.join(config.statePath, `${proc.name}.pid`),
      };
    });

    return new this(definition, config, settings);
  }
}

export function hash(content: string) {
  return crypto.createHash('md5').update(content).digest('hex');
}
