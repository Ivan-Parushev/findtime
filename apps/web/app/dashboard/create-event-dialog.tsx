"use client"

import { useState } from "react"
import { createEvent } from "../actions/createEvent"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { useRouter } from "next/navigation"

export function CreateEventDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function action(formData: FormData) {
    const id = await createEvent(formData)
    setOpen(false)
    router.push(`/event/${id}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
        Create Event
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Specify a name and the boundaries for the event date.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Event Name</label>
            <Input id="name" name="name" placeholder="Team Retreat" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="startDate">Allowed Range Start</label>
              <Input type="date" id="startDate" name="startDate" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="endDate">Allowed Range End</label>
              <Input type="date" id="endDate" name="endDate" required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="image">Background Image (Optional)</label>
            <Input type="file" id="image" name="image" accept="image/*" />
          </div>
          <Button type="submit" className="mt-4">
            Create Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
