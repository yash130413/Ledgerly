import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Only use in Server Actions / Route Handlers — never import in client components
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
