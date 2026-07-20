import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type StoredQuestion = {
  id: number;
  category: 'Aptitude' | 'Reasoning' | 'Mathematics';
  difficulty: string;
  question: string;
  options: string[];
  correct_option: string;
  explanation: string;
};

type SafeQuestion = Omit<StoredQuestion, 'correct_option' | 'explanation'>;

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // 1. Pull just ids first — cheap, avoids hauling every question payload over the wire twice
  const { data: idRows, error: idError } = await supabase
    .from('mock_tests')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(50); // only consider recent batches — don't resurface month-old tests

  if (idError || !idRows || idRows.length === 0) {
    return NextResponse.json({ error: 'No mock tests available' }, { status: 404 });
  }

  const randomId = idRows[Math.floor(Math.random() * idRows.length)].id;

  const { data: test, error } = await supabase
    .from('mock_tests')
    .select('id, batch_name, created_at, questions')
    .eq('id', randomId)
    .single();

  if (error || !test) {
    return NextResponse.json({ error: 'Failed to load test' }, { status: 500 });
  }

  // CRITICAL: strip correct_option + explanation server-side before response leaves the API.
  // Note — this only protects users who go through this route. If NEXT_PUBLIC_SUPABASE_ANON_KEY
  // has default RLS on mock_tests, anyone can call the Supabase REST endpoint directly and read
  // correct_option straight off the table. Lock that down with an RLS policy or a Postgres view
  // that excludes those columns for the anon role — this route alone is not sufficient.
  const safeQuestions: SafeQuestion[] = (test.questions as StoredQuestion[]).map((q) => ({
    id: q.id,
    category: q.category,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options,
  }));

  return NextResponse.json({
    test_id: test.id,
    batch_name: test.batch_name,
    questions: safeQuestions,
  });
}