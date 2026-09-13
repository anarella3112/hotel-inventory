const defaultUrl = "https://dbiguqwbfexkwauzpjtt.supabase.co";
const defaultPublishableKey = "sb_publishable_l1Bx-0SZKd3Ohj---C1H3g_oUp6atHu";

export const supabaseUrl =
  (process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl).replace(/^=/, "").trim();

export const supabasePublishableKey =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultPublishableKey)
    .replace(/^=/, "")
    .trim();
