"use client"

import { auth, Verifyemail } from "@/firebase/firebaseAuth"
import { db } from "@/firebase/firestore";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function VerifyEmail(){
    let router=useRouter();

    useEffect(()=>{
        let detachOnAuthListener=onAuthStateChanged(auth,(user)=>{
            if(user){
                fetchUser()
            }
        })
    return ()=>{
        if(readRealtimeUserEmail){

            detachOnAuthListener()
            readRealtimeUserEmail()
        }
    }
    },[])



    
    let readRealtimeUserEmail:Unsubscribe;

    let fetchUser=()=>{
        let collectionRef=collection(db,"userOfExpense");
        let  userUid=auth.currentUser?.uid;
        let codition=where("uid","==",userUid);
        let q=query(collectionRef,codition);
        readRealtimeUserEmail=onSnapshot(q,(querySnapShot)=>{
            querySnapShot.docChanges().forEach((change)=>{
                if(change.type==="added"){
                    // console.log(auth.currentUser?.uid);
                    
                }
                if(change.type==="modified"){
                    // console.log("modified");
                    
                    if(auth.currentUser?.emailVerified){
                        console.log("modified inide");
                        router.push("/home");
                    }
                }
            })
        })}
    return(
        <>
        <h1>Please Verify Your Email...</h1>
        <button onClick={Verifyemail}>Send Again</button>
        </>
    )
}