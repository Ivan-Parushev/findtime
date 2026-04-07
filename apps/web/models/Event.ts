import mongoose, { Schema, Document, Model } from "mongoose"

export interface IParticipant {
  name: string
  color: string
  availableDates: Date[]
}

export interface IEvent extends Document {
  name: string
  creatorId: string
  settings: {
    startDate: Date
    endDate: Date
  }
  participants: IParticipant[]
  createdAt: Date
  updatedAt: Date
}

const ParticipantSchema = new Schema<IParticipant>({
  name: { type: String, required: true },
  color: { type: String, required: true },
  availableDates: [{ type: Date, required: true }],
})

const EventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    creatorId: { type: String, required: true }, // Clerk User ID
    settings: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    participants: { type: [ParticipantSchema], default: [] },
  },
  { timestamps: true }
)

// Prevent mongoose from recompiling the model upon hot reload
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)

export default Event
