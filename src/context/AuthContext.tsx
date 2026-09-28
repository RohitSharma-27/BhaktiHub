import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

interface LocalUser {
  id: string;
  email: string;
  name: string;
  phone: string;
}

interface AuthContextValue {
  session: LocalUser | null;
  user: LocalUser | null;
  loading: boolean;
  isAdmin: boolean;

  signUp: (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => Promise<{ error: string | null }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_EMAIL = 'admin@SankirtanHub.com';

const USERS_KEY = 'SankirtanHub_users';
const SESSION_KEY = 'SankirtanHub_session';

interface StoredUser extends LocalUser {
  password: string;
}

const isValidIndianPhone = (phone: string) => {
  const value = phone.trim();

  if (!/^[6-9]\d{9}$/.test(value)) {
    return false;
  }

  // Reject numbers such as 7777777777, 8888888888, etc.
  if (/^(\d)\1{9}$/.test(value)) {
    return false;
  }

  // Reject obvious test/sequential numbers
  const fakeNumbers = [
    '0123456789',
    '1234567890',
    '0987654321',
    '9876543210',
  ];

  return !fakeNumbers.includes(value);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore logged-in user after page refresh
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);

      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);

        setSession({
          id: parsedSession.id,
          email: parsedSession.email,
          name: parsedSession.name,
          phone: parsedSession.phone ?? '',
        });
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
    name: string,
    phone: string
  ): Promise<{ error: string | null }> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedName = name.trim();
      const normalizedPhone = phone.trim();

      if (!normalizedName) {
        return {
          error: 'Name is required.',
        };
      }

      if (!isValidIndianPhone(normalizedPhone)) {
        return {
          error: 'Please enter a valid 10-digit mobile number.',
        };
      }

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

      // Check if phone already exists
      const existingPhoneUser = users.find(
        (storedUser) => storedUser.phone === normalizedPhone
      );

      if (existingPhoneUser) {
        return {
          error: 'An account with this phone number already exists.',
        };
      }

      // Create new user
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        password,
        name: normalizedName,
        phone: normalizedPhone,
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
        phone: newUser.phone,
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
        phone: foundUser.phone ?? '',
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