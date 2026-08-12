import { createClient } from "@supabase/supabase-js";

import { getSupabasePublicConfig } from "./config";

export function createBrowserSupabaseClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error(
      "Supabase is not configured. Add the required environment variables.",
    );
  }

  return createClient(config.url, config.publishableKey);
}

