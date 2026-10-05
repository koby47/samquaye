import mongoose from 'mongoose'

import app from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

let server
let isShuttingDown = false

async function startServer() {
  try {
    await connectDB()

    server = app.listen(env.port, () => {
      console.log(
        `Portfolio API running on port ${env.port}`,
      )
    })
  } catch (error) {
    console.error('Portfolio API failed to start.')
    process.exit(1)
  }
}

async function shutdown(signal) {
  if (isShuttingDown) {
    return
  }

  isShuttingDown = true

  console.log(`${signal} received. Shutting down gracefully...`)

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      })
    }

    await mongoose.connection.close()

    console.log('MongoDB connection closed.')
    console.log('Portfolio API shutdown complete.')

    process.exit(0)
  } catch (error) {
    console.error(
      `Error during shutdown: ${error.message}`,
    )

    process.exit(1)
  }
}

process.on('SIGINT', () => {
  shutdown('SIGINT')
})

process.on('SIGTERM', () => {
  shutdown('SIGTERM')
})

startServer()