-- Create question_votes table
CREATE TABLE IF NOT EXISTS public.question_votes (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (question_id, user_id)
);

-- Enable RLS on question_votes
ALTER TABLE public.question_votes ENABLE ROW LEVEL SECURITY;

-- Policies for question_votes
CREATE POLICY "Anyone can view question votes" ON public.question_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can cast a vote" ON public.question_votes FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can remove their own vote" ON public.question_votes FOR DELETE USING (auth.uid() = user_id);

-- Create answer_votes table
CREATE TABLE IF NOT EXISTS public.answer_votes (
  id BIGSERIAL PRIMARY KEY,
  answer_id BIGINT NOT NULL REFERENCES public.answers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (answer_id, user_id)
);

-- Enable RLS on answer_votes
ALTER TABLE public.answer_votes ENABLE ROW LEVEL SECURITY;

-- Policies for answer_votes
CREATE POLICY "Anyone can view answer votes" ON public.answer_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can cast a vote" ON public.answer_votes FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can remove their own vote" ON public.answer_votes FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions to authenticated and anonymous users
GRANT ALL ON public.question_votes TO authenticated;
GRANT SELECT ON public.question_votes TO anon;
GRANT ALL ON public.answer_votes TO authenticated;
GRANT SELECT ON public.answer_votes TO anon;
