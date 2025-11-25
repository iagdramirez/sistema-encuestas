import chalk from 'chalk'

import { loggerInfo } from '@/server/utils/log-access'

const getStatusCode = (code: number) => {
  const statusColor = code < 300 ? 'green' : code < 400 ? 'magenta' : code < 500 ? 'yellow' : 'red'
  return chalk[statusColor](code)
}

export default defineEventHandler(event => {
  const req = event.node.req
  const res = event.node.res

  res.on('finish', () => {
    const method = chalk.green(req.method)
    const code = getStatusCode(getResponseStatus(event))
    const path = chalk.blue(getRequestURL(event).pathname)

    const responseTime = res.getHeader('x-response-time') || '0ms'

    loggerInfo(`${method} ${path} (${code}) ${responseTime}`)
  })
})
