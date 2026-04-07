"use server"

import { auth } from "@clerk/nextjs/server"
import dbConnect from "../../lib/mongodb"
import Event from "../../models/Event"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await dbConnect()

  const name = formData.get("name") as string
  const startDateStr = formData.get("startDate") as string
  const endDateStr = formData.get("endDate") as string

  if (!name || !startDateStr || !endDateStr) {
    throw new Error("Missing fields")
  }

  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  const newEvent = await Event.create({
    name,
    creatorId: userId,
    settings: {
      startDate,
      endDate,
    },
  })

  revalidatePath("/dashboard")
  return newEvent._id.toString()
}
