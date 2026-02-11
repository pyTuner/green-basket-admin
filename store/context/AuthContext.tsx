import { AuthContextType } from "@/types/auth.context";
import React, { createContext, useContext, useState } from "react";
import { IUser } from "../../types/login";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren<object>) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const signIn = async ({
    token,
    userId,
    role,
    name,
    primaryPhoneNumber,
  }: {
    token: string;
    userId: string;
    role: string;
    name: string;
    primaryPhoneNumber: string;
  }) => {
    setUser({ token, userId, role, name, primaryPhoneNumber } as IUser);
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, isLoading, setIsLoading, refresh, setRefresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
