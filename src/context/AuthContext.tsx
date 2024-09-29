"use client"
import { Verifyemail } from "@/firebase/firebaseAuth";
import { app } from "@/firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type UserType = {
  email: string | null,
  uid: string
}

type AuthContextProviderType = {
  children: ReactNode
}

type AuthContextType = {
  user: UserType | null
}


const AuthContext=createContext<AuthContextType | null>(null);


export default function AuthProvider({children}: AuthContextProviderType){
    const[user,setUser]=useState<UserType | null>(null)
    let router=useRouter();
    useEffect(()=>{

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  if (user) {
    const {email,uid,emailVerified}=user
    emailVerified?router.push("/home"):router.push("/emailVerify")
    setUser({email,uid})
    console.log("authChange");
    
    // ...
  } else {
    // User is signed out
    router.push("/")
  }
});
    },[])
    return(
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    )
}


export const AuthFunc=()=> useContext(AuthContext)

