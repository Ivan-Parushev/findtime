import { getEvents } from "../actions/getEvents"
import { CreateEventDialog } from "./create-event-dialog"
import { EditEventDialog } from "./edit-event-dialog"
import { ShareEventButton } from "./share-event-button"
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
              backgroundImage?: string
              settings: { startDate: string; endDate: string }
              participants: unknown[]
            }) => (
              <div key={event._id} className="relative">
                <Link href={`/event/${event._id}`}>
                  <Card className="group relative cursor-pointer overflow-hidden transition-colors hover:border-primary">
                    {event.backgroundImage && (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${event.backgroundImage})`,
                          }}
                        />
                        <div className="absolute inset-0 bg-background/50" />
                      </>
                    )}
                    <div className="relative z-10">
                      <CardHeader className="space-y-0.5 pb-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-3xl font-bold tracking-tight">
                            {event.name}
                          </CardTitle>
                          <EditEventDialog event={event} />
                        </div>
                        <CardDescription>
                          {format(
                            new Date(event.settings.startDate),
                            "MMM d, yyyy"
                          )}{" "}
                          -{" "}
                          {format(
                            new Date(event.settings.endDate),
                            "MMM d, yyyy"
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="px-3 py-1">
                            {event.participants.length} Responses
                          </Badge>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
                <div className="absolute top-4 right-4 z-10 flex items-center">
                  <ShareEventButton eventId={event._id} />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
