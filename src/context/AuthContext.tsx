import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface LocalUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  session: LocalUser | null;
  user: LocalUser | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_EMAIL = 'admin@bhaktihub.com';

const USERS_KEY = 'bhaktihub_users';
const SESSION_KEY = 'bhaktihub_session';

interface StoredUser extends LocalUser {
  password: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore logged-in user after page refresh
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);

      if (savedSession) {
        setSession(JSON.parse(savedSession));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const user = session;

  const isAdmin = user?.email === ADMIN_EMAIL;

  // REGISTER
  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error: string | null }> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      const savedUsers = localStorage.getItem(USERS_KEY);

      const users: StoredUser[] = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      // Check if email already exists
      const existingUser = users.find(
        (storedUser) => storedUser.email === normalizedEmail
      );

      if (existingUser) {
        return {
          error: 'An account with this email already exists.',
        };
      }

      // Create new user
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        password,
        name: name.trim(),
      };

      users.push(newUser);

      localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
      );

      // Automatically login after registration
      const loggedInUser: LocalUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(loggedInUser)
      );

      setSession(loggedInUser);

      return { error: null };

    } catch (error) {
      console.error('SIGN UP ERROR:', error);

      return {
        error: 'Failed to create account. Please try again.',
      };
    }
  };

  // LOGIN
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      const savedUsers = localStorage.getItem(USERS_KEY);

      const users: StoredUser[] = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      const foundUser = users.find(
        (storedUser) =>
          storedUser.email === normalizedEmail &&
          storedUser.password === password
      );

      if (!foundUser) {
        return {
          error: 'Invalid email or password.',
        };
      }

      const loggedInUser: LocalUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      };

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(loggedInUser)
      );

      setSession(loggedInUser);

      return { error: null };

    } catch (error) {
      console.error('SIGN IN ERROR:', error);

      return {
        error: 'Failed to sign in. Please try again.',
      };
    }
  };

  // LOGOUT
  const signOut = async () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}