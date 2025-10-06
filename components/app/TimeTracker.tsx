'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Play, Pause, Square, RotateCcw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface TimeEntry {
  id: string
  user_id: string
  start_time: string
  end_time: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED'
  description: string | null
  created_at: string
  updated_at: string
}

interface TimeTrackerProps {
  userId: string
}

export function TimeTracker({ userId }: TimeTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const queryClient = useQueryClient()

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch today's time entries
  const { data: todayEntries = [], isLoading } = useQuery({
    queryKey: ['time-entries', 'today', userId],
    queryFn: async () => {
      const response = await fetch('/api/sessions?period=today')
      if (!response.ok) throw new Error('Failed to fetch time entries')
      const data = await response.json()
      return data.timeEntries as TimeEntry[]
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  })

  // Find active session
  const activeEntry = todayEntries.find(entry => entry.status === 'ACTIVE')

  // Find paused session
  const pausedEntry = todayEntries.find(entry => entry.status === 'PAUSED' && !entry.end_time)

  // Calculate session duration
  const getSessionDuration = (entry: TimeEntry) => {
    const start = new Date(entry.start_time)
    const end = entry.end_time ? new Date(entry.end_time) : currentTime
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000)
    return formatDuration(duration)
  }

  // Calculate total time today
  const getTotalTimeToday = () => {
    let totalSeconds = 0
    todayEntries.forEach(entry => {
      const start = new Date(entry.start_time)
      const end = entry.end_time ? new Date(entry.end_time) : 
                  entry.status === 'ACTIVE' ? currentTime : new Date(entry.updated_at)
      totalSeconds += Math.floor((end.getTime() - start.getTime()) / 1000)
    })
    return formatDuration(totalSeconds)
  }

  // Start session mutation
  const startSession = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/sessions/start', { method: 'POST' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to start session')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
      toast({ title: 'Session started', description: 'Time tracking has begun.' })
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Failed to start session', 
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  // Stop session mutation
  const stopSession = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/sessions/stop', { method: 'POST' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to stop session')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
      toast({ title: 'Session completed', description: 'Time tracking has stopped.' })
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Failed to stop session', 
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  // Pause session mutation
  const pauseSession = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/sessions/pause', { method: 'POST' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to pause session')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
      toast({ title: 'Session paused', description: 'Time tracking has been paused.' })
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Failed to pause session', 
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  // Resume session mutation
  const resumeSession = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/sessions/resume', { method: 'POST' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to resume session')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
      toast({ title: 'Session resumed', description: 'Time tracking has continued.' })
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Failed to resume session', 
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Tracker
        </CardTitle>
        <CardDescription>
          Track your work time honestly - clock in when you start, clock out when you take breaks or finish.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Session Status */}
        <div className="text-center space-y-2">
          {activeEntry ? (
            <>
              <Badge variant="default" className="text-sm px-3 py-1">
                Active Session
              </Badge>
              <div className="text-3xl font-mono font-bold text-green-600">
                {getSessionDuration(activeEntry)}
              </div>
              <p className="text-sm text-muted-foreground">
                Started at {new Date(activeEntry.start_time).toLocaleTimeString()}
              </p>
            </>
          ) : pausedEntry ? (
            <>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Paused Session
              </Badge>
              <div className="text-3xl font-mono font-bold text-yellow-600">
                {getSessionDuration(pausedEntry)}
              </div>
              <p className="text-sm text-muted-foreground">
                Paused at {new Date(pausedEntry.updated_at).toLocaleTimeString()}
              </p>
            </>
          ) : (
            <>
              <Badge variant="outline" className="text-sm px-3 py-1">
                No Active Session
              </Badge>
              <div className="text-3xl font-mono font-bold text-muted-foreground">
                00:00:00
              </div>
              <p className="text-sm text-muted-foreground">
                Click "Clock In" to start tracking
              </p>
            </>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center">
          {!activeEntry && !pausedEntry ? (
            <Button 
              onClick={() => startSession.mutate()}
              disabled={startSession.isPending}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Clock In
            </Button>
          ) : activeEntry ? (
            <>
              <Button 
                onClick={() => pauseSession.mutate()}
                disabled={pauseSession.isPending}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
              <Button 
                onClick={() => stopSession.mutate()}
                disabled={stopSession.isPending}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Clock Out
              </Button>
            </>
          ) : pausedEntry ? (
            <>
              <Button 
                onClick={() => resumeSession.mutate()}
                disabled={resumeSession.isPending}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Resume
              </Button>
              <Button 
                onClick={() => stopSession.mutate()}
                disabled={stopSession.isPending}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Clock Out
              </Button>
            </>
          )}
        </div>

        {/* Daily Total */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Today's Total:</span>
            <span className="text-xl font-mono font-bold">
              {getTotalTimeToday()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total actual work time today
          </p>
        </div>
      </CardContent>
    </Card>
  )
}