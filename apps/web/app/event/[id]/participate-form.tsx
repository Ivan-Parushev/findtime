"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card"
import { addParticipant } from "../../actions/addParticipant"
import { format, eachDayOfInterval } from "date-fns"
import { DateRange } from "react-day-picker"

export function ParticipateForm({
  eventId,
  startDate,
  endDate,
}: {
  eventId: string
  startDate: Date
  endDate: Date
}) {
  const [name, setName] = useState("")
  const [date, setDate] = useState<DateRange | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !date?.from) return
    setIsSubmitting(true)

    // Generate dates based on the single range from `mode="range"` logic
    const start = date.from
    const end = date.to || date.from
    const selectedDates = eachDayOfInterval({ start, end })

    await addParticipant(eventId, name, selectedDates)

    setIsSubmitting(false)
    setName("")
    setDate(undefined)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join the Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Select Availability</label>
              {date?.from && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDate(undefined)}
                  className="h-8 px-2 text-xs"
                >
                  Clear Selection
                </Button>
              )}
            </div>
            <p className="min-h-[16px] text-xs text-muted-foreground">
              {date?.from ? (
                date.to ? (
                  <>
                    Selected {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  <>Selected {format(date.from, "LLL dd, y")}</>
                )
              ) : (
                <span>Pick your available dates.</span>
              )}
            </p>
            <div className="flex flex-row items-center justify-center overflow-x-auto rounded-md border bg-background p-2">
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                fromDate={startDate}
                toDate={endDate}
                defaultMonth={startDate}
                initialFocus
                numberOfMonths={2}
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting || !name || !date?.from}>
            {isSubmitting ? "Submitting..." : "Submit Availability"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
