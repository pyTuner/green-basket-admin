import { IUser } from "./login";

export interface AuthContextType {
  user: IUser | null;
  signIn: (params: { token: string; userId: string; role: string; name: string; primaryPhoneNumber: string }) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}