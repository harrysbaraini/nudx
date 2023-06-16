import { ChildProcess, SpawnOptions, spawn } from 'node:child_process'

export type ExecOptions = SpawnOptions

export async function execAttached(
  command: string,
  options: ExecOptions = {},
  callback?: (proc: ChildProcess) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const proc = spawn(command, {
        cwd: options.cwd || undefined,
        stdio: options.stdio || ['inherit', 'inherit', 'pipe'],
        shell: true,
        env: {
          ...process.env,
          ...(options.env || {}),
        },
      })

      if (callback) {
        callback(proc)
      }

      const output: string[] = []

      proc.stdout?.setEncoding('utf8')
      proc.stdout?.on('data', (data) => {
        if (typeof data === 'string') {
          output.push(data.toString())
        }
      })

      proc.stderr?.setEncoding('utf8')
      proc.stderr?.on('data', (data) => {
        if (typeof data === 'string') {
          output.push(data.toString())
        }
      })

      proc.on('close', (code, ...args) => {
        if (code === null || code === 0) {
          resolve(output.join('\n'))
        } else {
          console.log(`child process exited with code ${code?.toString() || 'unknown'}`, args)
          reject(code)
        }
      })

      proc.on('exit', (code) => {
        if (code === null || code === 0) {
          resolve(output.join('\n'))
        } else {
          console.log(`child process exited with code ${code?.toString() || 'unknown'}`)
          reject(code)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
