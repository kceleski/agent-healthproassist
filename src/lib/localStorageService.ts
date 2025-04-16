/**
 * Local storage service for managing API keys and other settings
 */

// Storage keys
const STORAGE_KEYS = {
  SERPAPI_KEY: 'serpapi_key',
  OPENAI_KEY: 'openai_key',
  DID_KEY: 'did_key',
  ASSISTANT_ID: 'assistant_id',
  USER_PREFERENCES: 'user_preferences',
};

/**
 * Get a value from local storage
 * @param key Storage key
 * @returns The stored value or null if not found
 */
export const getStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item from local storage: ${key}`, error);
    return null;
  }
};

/**
 * Set a value in local storage
 * @param key Storage key
 * @param value Value to store
 */
export const setStorageItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item in local storage: ${key}`, error);
  }
};

/**
 * Remove a value from local storage
 * @param key Storage key
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from local storage: ${key}`, error);
  }
};

/**
 * Get the SerpAPI key from local storage
 * @returns The SerpAPI key or null if not found
 */
export const getSerpApiKey = (): string | null => {
  return getStorageItem(STORAGE_KEYS.SERPAPI_KEY);
};

/**
 * Set the SerpAPI key in local storage
 * @param key The SerpAPI key
 */
export const setSerpApiKey = (key: string): void => {
  setStorageItem(STORAGE_KEYS.SERPAPI_KEY, key);
};

/**
 * Get the OpenAI API key from local storage
 * @returns The OpenAI API key or null if not found
 */
export const getOpenAiKey = (): string | null => {
  return getStorageItem(STORAGE_KEYS.OPENAI_KEY);
};

/**
 * Set the OpenAI API key in local storage
 * @param key The OpenAI API key
 */
export const setOpenAiKey = (key: string): void => {
  setStorageItem(STORAGE_KEYS.OPENAI_KEY, key);
};

/**
 * Get the D-ID API key from local storage
 * @returns The D-ID API key or null if not found
 */
export const getDidKey = (): string | null => {
  return getStorageItem(STORAGE_KEYS.DID_KEY);
};

/**
 * Set the D-ID API key in local storage
 * @param key The D-ID API key
 */
export const setDidKey = (key: string): void => {
  setStorageItem(STORAGE_KEYS.DID_KEY, key);
};

/**
 * Get the Assistant ID from local storage
 * @returns The Assistant ID or null if not found
 */
export const getAssistantId = (): string | null => {
  return getStorageItem(STORAGE_KEYS.ASSISTANT_ID);
};

/**
 * Set the Assistant ID in local storage
 * @param id The Assistant ID
 */
export const setAssistantId = (id: string): void => {
  setStorageItem(STORAGE_KEYS.ASSISTANT_ID, id);
};

/**
 * Clear all API keys from local storage
 */
export const clearApiKeys = (): void => {
  removeStorageItem(STORAGE_KEYS.SERPAPI_KEY);
  removeStorageItem(STORAGE_KEYS.OPENAI_KEY);
  removeStorageItem(STORAGE_KEYS.DID_KEY);
  removeStorageItem(STORAGE_KEYS.ASSISTANT_ID);
};

export default {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  getSerpApiKey,
  setSerpApiKey,
  getOpenAiKey,
  setOpenAiKey,
  getDidKey,
  setDidKey,
  getAssistantId,
  setAssistantId,
  clearApiKeys,
};