"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card"
import { format, isSameDay } from "date-fns"
import Image from "next/image"

export interface ParticipantType {
  _id?: string
  name: string
  imageUrl?: string
  color: string
  availableDates: (string | Date)[]
}

export function AvailabilityMatrix({
  participants,
}: {
  participants: ParticipantType[]
}) {
  if (!participants || participants.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Availability Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            No participants have submitted their availability yet.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Find the minimal start and max end date from all participant availableDates
  let minDate: Date | null = null
  let maxDate: Date | null = null

  participants.forEach((p) => {
    p.availableDates.forEach((d: string | Date) => {
      const dm = new Date(d)
      if (!minDate || dm < minDate) minDate = dm
      if (!maxDate || dm > maxDate) maxDate = dm
    })
  })

  if (!minDate || !maxDate) return null

  const currentDate = new Date(minDate)
  const maxD = new Date(maxDate)

  const dates: Date[] = []
  while (currentDate <= maxD) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Count participants per day
  const heatmapData = dates.map((date) => {
    const availableParticipants = participants.filter((p) =>
      p.availableDates.some((d: string | Date) => isSameDay(new Date(d), date))
    )
    return {
      date,
      availableParticipants,
      count: availableParticipants.length,
    }
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Availability Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-2">
          {participants.map((p) => (
            <div
              key={p._id || p.name}
              className="flex items-center gap-1.5 rounded-md border bg-secondary px-2 py-1 text-sm font-medium"
            >
              {p.imageUrl ? (
                <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full font-bold">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className={`h-3 w-3 rounded-full ${p.color}`} />
              )}
              <span>{p.name}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {heatmapData.map((data, index) => {
            const hasMajority =
              data.count === participants.length && participants.length > 1
            const hasSome = data.count > 0
            return (
              <div
                key={index}
                className={`relative flex flex-col gap-2 overflow-hidden rounded-lg border p-3 transition-colors ${
                  hasMajority ? "border-green-500 bg-green-500/10" : ""
                } ${!hasSome ? "opacity-40" : "bg-card"}`}
              >
                <div className="text-sm font-semibold">
                  {format(data.date, "E, MMM d")}
                </div>
                <div className="flex h-12 flex-wrap content-start gap-1.5 border-t pt-2 align-top">
                  {data.availableParticipants.map((p: ParticipantType) =>
                    p.imageUrl ? (
                      <div
                        key={p._id || p.name}
                        className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full shadow-sm"
                        title={p.name}
                      >
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        key={p._id || p.name}
                        className={`h-4 w-4 rounded-full ${p.color} shrink-0 shadow-sm`}
                        title={p.name}
                      />
                    )
                  )}
                  {data.count === 0 && (
                    <span className="w-full text-center text-xs text-muted-foreground">
                      None
                    </span>
                  )}
                </div>
                {hasSome && (
                  <div className="absolute top-2 right-2 text-xs font-bold text-muted-foreground">
                    {data.count}/{participants.length}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
