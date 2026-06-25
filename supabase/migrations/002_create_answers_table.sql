-- Create the answers table
CREATE TABLE IF NOT EXISTS public.answers (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  body TEXT NOT NULL,
  votes INT DEFAULT 0 NOT NULL,
  is_solution BOOLEAN DEFAULT false NOT NULL,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for quick lookup on questions and users
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON public.answers(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view answers" ON public.answers;
DROP POLICY IF EXISTS "Users can insert their own answers" ON public.answers;
DROP POLICY IF EXISTS "Users can update their own answers" ON public.answers;
DROP POLICY IF EXISTS "Users can delete their own answers" ON public.answers;

-- Policy: Anyone can view all answers
CREATE POLICY "Anyone can view answers"
ON public.answers FOR SELECT
USING (true);

-- Policy: Authenticated users can insert their own answers
CREATE POLICY "Users can insert their own answers"
ON public.answers FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  auth.uid() IS NOT NULL
);

-- Policy: Users can update only their own answers
CREATE POLICY "Users can update their own answers"
ON public.answers FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own answers
CREATE POLICY "Users can delete their own answers"
ON public.answers FOR DELETE
USING (auth.uid() = user_id);

-- Grant permissions to authenticated and anonymous users
GRANT ALL ON public.answers TO authenticated;
GRANT SELECT ON public.answers TO anon;
