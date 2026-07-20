'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type SafeQuestion = {
  id: number;
  category: 'Aptitude' | 'Reasoning' | 'Mathematics';
  difficulty: string;
  question: string;
  options: string[];
};

const TEST_DURATION_SECONDS = 45 * 60;
const STORAGE_KEY = 'mock_test_session';

type SessionState = {
  test_id: string;
  batch_name: string;
  questions: SafeQuestion[];
  answers: Record<string, string>;
  startedAt: number; // epoch ms — survives refresh, unlike a decrementing counter
};

export default function MockTestPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(TEST_DURATION_SECONDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  // ── Load existing session or fetch a fresh test ──
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSession(JSON.parse(stored));
      setLoading(false);
      return;
    }

    fetch('/api/mock-test/get-random')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load test');
        return res.json();
      })
      .then((data: { test_id: string; batch_name: string; questions: SafeQuestion[] }) => {
        const newSession: SessionState = {
          test_id: data.test_id,
          batch_name: data.batch_name,
          questions: data.questions,
          answers: {},
          startedAt: Date.now(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        setSession(newSession);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((next: SessionState) => {
    setSession(next);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const handleSubmit = useCallback(
    async (finalSession: SessionState) => {
      if (submittingRef.current) return;
      submittingRef.current = true;

      const nameEmail = sessionStorage.getItem('mock_test_user');
      const { user_name, user_email } = nameEmail
        ? JSON.parse(nameEmail)
        : { user_name: 'Anonymous', user_email: '' };

      try {
        const res = await fetch('/api/mock-test/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            test_id: finalSession.test_id,
            user_name,
            user_email,
            user_answers: finalSession.answers,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Submission failed');

        sessionStorage.setItem('mock_test_result', JSON.stringify(data));
        sessionStorage.removeItem(STORAGE_KEY);
        router.push('/mock-test/result');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Submission failed');
        submittingRef.current = false;
      }
    },
    [router],
  );

  // ── Timer: derived from elapsed wall-clock time, not a naive decrement ──
  useEffect(() => {
    if (!session) return;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
      const remaining = Math.max(0, TEST_DURATION_SECONDS - elapsed);
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        handleSubmit(session);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session, handleSubmit]);

  if (loading) return <div className="p-10 text-center">Loading test...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!session) return null;

  const current = session.questions[currentIndex];
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const selectOption = (option: string) => {
    const next = { ...session, answers: { ...session.answers, [String(current.id)]: option } };
    persist(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <span className="font-semibold">{session.batch_name}</span>
        <span
          className={`rounded px-3 py-1 font-mono text-sm ${
            remainingSeconds < 300 ? 'bg-red-100 text-red-700' : 'bg-slate-100'
          }`}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question panel */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              Question {currentIndex + 1} of {session.questions.length} · {current.category}
            </div>
            <h2 className="mb-6 text-lg font-medium">{current.question}</h2>

            <div className="space-y-3">
              {current.options.map((opt) => {
                const selected = session.answers[String(current.id)] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => selectOption(opt)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      selected
                        ? 'border-blue-600 bg-blue-50 font-medium'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="rounded border px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              {currentIndex < session.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((i) => Math.min(session.questions.length - 1, i + 1))}
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit(session)}
                  className="rounded bg-green-600 px-4 py-2 text-white"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Side navigation grid */}
        <div className="w-56 shrink-0 overflow-y-auto border-l bg-white p-4">
          <div className="mb-3 text-xs font-semibold uppercase text-slate-500">Questions</div>
          <div className="grid grid-cols-5 gap-2">
            {session.questions.map((q, idx) => {
              const answered = Boolean(session.answers[String(q.id)]);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex h-9 w-9 items-center justify-center rounded text-sm font-medium ${
                    isCurrent
                      ? 'ring-2 ring-blue-600'
                      : answered
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}