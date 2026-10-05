import argon2 from 'argon2'
import { input, password } from '@inquirer/prompts'
import mongoose from 'mongoose'

import { connectDB } from '../config/db.js'
import Admin from '../models/Admin.js'

async function createAdmin() {
  try {
    const name = (
      await input({
        message: 'Administrator name:',
      })
    ).trim()

    const email = (
      await input({
        message: 'Administrator email:',
      })
    )
      .trim()
      .toLowerCase()

    const adminPassword = await password({
      message: 'Administrator password:',
      mask: '*',
    })

    const confirmPassword = await password({
      message: 'Confirm password:',
      mask: '*',
    })

    if (!name) {
      throw new Error(
        'Administrator name is required.',
      )
    }

    if (!email) {
      throw new Error(
        'Administrator email is required.',
      )
    }

    if (adminPassword.length < 12) {
      throw new Error(
        'Administrator password must be at least 12 characters long.',
      )
    }

    if (adminPassword !== confirmPassword) {
      throw new Error(
        'Administrator passwords do not match.',
      )
    }

    await connectDB()

    const existingAdmin = await Admin.findOne({
      email,
    })

    if (existingAdmin) {
      throw new Error(
        'An administrator with that email already exists.',
      )
    }

    const passwordHash = await argon2.hash(
      adminPassword,
      {
        type: argon2.argon2id,
      },
    )

    await Admin.create({
      name,
      email,
      passwordHash,
    })

    console.log(
      'Administrator created successfully.',
    )
  } catch (error) {
    console.error(
      `Administrator creation failed: ${error.message}`,
    )

    process.exitCode = 1
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close()
    }
  }
}

await createAdmin()