import { getEvents } from "../actions/getEvents"
import { CreateEventDialog } from "./create-event-dialog"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import Link from "next/link"
import { format } from "date-fns"

export default async function DashboardPage() {
  const events = await getEvents()

  return (
    <div className="container mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Events</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all your organized scheduling events.
          </p>
        </div>
        <CreateEventDialog />
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center rounded-lg border p-12 text-center">
          <h3 className="text-xl font-bold">No events created</h3>
          <p className="mt-2 mb-4 text-muted-foreground">
            You have not created any events yet. Get started by creating one.
          </p>
          <CreateEventDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {events.map(
            (event: {
              _id: string
              name: string
              settings: { startDate: string; endDate: string }
              participants: unknown[]
            }) => (
              <Link key={event._id} href={`/event/${event._id}`}>
                <Card className="cursor-pointer transition-colors hover:border-primary">
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      {format(
                        new Date(event.settings.startDate),
                        "MMM d, yyyy"
                      )}{" "}
                      -{" "}
                      {format(new Date(event.settings.endDate), "MMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {event.participants.length} Responses
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  )
}
