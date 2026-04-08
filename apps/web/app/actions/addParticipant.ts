"use server"

import dbConnect from "../../lib/mongodb"
import Event from "../../models/Event"
import { revalidatePath } from "next/cache"

const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
]

function getRandomColor(existingColors: string[]): string {
  const availableColors = COLORS.filter((c) => !existingColors.includes(c))
  if (availableColors.length === 0)
    return COLORS[Math.floor(Math.random() * COLORS.length)] ?? "bg-blue-500"
  return (
    availableColors[Math.floor(Math.random() * availableColors.length)] ??
    "bg-blue-500"
  )
}

export async function addParticipant(
  eventId: string,
  name: string,
  availableDates: Date[]
) {
  await dbConnect()

  const event = await Event.findById(eventId)
  if (!event) throw new Error("Event not found")
  if (event.cancelled) throw new Error("Event is cancelled")

  const existingColors = event.participants.map(
    (p: { color: string }) => p.color
  )
  const color = getRandomColor(existingColors) ?? "bg-blue-500"

  event.participants.push({
    name,
    color,
    availableDates,
  })

  await event.save()
  revalidatePath(`/event/${eventId}`)
}
