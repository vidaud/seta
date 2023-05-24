/* eslint-disable no-console */

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const bind = <T extends keyof Console>(
  consoleMethod: T,
  fallback: (typeof console)[T]
): (typeof console)[T] => {
  if (!console) {
    return noop
  }

  const bound = console[consoleMethod]?.bind(console) as (typeof console)[T] | undefined

  return bound ?? fallback
}

const logger = (() => {
  let padding = ''

  const log: Console['log'] = (...args) => {
    console.log(padding, ...args)
  }

  const error: Console['error'] = (...args) => {
    console.error(padding, ...args)
  }

  const warn: Console['warn'] = (...args) => {
    console.warn(padding, ...args)
  }

  const groupFallback: Console['group'] = (...args) => {
    log(...args)
    padding += '  '
  }

  const groupEndFallback: Console['groupEnd'] = () => {
    padding = padding.slice(0, -2)
  }

  return {
    log,
    error,
    warn,
    group: bind('group', groupFallback),
    groupCollapsed: bind('groupCollapsed', groupFallback),
    groupEnd: bind('groupEnd', groupEndFallback)
  }
})()

export default logger
