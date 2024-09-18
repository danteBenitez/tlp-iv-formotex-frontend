import { api } from "@/features/common/api";
import useSecureStorage from "@/features/common/use-storage";
import { getUserProfile } from "@/features/profile/services/get-profile";
import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useEffect } from "react";
import { ROLES } from "../const/roles";
import { User } from "../interfaces/user";
import {
  SignInParams,
  signIn as signInService,
  SignUpParams,
  signUp as signUpService,
} from "../services/auth";

type AuthContext = {
  signIn: (user: SignInParams) => Promise<void>;
  signOut: () => void;
  signUp: (user: SignUpParams) => Promise<void>;
  refetch: () => void;
} & {
  user: User | null;
  token: string | null;
  isEmployee: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  status: "unauthenticated" | "loading" | "authenticated";
};

const getStatus = (
  loading: boolean,
  user: User | null | undefined,
  token: string | null
): AuthContext["status"] => {
  if (!token) {
    return "unauthenticated";
  }
  if (loading) return "loading";
  if (!loading && user) return "authenticated";
  return "loading";
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { value: token, setItem: setToken } = useSecureStorage("token");

  const getUser = useCallback(async () => {
    if (!token) return null;
    const user = await getUserProfile({ token });
    return user;
  }, [token]);

  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: ["user", token],
    queryFn: getUser,
    enabled: !!token,
  });

  const isAdmin = user?.roles.some((role) => role.name === ROLES.ADMIN);
  const isEmployee = user?.roles.some((role) => role.name == ROLES.EMPLOYEE);

  const signIn = async (fields: SignInParams) => {
    const response = await signInService(fields);
    setToken(response.data.token);
  };

  const signUp = async (fields: SignUpParams) => {
    const response = await signUpService(fields);
    setToken(response.token);
  };

  useEffect(() => {
    if (!token) {
      delete api.defaults.headers.Authorization;
      return;
    }
    api.defaults.headers.Authorization = `Bearer ${token}`;
    refetchUser();
  }, [token]);

  const signOut = () => {
    setToken(null);
  };

  const loading = userLoading;
  const isAuthenticated = !!token && !!user && !loading;
  const status = getStatus(loading, user as User, token);

  return (
    <AuthContext.Provider
      value={
        {
          user,
          token,
          isAdmin,
          signUp,
          isEmployee,
          signIn,
          signOut,
          loading,
          isAuthenticated,
          status,
          refetch: refetchUser,
        } as AuthContext
      }
    >
      {children}
    </AuthContext.Provider>
  );
}
