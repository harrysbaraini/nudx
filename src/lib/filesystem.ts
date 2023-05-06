/** @ */
import * as fs from 'node:fs';
import { join } from 'node:path';
import { CLICONF_SERVER, CLICONF_SITES, CLICONF_SRC_PATH } from './flags';
import { Json } from './types';
import { execAttached } from './process';
import { dump } from 'js-yaml';

export async function gitInit(path: string) {
  // Initialize git just to make sure Flake will not try to include everything (and break...)
  if (!fileExists(join(path, '.git'))) {
    await execAttached('git init', { cwd: path });
    await writeFile(join(path, '.gitignore'), '/state');
    await execAttached('git branch -M main', { cwd: path });
    await execAttached('git add .', { cwd: path });
  }

  const commitDate = (new Date).toISOString();

  await execAttached('git add .', { cwd: path });
}

export function srcPath(path = ''): string {
  return join(CLICONF_SRC_PATH, ...path.split('/'));
}

export function createConfigDirectory() {
  createDirectory(CLICONF_SITES);
  createDirectory(CLICONF_SERVER);
}

export function fileExists(file: string): boolean {
  return fs.existsSync(file);
}

export function createDirectory(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function deleteDirectory(dir: string, options?: fs.RmOptions): void {
  fs.rmSync(dir, {
    ...options,
    recursive: true,
  });
}

export async function deleteFile(file: string): Promise<void> {
  return new Promise((resolve, reject) =>
    fs.unlink(file, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    }),
  );
}

export async function readFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        resolve(data.toString());
      } catch (err) {
        reject(err);
      }
    });
  });
}

export async function readJsonFile<T = Json>(file: string): Promise<T> {
  const data = await readFile(file);

  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(data));
    } catch (err) {
      reject(err);
    }
  });
}

export function writeFile(file: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

export function writeJsonFile<T = Json>(file: string, content: T) {
  return writeFile(file, JSON.stringify(content, null, 2));
}

export function writeYamlFromJson(file: string, content: Json) {
  return writeFile(file, dump(content));
}
