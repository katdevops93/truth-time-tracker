import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getTimeEntriesByUser, getTimeEntriesForToday } from '@/lib/time-tracking'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'recent'
    const limit = parseInt(searchParams.get('limit') || '50')

    let timeEntries

    switch (period) {
      case 'today':
        timeEntries = await getTimeEntriesForToday(userId)
        break
      case 'recent':
      default:
        timeEntries = await getTimeEntriesByUser(userId, limit)
        break
    }

    return NextResponse.json({ 
      timeEntries,
      period,
      count: timeEntries.length
    })

  } catch (error) {
    console.error('Error retrieving time entries:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve time entries' 
    }, { status: 500 })
  }
}