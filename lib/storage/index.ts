export { getStorageProvider, setStorageProvider, deleteStorageFile, LOCAL_STORAGE_ROOT } from "./adapter";
export type { StorageProvider, StorageFile, UploadResult } from "./adapter";
export { LocalStorageProvider } from "./local";
export { SupabaseStorageProvider } from "./supabase";
