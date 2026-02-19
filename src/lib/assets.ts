const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';

export const DEFAULT_AVATAR_URL =
  import.meta.env.VITE_DEFAULT_AVATAR_URL ||
  (supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/public-assets/kate_farmer.png` : '');

export const APP_LOGO_URL =
  import.meta.env.VITE_APP_LOGO_URL ||
  (supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/public-assets/logo.png` : '');

export const MAP_IMAGE_URL =
  import.meta.env.VITE_MAP_IMAGE_URL ||
  (supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/public-assets/map.png` : '') ||
  '/map.png';
