'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ReviewItem = {
  id: number;
  category: string;
  question: string;
  options: string[];
  selected_option: string | null;
  correct_option: string;
  explanation: string;
  is_correct: boolean;
};

type ResultData = {
  total_score: number;
  total_questions: number;
  category_breakdown: Record<string, { correct: number; total: number }>;
  review: ReviewItem[];
};

export default function ResultsPage() {
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('mock_test_result');
    if (stored) setResult(JSON.parse(stored));
  }, []);

  if (!result) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4 text-slate-600">No result found for this session.</p>
        <Link href="/mock-test" className="text-blue-600 underline">
          Take a mock test
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold">Your Result</h1>

        {/* Overall score */}
        <div className="mb-6 rounded-xl bg-white p-6 text-center shadow-sm">
          <div className="text-4xl font-bold text-blue-600">
            {result.total_score} / {result.total_questions}
          </div>
          <div className="text-slate-500">Total Score</div>
        </div>

        {/* Category breakdown */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {Object.entries(result.category_breakdown).map(([category, stats]) => (
            <div key={category} className="rounded-lg bg-white p-4 text-center shadow-sm">
              <div className="text-lg font-semibold">
                {stats.correct}/{stats.total}
              </div>
              <div className="text-sm text-slate-500">{category}</div>
            </div>
          ))}
        </div>

        {/* Question-by-question review */}
        <h2 className="mb-3 text-lg font-semibold">Review</h2>
        <div className="space-y-4">
          {result.review.map((item, idx) => (
            <div key={item.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-1 text-xs uppercase tracking-wide text-slate-500">
                Q{idx + 1} · {item.category}
              </div>
              <p className="mb-3 font-medium">{item.question}</p>

              <div className="mb-3 space-y-2">
                {item.options.map((opt) => {
                  const isCorrectOpt = opt === item.correct_option;
                  const isSelectedOpt = opt === item.selected_option;
                  let style = 'border-slate-200';
                  if (isCorrectOpt) style = 'border-green-500 bg-green-50';
                  else if (isSelectedOpt && !isCorrectOpt) style = 'border-red-500 bg-red-50';

                  return (
                    <div key={opt} className={`rounded border p-2 text-sm ${style}`}>
                      {opt}
                      {isCorrectOpt && <span className="ml-2 text-green-700">✓ Correct</span>}
                      {isSelectedOpt && !isCorrectOpt && (
                        <span className="ml-2 text-red-700">✗ Your answer</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="rounded bg-slate-50 p-3 text-sm text-slate-700">
                <span className="font-medium">Explanation: </span>
                {item.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}