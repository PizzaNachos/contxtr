import { createClient } from '@supabase/supabase-js'
// import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
// console.log(env)
export const supabase = createClient("https://qycqbcxdzugudihdfmfk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5Y3FiY3hkenVndWRpaGRmbWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxOTY2MTEsImV4cCI6MTk5Mjc3MjYxMX0.d2VeKHq6_GIscI6rGhwUFetpwXPl8Vp3hNJptMuaeFI")
