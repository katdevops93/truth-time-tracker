"use client"

import { ReactNode } from "react"
import { Navigation } from "./Navigation"
import { useUser } from "@clerk/nextjs"
import { SignedIn, SignedOut } from "@clerk/nextjs"

interface LayoutProps {
  children: ReactNode
  showNavigation?: boolean
}

export function Layout({ children, showNavigation = true }: LayoutProps) {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-background">
      <SignedIn>
        {showNavigation && user && (
          <div className="flex">
            <div className="w-64 p-4 space-y-4">
              <Navigation />
            </div>
            <div className="flex-1">
              {children}
            </div>
          </div>
        )}
        {(!showNavigation || !user) && children}
      </SignedIn>
      <SignedOut>
        {children}
      </SignedOut>
    </div>
  )
}