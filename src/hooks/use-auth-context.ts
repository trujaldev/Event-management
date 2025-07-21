import { TAuthenticatedUser, TLoginForm, TSignUpForm, TUser } from "@/types/schemaTypes";
import { createContext, useContext } from "react";

export interface AuthContextType {
    user: TAuthenticatedUser | null;
    usersList: TUser[];
    login: (userData: TLoginForm) => Promise<void>;
    signUp: (userData: Omit<TSignUpForm, "confirm_password">) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }

    return context;
};

export default useAuthContext;
