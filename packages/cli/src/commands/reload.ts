import { Command } from '@oclif/core'
import Down from './down.js'
import Up from './up.js'

export default class Reload extends Command {
  static description = `Reload server`
  static examples: []

  async run(): Promise<void> {
    await Down.run()
    await Up.run()
  }
}
