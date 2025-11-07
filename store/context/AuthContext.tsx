import React, { createContext, useContext, useEffect, useState } from 'react';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);


    useEffect(() => {
        // read stored token/user from AsyncStorage here (demo: none)
    }, []);


    const signIn = async ({ email }) => {
        // call API, validate, store token
        setUser({ email });
    };


    const signOut = async () => {
        setUser(null);
    };


    return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}


export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};