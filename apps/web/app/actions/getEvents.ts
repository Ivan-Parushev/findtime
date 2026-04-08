"use server"

import { auth } from "@clerk/nextjs/server"
import dbConnect from "../../lib/mongodb"
import Event from "../../models/Event"

export async function getEvents() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await dbConnect()

  const events = await Event.find({
    $or: [{ creatorId: userId }, { "participants.userId": userId }],
  }).sort({ createdAt: -1 })

  return JSON.parse(JSON.stringify(events))
}
