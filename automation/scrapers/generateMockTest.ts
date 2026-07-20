// CLI: npx ts-node --compiler-options '{"module":"CommonJS"}' automation/scrapers/generateMockTest.ts

import path from 'path';

// Same env-loading pattern as runScrapers.ts
const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require('dotenv');
    const result = dotenv.config({ path: path.resolve(process.cwd(), file), override: false });
    if (!result.error) console.log(`[env] Loaded ${file}`);
  } catch { /* dotenv not installed */ }
}

import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

export type MockQuestion = {
  id: number;
  category: 'Aptitude' | 'Reasoning' | 'Mathematics';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correct_option: string;
  explanation: string;
};

const MODEL = process.env.GEMINI_MOCKTEST_MODEL || 'gemini-2.5-flash';

const RESPONSE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER },
      category: { type: Type.STRING, enum: ['Aptitude', 'Reasoning', 'Mathematics'] },
      difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
      question: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING } },
      correct_option: { type: Type.STRING },
      explanation: { type: Type.STRING },
    },
    required: ['id', 'category', 'difficulty', 'question', 'options', 'correct_option', 'explanation'],
  },
};

const PROMPT = `You are generating a mock test for Indian government exam aspirants (SSC/Bank/Railway pattern).
Produce exactly 30 multiple-choice questions:
- 10 questions with category "Aptitude"
- 10 questions with category "Reasoning"
- 10 questions with category "Mathematics"

Rules:
- id must be a unique integer from 1 to 30, in order.
- Each question has exactly 4 options in the "options" array.
- "correct_option" must be an exact string match to one of the 4 "options" values (not a letter like "A").
- "explanation" must be a short step-by-step justification, 2-4 sentences.
- Mix difficulty across Easy/Medium/Hard, roughly evenly, per category.
- No duplicate questions. No markdown formatting inside strings.
Return only the JSON array matching the schema. No prose, no commentary.`;

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  return createClient(url, key, { auth: { persistSession: false } });
}

// ── Validate the model's output before it ever touches the DB ──
function validateQuestions(raw: unknown): MockQuestion[] {
  if (!Array.isArray(raw) || raw.length !== 30) {
    throw new Error(`Expected 30 questions, got ${Array.isArray(raw) ? raw.length : typeof raw}`);
  }

  const counts: Record<string, number> = { Aptitude: 0, Reasoning: 0, Mathematics: 0 };
  const seenIds = new Set<number>();

  for (const q of raw as MockQuestion[]) {
    if (!q || typeof q.id !== 'number' || seenIds.has(q.id)) {
      throw new Error(`Invalid or duplicate question id: ${q?.id}`);
    }
    seenIds.add(q.id);

    if (!['Aptitude', 'Reasoning', 'Mathematics'].includes(q.category)) {
      throw new Error(`Invalid category "${q.category}" on question ${q.id}`);
    }
    counts[q.category] += 1;

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Question ${q.id} does not have exactly 4 options`);
    }
    if (!q.options.includes(q.correct_option)) {
      throw new Error(`Question ${q.id}: correct_option is not one of the listed options`);
    }
  }

  if (counts.Aptitude !== 10 || counts.Reasoning !== 10 || counts.Mathematics !== 10) {
    throw new Error(`Category split off: ${JSON.stringify(counts)} (expected 10/10/10)`);
  }

  return raw as MockQuestion[];
}

export async function generateMockTest(batchName?: string): Promise<{ id: string; batch_name: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY in env');

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: PROMPT,
    config: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.9, // vary questions across runs
    },
  });

  const rawText = response.text;
  if (!rawText) throw new Error('Empty response from GenAI model');

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error('Model did not return valid JSON');
  }

  const questions = validateQuestions(parsed);

  const finalBatchName =
    batchName || `Batch-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 6)}`;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('mock_tests')
    .insert({ batch_name: finalBatchName, questions })
    .select('id, batch_name')
    .single();

  if (error) throw new Error(`[supabase] mock_tests insert failed: ${error.message}`);

  console.log(`[generateMockTest] Saved batch "${data.batch_name}" (id=${data.id}) with 30 questions`);
  return data;
}

// CLI: npx ts-node automation/scrapers/generateMockTest.ts
if (require.main === module) {
  generateMockTest()
    .then((batch) => console.log('✅ Done:', batch))
    .catch((err) => {
      console.error('❌ generateMockTest failed:', err.message ?? err);
      process.exit(1);
    });
}