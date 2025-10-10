"use client"

import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Clock, ChefHat, FileText, User } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Time Tracking", href: "/", icon: Clock, section: "time" },
  { name: "Meals", href: "/meals", icon: ChefHat },
  { name: "Recipes", href: "/recipes/new", icon: ChefHat, section: "recipes" },
  { name: "Notes", href: "/", icon: FileText, section: "notes" },
]

export function Navigation() {
  const pathname = usePathname()
  const { user } = useUser()

  if (!user) return null

  return (
    <Card className="w-64 h-fit">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>
          
          <div className="px-3 py-2 border-t">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}