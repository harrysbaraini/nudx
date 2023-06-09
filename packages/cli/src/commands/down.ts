import { Command } from '@oclif/core'
import { killProcessManager } from '../core/pm2.js'

export default class Down extends Command {
  static description = 'Shutdown the server and all configured sites'
  static examples = ['$ nudx down']

  async run(): Promise<void> {
    await killProcessManager()

    this.log('Server stopped!')
    this.exit(0)
  }
}
