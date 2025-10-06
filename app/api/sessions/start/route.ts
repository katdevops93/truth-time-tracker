import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createTimeEntry, getActiveTimeEntry } from '@/lib/time-tracking'
import { TimeEntryInsert } from '@/lib/time-tracking'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if there's already an active session
    const activeSession = await getActiveTimeEntry(userId)
    if (activeSession) {
      return NextResponse.json({ 
        error: 'You already have an active time tracking session',
        activeSession 
      }, { status: 400 })
    }

    // Create new time entry
    const newTimeEntry: TimeEntryInsert = {
      id: crypto.randomUUID(),
      user_id: userId,
      start_time: new Date().toISOString(),
      status: 'ACTIVE',
      description: null,
    }

    const timeEntry = await createTimeEntry(newTimeEntry)

    return NextResponse.json({ 
      message: 'Time tracking session started',
      timeEntry 
    })

  } catch (error) {
    console.error('Error starting time tracking session:', error)
    return NextResponse.json({ 
      error: 'Failed to start time tracking session' 
    }, { status: 500 })
  }
}