"use server"

import { auth } from "@clerk/nextjs/server"
import dbConnect from "../../lib/mongodb"
import Event from "../../models/Event"
import { revalidatePath } from "next/cache"

export async function updateEvent(id: string, formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await dbConnect()

  const name = formData.get("name") as string

  if (!name) {
    throw new Error("Missing fields")
  }

  const existingEvent = await Event.findById(id)

  if (!existingEvent) {
    throw new Error("Event not found")
  }

  if (existingEvent.creatorId !== userId) {
    throw new Error("Unauthorized")
  }

  const imageFile = formData.get("image") as File | null

  const updateData: any = { name }

  if (imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")) {
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    updateData.backgroundImage = `data:${imageFile.type};base64,${base64}`
  }

  await Event.findByIdAndUpdate(id, updateData)

  revalidatePath("/dashboard")
  revalidatePath(`/event/${id}`)
}
