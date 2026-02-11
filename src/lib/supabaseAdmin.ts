
import { createClient } from '@supabase/supabase-js'

// WARNING: This client bypasses RLS policies.
// Use ONLY in secure Server Actions or API routes.
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)
