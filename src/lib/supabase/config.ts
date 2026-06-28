export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
}

export function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

export function hasSupabaseEnv() {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}

export function getBusinessCardBucket() {
  return process.env.NEXT_PUBLIC_SUPABASE_BUSINESS_CARD_BUCKET || "business-cards";
}
