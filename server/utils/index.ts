import chalk from 'chalk'
import { format } from 'date-fns'

export const now = () => chalk.white(`[${chalk.cyan(format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}]`)

/**
 * Genera un slug único a partir de un título
 * @param title Título original
 * @returns Slug único
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}