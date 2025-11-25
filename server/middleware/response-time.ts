import { defineEventHandler } from 'h3'
import responseTime from 'response-time'

export default defineEventHandler(event => {
  return new Promise<void>(resolve => {
    responseTime()(event.node.req, event.node.res, () => resolve())
  })
})
