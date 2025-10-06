import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { updateTimeEntry, getActiveTimeEntry } from '@/lib/time-tracking'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the active session
    const activeSession = await getActiveTimeEntry(userId)
    if (!activeSession) {
      return NextResponse.json({ 
        error: 'No active time tracking session found' 
      }, { status: 404 })
    }

    // Update the session with paused status
    const updatedTimeEntry = await updateTimeEntry(activeSession.id, {
      status: 'PAUSED'
    })

    return NextResponse.json({ 
      message: 'Time tracking session paused',
      timeEntry: updatedTimeEntry 
    })

  } catch (error) {
    console.error('Error pausing time tracking session:', error)
    return NextResponse.json({ 
      error: 'Failed to pause time tracking session' 
    }, { status: 500 })
  }
}