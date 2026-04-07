import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import { format } from "date-fns"
import { AvailabilityMatrix } from "@/components/AvailabilityMatrix"
import { ParticipateForm } from "./participate-form"
import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()

  await dbConnect()
  const event = await Event.findById(id).lean()

  if (!event) {
    notFound()
  }

  // Needed because of lean() not doing full JSON serialization out of the box natively sometimes with _id
  const serializedEvent = JSON.parse(JSON.stringify(event))
  // console.log("Serialized Event:", serializedEvent)
  return (
    <div
      className="relative min-h-screen bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: serializedEvent.backgroundImage
          ? `url(${serializedEvent.backgroundImage})`
          : "none",
      }}
    >
      {serializedEvent.backgroundImage && (
        <div className="absolute inset-0 z-0 bg-background/20" />
      )}

      <div className="relative z-10 container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <div className="flex flex-col gap-4 rounded-xl border bg-background/80 p-6 shadow-sm backdrop-blur-md">
          {userId && (
            <div>
              <Link
                href="/dashboard"
                className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                &larr; Back to Dashboard
              </Link>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {serializedEvent.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              Please select all the dates you are available between{" "}
              {format(new Date(serializedEvent.settings.startDate), "MMM d")}{" "}
              and{" "}
              {format(
                new Date(serializedEvent.settings.endDate),
                "MMM d, yyyy"
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[auto_1fr]">
          {/* Left Column: Input Form */}
          <ParticipateForm
            eventId={serializedEvent._id}
            startDate={new Date(serializedEvent.settings.startDate)}
            endDate={new Date(serializedEvent.settings.endDate)}
          />

          <AvailabilityMatrix participants={serializedEvent.participants} />
        </div>
      </div>
    </div>
  )
}
