import chalk from 'chalk'

import { now } from '@/server/utils'

export function loggerError(msg: string, extra?: any) {
  const errorLevel = chalk.red('[Error]')
  console.error(`${now()} ${errorLevel} ${msg}`, extra || '')
}

export function loggerWarning(msg: string, extra?: any) {
  const warningLevel = chalk.yellow('[Warning]')
  console.warn(`${now()} ${warningLevel} ${msg}`, extra || '')
}

export function loggerInfo(msg: string, extra?: any) {
  const infoLevel = chalk.cyan('[Info]')
  console.info(`${now()} ${infoLevel} ${msg}`, extra || '')
}

export function loggerHttp(msg: string, extra?: any) {
  const infoLevel = chalk.cyan('[http]')
  console.debug(`${now()} ${infoLevel} ${msg}`, extra || '')
}

export function loggerSuccess(msg: string, extra?: any) {
  const infoLevel = chalk.greenBright('[Success]')
  console.info(`${now()} ${infoLevel} ${msg}`, extra || '')
}