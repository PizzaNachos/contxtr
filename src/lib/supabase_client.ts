import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(platform.env.SUPABASE_URL, platform.env.SUPABASE_KEY)
