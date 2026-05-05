/** Persisted to localStorage. Must never contain secrets. */
export interface PersistedAuthContext {
  badId: number;
}

/** Held only in memory for the current page session. */
export interface ActiveAuthGrant {
  pincode: string;
}

export interface LoginModel {
  [key: string]: string;
  badId: string;
  pincode: string;
}
