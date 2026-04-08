import { SignIn } from "@clerk/nextjs"
import Image from "next/image"

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-6">
      <Image
        src="/vacation_time_background.png"
        alt="FindTime Background"
        fill
        className="absolute inset-0 z-0 object-cover brightness-50"
        priority
      />
      <div className="relative z-10">
        <SignIn />
      </div>
    </div>
  )
}
