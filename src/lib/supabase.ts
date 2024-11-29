import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eoeftptabxywzzajiirj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZWZ0cHRhYnh5d3p6YWppaXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjYxNDksImV4cCI6MjA0ODQ0MjE0OX0.XDVYp0zvEFyNNr6kU5tJr2111hxn_3Jyb0kUY65Ql98';

export const supabase = createClient(supabaseUrl, supabaseKey);