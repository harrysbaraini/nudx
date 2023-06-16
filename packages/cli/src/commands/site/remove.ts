import { Command } from '@oclif/core'

export default class Remove extends Command {
  static description: string | undefined = `Remove site`
  static examples: Command.Example[] = [`$ nudx app remove`]

  run(): Promise<void> {
    this.error('Not implemented')
  }
}
