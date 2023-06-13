export function runCallbackWithRetries<T = unknown>(fn: () => Promise<unknown>, retries = 1, interval = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    fn()
      .then(res => resolve(res as T))
      .catch(err => {
        if (retries === 0) {
          reject(err)
          return
        }

        setTimeout(() => {
          runCallbackWithRetries(fn, retries - 1, interval)
            .then(res => resolve(res as T))
            .catch(reject)
        }, interval)
      })
  })
}
