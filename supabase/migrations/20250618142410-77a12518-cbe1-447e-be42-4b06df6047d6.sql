
-- Update the existing To-Do List table to include user_id for better data organization
ALTER TABLE public."To-Do List" 
ADD COLUMN user_id TEXT DEFAULT 'default_user';

-- Create a table for storing todo pins
CREATE TABLE public.todo_pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default_user',
  pin_hash TEXT NOT NULL,
  access_time INTEGER NOT NULL, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables (making them public for now since no auth is implemented)
ALTER TABLE public."To-Do List" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todo_pins ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication is implemented)
CREATE POLICY "Public access to todos" 
  ON public."To-Do List" 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public access to todo pins" 
  ON public.todo_pins 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Enable realtime for the todos table
ALTER TABLE public."To-Do List" REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public."To-Do List";
