import { Dictionary } from './interfaces/generic.js'

export interface ProcessFile {
  environment?: Dictionary<string | number | boolean>
  processes: ProcessConfig[]
}

export interface ProcessConfig {
  name: string
  script: string
  on_build?: string
  on_start?: string
  after_start?: string
  interpreter: 'none'
  instance_var: string
  error_file: string
  out_file: string
  pid_file: string
  env?: Dictionary<string>
  cwd?: string
}
