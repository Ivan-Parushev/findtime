"use client"

import { useState } from "react"

export function ShareEventButton({ eventId }: { eventId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}/event/${eventId}`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-secondary px-3 py-1 text-xs font-medium whitespace-nowrap text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
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
        className="h-3 w-3"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
      </svg>
      {copied ? "Copied!" : "Share"}
    </button>
  )
}
