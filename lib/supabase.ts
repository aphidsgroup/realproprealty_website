import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxkhkwzkbonplsfmdcl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeGtoa3d6a2JvbnBsc2ZtZGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY1NDcsImV4cCI6MjA4NjQ5MjU0N30.3USGzY9K5mtLEejxZ4amysfpjHRsmBqIDbsHMLLhUTI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
