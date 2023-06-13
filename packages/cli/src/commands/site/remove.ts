import { Command } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'

export default class Remove extends Command {
  static description: string | undefined = `Remove site`
  static examples: Command.Example[] = [`$ nudx app remove`]

  run(): Promise<void> {
    throw new CLIError('Not implemented')
  }
}
