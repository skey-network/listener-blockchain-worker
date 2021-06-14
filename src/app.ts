#!/usr/bin/node
import dotenv from 'dotenv'
import fetch, { Headers } from 'node-fetch'
import { exit } from 'process'
import http from 'http'
import BlockchainWatcher from './blockchain/blockchain_watcher'
import BCFunc from './blockchain/bcfunc'
import GrpcWatcher from './grpc/grpc_watcher'
import { SpanWrapper, Tracing } from './tracing'
import ActionParams from './action_params'
import YargsParser from 'yargs-parser'
import fs from 'fs'
import { Producer } from './queue/producer'
import Worker from './worker/worker'
///////////////////////////////////// check for env /////////////////////////////
const args = YargsParser(process.argv.slice(2))

let denvResult
if (args['env-file']) {
  denvResult = dotenv.config({ path: args['env-file'] })
} else {
  dotenv.config()
}

if (process.env.DAPP == undefined) {
  console.log(
    'Env file not found, specify --env-file=path_to_file, or provide required variables via docker env'
  )
  exit()
}

////////////////////////////////////// dummy server, in case docker hosting requires one in container ////////////////////////////////

if (process.env.PORT) {
  const startServer = () => {
    http
      .createServer((req, res) => {
        res.statusCode = 204
        res.end()
      })
      .listen(Number(process.env.PORT))
      .on('listening', () => console.log(`Dummy server started at ${process.env.PORT}`))
  }
  startServer()
}

////////////////////////////////////// main app /////////////////////////////////
console.log('Starting')

const DEBUG = process.env.DEBUG == 'true'
const SAFETY_LEVEL = parseInt(process.env.SAFETY_LEVEL ?? '1')
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL ?? '2000')
const SILENT_INVOKERS: string[] = (process.env.SILENT_INVOKERS ?? '').split('|')

// Functions to be watched, default one (or with same key/action arguments location) can be specified in env
const FUNCTIONS: BCFunc[] = []
if (process.env.DAPP_FUNCS) {
  const fns = (process.env.DAPP_FUNCS ?? '').split('|')
  for (const fn of fns) {
    FUNCTIONS.push({
      name: fn,
      keyArgument: 0,
      actionArgument: 1,
      validToArgument: 2
    })
  }
} else throw 'No functions to watch specified (DAPP_FUNCS)'

if (!process.env.LISTENER_MODE) throw 'LISTENER_MODE is not specified'

new Worker({
  dapp: process.env.DAPP!,
  functionDefs: FUNCTIONS,
  http: {
    checkInterval: CHECK_INTERVAL,
    safetyLevel: SAFETY_LEVEL,
    blocksToReparse: parseInt(process.env.BLOCKS_TO_REPARSE ?? '2')
  },
  mode: process.env.LISTENER_MODE! as 'http' | 'grpc',
  silentInvokers: SILENT_INVOKERS
})
