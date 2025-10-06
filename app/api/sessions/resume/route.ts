import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { updateTimeEntry, getTimeEntriesByUser } from '@/lib/time-tracking'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the most recent paused session
    const timeEntries = await getTimeEntriesByUser(userId, 10)
    const pausedSession = timeEntries.find(entry => entry.status === 'PAUSED' && !entry.end_time)

    if (!pausedSession) {
      return NextResponse.json({ 
        error: 'No paused time tracking session found' 
      }, { status: 404 })
    }

    // Update the session back to active status
    const updatedTimeEntry = await updateTimeEntry(pausedSession.id, {
      status: 'ACTIVE'
    })

    return NextResponse.json({ 
      message: 'Time tracking session resumed',
      timeEntry: updatedTimeEntry 
    })

  } catch (error) {
    console.error('Error resuming time tracking session:', error)
    return NextResponse.json({ 
      error: 'Failed to resume time tracking session' 
    }, { status: 500 })
  }
}