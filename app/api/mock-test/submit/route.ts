import { NextRequest, NextResponse } from 'next/server';
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

type SubmitBody = {
  test_id: string;
  user_name: string;
  user_email: string;
  user_answers: Record<string, string>; // question id (as string) -> selected option text
};

const MAX_ATTEMPTS_PER_EMAIL = 3;

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { test_id, user_name, user_email, user_answers } = body;

  if (!test_id || !user_name || !user_email || !user_answers || typeof user_answers !== 'object') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(user_email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // ── Oracle mitigation: cap attempts per (test_id, email) ──
  // This route returns every correct_option + explanation on success. Without a cap, it's a
  // free answer-key dispenser: submit garbage 30 times, harvest every answer, then submit for
  // real. This does not fully solve it (an attacker can still use 3 emails), but it removes
  // the trivial single-session farming case. A real exam should gate this behind auth instead.
  const { count: priorAttempts, error: countError } = await supabase
    .from('test_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('test_id', test_id)
    .eq('user_email', user_email);

  if (countError) {
    return NextResponse.json({ error: 'Failed to verify attempt history' }, { status: 500 });
  }
  if ((priorAttempts ?? 0) >= MAX_ATTEMPTS_PER_EMAIL) {
    return NextResponse.json(
      { error: `Maximum ${MAX_ATTEMPTS_PER_EMAIL} attempts reached for this test` },
      { status: 429 },
    );
  }

  // ── Fetch the real test (with answers) — never trust anything from the client here ──
  const { data: test, error: testError } = await supabase
    .from('mock_tests')
    .select('id, questions')
    .eq('id', test_id)
    .single();

  if (testError || !test) {
    return NextResponse.json({ error: 'Test not found' }, { status: 404 });
  }

  const questions = test.questions as StoredQuestion[];

  const categoryBreakdown: Record<string, { correct: number; total: number }> = {
    Aptitude: { correct: 0, total: 0 },
    Reasoning: { correct: 0, total: 0 },
    Mathematics: { correct: 0, total: 0 },
  };

  const review = questions.map((q) => {
    const selected = user_answers[String(q.id)] ?? null;
    const isCorrect = selected !== null && selected === q.correct_option;

    categoryBreakdown[q.category].total += 1;
    if (isCorrect) categoryBreakdown[q.category].correct += 1;

    return {
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options,
      selected_option: selected,
      correct_option: q.correct_option,
      explanation: q.explanation,
      is_correct: isCorrect,
    };
  });

  const totalScore = Object.values(categoryBreakdown).reduce((sum, c) => sum + c.correct, 0);

  const { error: insertError } = await supabase.from('test_attempts').insert({
    test_id,
    user_name,
    user_email,
    score_breakdown: categoryBreakdown,
    total_score: totalScore,
  });

  if (insertError) {
    return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 });
  }

  return NextResponse.json({
    total_score: totalScore,
    total_questions: questions.length,
    category_breakdown: categoryBreakdown,
    review,
  });
}