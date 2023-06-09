import { Interfaces } from '@oclif/core'
import { PJSON } from '@oclif/core/lib/interfaces/pjson.js'
import { Dictionary } from './generic.js'
import { Plugin } from './plugin.js'

export interface CliSite {
  hash: string
  project: string
  group?: string
  disabled?: boolean
}

export interface CliFile {
  server: {
    ports: string[]
  }
  sites: Dictionary<CliSite>
}

export interface CliNodePackage extends Interfaces.Plugin {
  pjson: PJSON.CLI;
  plugin: Plugin;
}
