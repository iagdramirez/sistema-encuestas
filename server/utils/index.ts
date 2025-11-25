import chalk from 'chalk'
import { format } from 'date-fns'

export const now = () => chalk.white(`[${chalk.cyan(format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}]`)