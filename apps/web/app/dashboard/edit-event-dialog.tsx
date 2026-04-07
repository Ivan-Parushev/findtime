"use client"

import { useState } from "react"
import { updateEvent } from "../actions/updateEvent"
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

export function EditEventDialog({
  event,
}: {
  event: { _id: string; name: string }
}) {
  const [open, setOpen] = useState(false)

  // Need to pass the ID to our action somehow.
  // We can use a bind or just a client wrapper
  async function action(formData: FormData) {
    await updateEvent(event._id, formData)
    setOpen(false)
  }

  return (
    <div
      className="z-10"
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          onClick={(e) => e.preventDefault()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
          </svg>
          <span className="sr-only">Edit</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Change the event name or update its background image.
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Event Name</label>
              <Input id="name" name="name" defaultValue={event.name} required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="image">Background Image (Optional)</label>
              <Input type="file" id="image" name="image" accept="image/*" />
              <p className="text-xs text-muted-foreground">
                Leave empty to keep current image.
              </p>
            </div>
            <Button type="submit" className="mt-4">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
