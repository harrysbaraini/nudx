import { CLIError } from '@oclif/core/lib/errors';
import { join } from 'path';
import { createDirectory, deleteFile, fileExists, readJsonFile, writeJsonFile } from './filesystem';
import { CliFile, CliSite } from './interfaces/cli';
import { Config } from '@oclif/core/lib/interfaces';

export class Settings {
  private settingsDir: string;
  private settingsFilePath: string;
  private settings!: CliFile;

  constructor(private config: Config) {
    this.settingsDir = config.dataDir;
    this.settingsFilePath = join(this.settingsDir, 'settings.json');
    this.load();
  }

  public getConfigDir(): string {
    return this.config.configDir;
  }

  public getDataDir(): string {
    return this.config.dataDir;
  }

  public getServerSettings() {
    return this.settings.server;
  }

  public getSites() {
    return this.settings.sites;
  }

  public async load(): Promise<void> {
    if (!fileExists(this.settingsFilePath)) {
      if (! fileExists(this.settingsDir)) {
        await createDirectory(this.settingsDir);
      }

      await writeJsonFile(this.settingsFilePath, {
        server: {
          host: '127.0.0.1',
          ports: [80, 443],
        },
        sites: {},
      });
    }

    const settings = (await readJsonFile(this.settingsFilePath)) as unknown as CliFile;

    if (!settings?.server?.ports || !settings.sites) {
      await deleteFile(this.settingsFilePath);
      throw new CLIError('Configuration file is blank or corrupted. We will delete it so you can run nudx.');
    }

    this.settings = settings;
  }

  public updateSiteSettings(projectPath: string, settings: CliSite): Promise<void> {
    this.settings.sites[projectPath] = settings;

    return writeJsonFile(this.settingsFilePath, this.settings);
  }
}
