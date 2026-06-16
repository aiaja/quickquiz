import { create } from "zustand";
import { nanoid } from "nanoid";
import { storage } from "~/utils/localStorage";
import { LS_KEYS } from "~/constants";

export const useAuthStore = create((set, get) => ({
  user: null,
  session: storage.get(LS_KEYS.SESSION),
  isAuthenticated: !!storage.get(LS_KEYS.SESSION),

  login: (username, password) => {
    try {
      const users = storage.get(LS_KEYS.USERS)?.users || [];
      const existingUser = users.find((u) => u.username === username);
      const passwordHash = btoa(password); // Simple mock hash as per PRD

      let user;

      if (existingUser) {
        if (existingUser.passwordHash !== passwordHash) {
          return { success: false, error: "Password salah" };
        }
        user = existingUser;
      } else {
        // Auto-register
        user = {
          id: `usr_${nanoid(8)}`,
          username,
          passwordHash,
          createdAt: new Date().toISOString(),
        };
        storage.set(LS_KEYS.USERS, { users: [...users, user] });
      }

      const session = {
        userId: user.id,
        username: user.username,
        loginAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      };

      storage.set(LS_KEYS.SESSION, session);
      set({ user, session, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Terjadi kesalahan sistem" };
    }
  },

  logout: () => {
    storage.remove(LS_KEYS.SESSION);
    set({ user: null, session: null, isAuthenticated: false });
  },

  checkSession: () => {
    const session = storage.get(LS_KEYS.SESSION);
    if (session) {
      const isExpired = new Date(session.expiresAt).getTime() < Date.now();
      if (isExpired) {
        get().logout();
      } else {
        set({ session, isAuthenticated: true });
      }
    }
  },
}));
