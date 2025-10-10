"use client"

import { useUser } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Hero } from '@/components/ui/animated-hero'
import { TimeTracker } from '@/components/app/TimeTracker'
import { DailyNotes } from '@/components/app/DailyNotes'
import { Layout } from '@/components/app/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, FileText, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'

function Dashboard() {
  const { user } = useUser()

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Truth Time Tracker
          </h1>
          <p className="text-xl text-muted-foreground">
            Stop lying to yourself. See the truth about your actual work time.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Welcome back, {user?.firstName || user?.username || 'User'}!
          </p>
        </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Focus</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Be Honest</div>
            <p className="text-xs text-muted-foreground">
              Clock in when you work, clock out when you don't
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Track Reality</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">No Distractions</div>
            <p className="text-xs text-muted-foreground">
              Bathroom breaks, meals, and mom calls all count
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real Results</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5hrs vs 5hrs</div>
            <p className="text-xs text-muted-foreground">
              See what you actually accomplished vs time spent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TimeTracker userId={user?.id || ''} />
        <DailyNotes userId={user?.id || ''} />
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            How to Use Truth Time Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">✅ Clock In When You're Actually Working</h4>
              <p className="text-sm text-muted-foreground">
                Only track time when you're focused and productive. No phone, no social media, no distractions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-red-600">❌ Clock Out for Everything Else</h4>
              <p className="text-sm text-muted-foreground">
                Bathroom breaks, getting food, talking to family, checking phone - clock out for all of it.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">📝 Document Your Accomplishments</h4>
              <p className="text-sm text-muted-foreground">
                Be specific about what you actually got done. "Fixed login bug" is better than "worked on app."
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-600">📊 Review Your Truth</h4>
              <p className="text-sm text-muted-foreground">
                At the end of the day, see the gap between what you thought you did and what you actually did.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </Layout>
  )
}

export default function Home() {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8">
            {/* Landing Section */}
            <div className="text-center mb-16">
              <h1 className="text-6xl font-bold tracking-tight mb-6">
                Truth Time Tracker
              </h1>
              <p className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Stop lying to yourself about how much you work. 
                <span className="font-bold text-primary"> See the truth</span> about your actual productive time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/sign-up">Get Started Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>

            {/* Problem/Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-red-600">The Lie You Tell Yourself</h2>
                <p className="text-xl mb-4">"I worked for 5 hours today!"</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• But you checked your phone 47 times</li>
                  <li>• Took a 45-minute "quick" lunch break</li>
                  <li>• Spent 30 minutes browsing social media</li>
                  <li>• Talked to your mom for 20 minutes</li>
                  <li>• Actually worked: 1.5 hours</li>
                </ul>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4 text-green-600">The Truth This App Shows</h2>
                <p className="text-xl mb-4">"You worked for 1.5 hours today"</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Clock in when you sit down to work</li>
                  <li>• Clock out for every single break</li>
                  <li>• Track what you actually accomplished</li>
                  <li>• See your real productivity numbers</li>
                  <li>• No more lying to yourself</li>
                </ul>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 mb-2 text-blue-600" />
                  <CardTitle>Honest Time Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Simple clock in/out system that forces you to be honest about every single minute.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 mb-2 text-green-600" />
                  <CardTitle>Daily Accomplishments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Document what you actually got done, not what you planned to do.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 mb-2 text-purple-600" />
                  <CardTitle>Brutal Honesty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>See the cold, hard truth about your productivity gap.</p>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Ready for the Truth?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start tracking honestly and see what you're really capable of.
              </p>
              <Button size="lg" asChild>
                <Link href="/sign-up">Start Tracking Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  )
}
