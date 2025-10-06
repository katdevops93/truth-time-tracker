'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, FileText, Calendar } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface DailyNote {
  id: string
  user_id: string
  content: string
  date: string
  created_at: string
  updated_at: string
}

interface DailyNotesProps {
  userId: string
}

export function DailyNotes({ userId }: DailyNotesProps) {
  const [content, setContent] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const queryClient = useQueryClient()

  // Fetch today's note
  const { data: noteData, isLoading } = useQuery({
    queryKey: ['daily-note', userId],
    queryFn: async () => {
      const response = await fetch('/api/notes')
      if (!response.ok) throw new Error('Failed to fetch daily note')
      return response.json() as Promise<{ dailyNote: DailyNote | null; date: string }>
    },
  })

  // Set initial content when note is loaded
  useEffect(() => {
    if (noteData?.dailyNote?.content) {
      setContent(noteData.dailyNote.content)
      setLastSaved(new Date(noteData.dailyNote.updated_at))
    } else {
      setContent('')
      setLastSaved(null)
    }
    setIsDirty(false)
  }, [noteData])

  // Save note mutation
  const saveNote = useMutation({
    mutationFn: async (noteContent: string) => {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: noteContent,
          date: noteData?.date || new Date().toISOString()
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save note')
      }
      return response.json()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['daily-note', userId], data)
      setIsDirty(false)
      setLastSaved(new Date())
      toast({ 
        title: 'Note saved', 
        description: 'Your daily accomplishments have been recorded.' 
      })
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Failed to save note', 
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const handleContentChange = (value: string) => {
    setContent(value)
    setIsDirty(value !== (noteData?.dailyNote?.content || ''))
  }

  const handleSave = () => {
    if (content.trim()) {
      saveNote.mutate(content)
    } else {
      toast({ 
        title: 'Cannot save empty note', 
        description: 'Please write something before saving.',
        variant: 'destructive'
      })
    }
  }

  const getWordCount = () => {
    return content.trim() ? content.trim().split(/\s+/).length : 0
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Daily Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Daily Notes
        </CardTitle>
        <CardDescription>
          Document what you accomplished today. Be honest with yourself!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {noteData ? formatDate(noteData.date) : formatDate(new Date().toISOString())}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {noteData?.dailyNote && (
              <Badge variant="secondary" className="text-xs">
                {getWordCount()} words
              </Badge>
            )}
            {isDirty && (
              <Badge variant="outline" className="text-xs">
                Unsaved
              </Badge>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <label htmlFor="daily-note" className="text-sm font-medium">
            What did you accomplish today?
          </label>
          <Textarea
            id="daily-note"
            placeholder="Today I accomplished...&#10;&#10;Be specific and honest about what you actually got done, not what you planned to do."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[150px] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {lastSaved && (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
            {!lastSaved && !content && (
              <span>Start writing to track your accomplishments</span>
            )}
          </div>
          <Button 
            onClick={handleSave}
            disabled={saveNote.isPending || !isDirty || !content.trim()}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saveNote.isPending ? 'Saving...' : 'Save Note'}
          </Button>
        </div>

        {/* Writing Prompts */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            Writing prompts:
          </p>
          <div className="flex flex-wrap gap-1">
            {[
              "Completed tasks",
              "Problems solved", 
              "Things learned",
              "What went well",
              "What could be better"
            ].map((prompt) => (
              <Badge 
                key={prompt}
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-muted"
                onClick={() => handleContentChange(
                  content + (content ? '\n• ' : '• ') + prompt + ': '
                )}
              >
                {prompt}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}