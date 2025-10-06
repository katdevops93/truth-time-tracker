import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDailyNote, upsertDailyNote } from '@/lib/time-tracking'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const date = dateParam ? new Date(dateParam) : new Date()

    const dailyNote = await getDailyNote(userId, date)

    return NextResponse.json({ 
      dailyNote,
      date: date.toISOString()
    })

  } catch (error) {
    console.error('Error retrieving daily note:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve daily note' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, date } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ 
        error: 'Content is required and must be a string' 
      }, { status: 400 })
    }

    const noteDate = date ? new Date(date) : new Date()

    const dailyNote = await upsertDailyNote({
      id: crypto.randomUUID(),
      user_id: userId,
      content: content.trim(),
      date: noteDate.toISOString(),
    })

    return NextResponse.json({ 
      message: 'Daily note saved successfully',
      dailyNote 
    })

  } catch (error) {
    console.error('Error saving daily note:', error)
    return NextResponse.json({ 
      error: 'Failed to save daily note' 
    }, { status: 500 })
  }
}