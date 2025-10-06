import { createClerkSupabaseClientSsr } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'

export type TimeEntry = Database['public']['Tables']['time_entries']['Row']
export type TimeEntryInsert = Database['public']['Tables']['time_entries']['Insert']
export type TimeEntryUpdate = Database['public']['Tables']['time_entries']['Update']
export type DailyNote = Database['public']['Tables']['daily_notes']['Row']
export type DailyNoteInsert = Database['public']['Tables']['daily_notes']['Insert']
export type DailyNoteUpdate = Database['public']['Tables']['daily_notes']['Update']

export async function createTimeEntry(timeEntry: TimeEntryInsert) {
  const supabase = await createClerkSupabaseClientSsr()
  const { data, error } = await supabase
    .from('time_entries')
    .insert(timeEntry)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating time entry:', error)
    throw error
  }
  
  return data
}

export async function updateTimeEntry(id: string, updates: TimeEntryUpdate) {
  const supabase = await createClerkSupabaseClientSsr()
  const { data, error } = await supabase
    .from('time_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating time entry:', error)
    throw error
  }
  
  return data
}

export async function getActiveTimeEntry(userId: string) {
  const supabase = await createClerkSupabaseClientSsr()
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .maybeSingle()
  
  if (error) {
    console.error('Error getting active time entry:', error)
    throw error
  }
  
  return data
}

export async function getTimeEntriesByUser(userId: string, limit = 50) {
  const supabase = await createClerkSupabaseClientSsr()
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error getting time entries:', error)
    throw error
  }
  
  return data || []
}

export async function getTimeEntriesForToday(userId: string) {
  const supabase = await createClerkSupabaseClientSsr()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', today.toISOString())
    .lt('start_time', tomorrow.toISOString())
    .order('start_time', { ascending: false })
  
  if (error) {
    console.error('Error getting today\'s time entries:', error)
    throw error
  }
  
  return data || []
}

export async function getDailyNote(userId: string, date: Date) {
  const supabase = await createClerkSupabaseClientSsr()
  const dateStart = new Date(date)
  dateStart.setHours(0, 0, 0, 0)
  const dateEnd = new Date(dateStart)
  dateEnd.setDate(dateEnd.getDate() + 1)
  
  const { data, error } = await supabase
    .from('daily_notes')
    .select('*')
    .eq('user_id', userId)
    .gte('date', dateStart.toISOString())
    .lt('date', dateEnd.toISOString())
    .maybeSingle()
  
  if (error) {
    console.error('Error getting daily note:', error)
    throw error
  }
  
  return data
}

export async function upsertDailyNote(dailyNote: DailyNoteInsert) {
  const supabase = await createClerkSupabaseClientSsr()
  const { data, error } = await supabase
    .from('daily_notes')
    .upsert(dailyNote, {
      onConflict: 'user_id,date'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error upserting daily note:', error)
    throw error
  }
  
  return data
}