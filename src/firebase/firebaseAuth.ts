


import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, User, signOut } from "firebase/auth";
import { app } from "./firebaseConfig";
import { saveUser } from "./firestore";

export const auth = getAuth(app);
export function Signup(email:string,password:string,userName:string){

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const {email,emailVerified,uid} = userCredential.user;
    console.log("Signup successfully",email);
    saveUser({email:email as string,emailVerified,uid,userName})
    Verifyemail();

    
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error);

    // ..
  });
}


export function Login(email:string,password:string){


signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("login successfully",user);
    


    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error);

  });
}

export function Verifyemail(){

const auth = getAuth(app);
sendEmailVerification(auth.currentUser as User)
  .then(() => {
    console.log("Email verification sent!")
    
    // ...
  });
}


export default function Logout(){

const auth = getAuth(app);
signOut(auth).then(() => {
  console.log("Sign-out successful");
  
}).catch((error) => {
  // An error happened.
});
}