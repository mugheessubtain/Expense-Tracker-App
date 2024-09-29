"use client"

import { Login } from "@/firebase/firebaseAuth";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const[email,setEmail]=useState("")
  const[password,setPassword]=useState("")

  return (
    <div>
    
    <h1>Login</h1>
    <label htmlFor="email">Email:
        <input type="email" 
        value={email}
        onChange={(e)=>{
            setEmail(e.target.value)
        }}
        />
    </label>
    <label htmlFor="email">Password:
        <input type="text" 
        value={password}
        onChange={(e)=>{
            setPassword(e.target.value)
        }}
        />
    </label>
    <p>Donot have an account.
        <Link href={"/Signup"}>
        Signup
        </Link>

        here</p>
        <button onClick={()=>{
            Login(email,password)
        }}>Login</button>
    </div>
  );
}
