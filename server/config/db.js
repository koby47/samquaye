import mongoose from 'mongoose'

import { env } from './env.js'

export async function connectDB() {
  try {
    const connection = await mongoose.connect(env.mongoUri)

  console.log(
  `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`,
)
  } catch (error) {
    console.error(
      `MongoDB connection failed: ${error.message}`,
    )

    throw error
  }
}