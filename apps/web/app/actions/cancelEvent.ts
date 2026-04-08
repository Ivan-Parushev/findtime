"use server"

import { auth } from "@clerk/nextjs/server"
import dbConnect from "../../lib/mongodb"
import Event from "../../models/Event"
import { revalidatePath } from "next/cache"

export async function cancelEvent(id: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await dbConnect()

  const existingEvent = await Event.findById(id)

  if (!existingEvent) {
    throw new Error("Event not found")
  }

  if (existingEvent.creatorId !== userId) {
    throw new Error("Unauthorized")
  }

  await Event.findByIdAndUpdate(id, { cancelled: true })

  revalidatePath("/")
  revalidatePath(`/event/${id}`)
}
