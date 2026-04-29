import { Command } from 'commander'

import { SomaClient } from '../client'
import type { SomaHttp } from '../http'
import { handleError } from '../shared/utils/error-handler'
import { formatOutput } from '../shared/utils/output'
import { getHttpOrExit } from './helpers'

export type ShowOptions = { pretty?: boolean }

type DashboardClient = Pick<SomaClient, 'dashboard'>

interface ShowDashboardDeps {
  getHttp?: () => Promise<SomaHttp>
  createClient?: (http: SomaHttp) => DashboardClient
  write?: (output: string) => void
}

export async function showDashboard(options: ShowOptions, deps: ShowDashboardDeps = {}): Promise<void> {
  const getHttp = deps.getHttp ?? getHttpOrExit
  const createClient = deps.createClient ?? ((http) => new SomaClient({ http }))
  const write = deps.write ?? ((output) => console.log(output))

  const http = await getHttp()
  const dashboard = await createClient(http).dashboard.get()
  write(formatOutput(dashboard, options.pretty))
}

async function showAction(options: ShowOptions): Promise<void> {
  try {
    await showDashboard(options)
  } catch (error) {
    handleError(error)
  }
}

export const dashboardCommand = new Command('dashboard')
  .description('Show dashboard information')
  .addCommand(
    new Command('show').description('Show dashboard').option('--pretty', 'Pretty print JSON output').action(showAction),
  )
