export const SUPABASE_URL = "https://zsqypecdfgkturkkjard.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcXlwZWNkZmdrdHVya2tqYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTI5OTAsImV4cCI6MjA4NjEyODk5MH0.KbTS1XjzztGrvWLkrfJwbL9aDhyPgq8I0zP0uQM8rNw";

export async function fetchJobs() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?select=*&order=posted_date.desc&limit=6`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    }
  );

  return res.json();
}
