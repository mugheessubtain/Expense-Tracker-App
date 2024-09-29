import { addDoc, collection, deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";
import { auth } from "./firebaseAuth";

export const db=getFirestore(app)

type userDataType={
    email:string,
    emailVerified:boolean,
    uid:string,
    userName:string

}
export async function saveUser(userData:userDataType) {
    try{
        let docRef=doc(db,"userOfExpense",userData.uid);
        await setDoc(docRef,userData)
        console.log("user Expense");
        
    }
    catch(e)
    {
        console.log(e);
        
    }
    
}

export async function deleteData(docId:string) {
    // import { doc, deleteDoc } from "firebase/firestore";

await deleteDoc(doc(db, "expenses", docId));
    
}
export async function saveData(title:string,amount:string|number,category:string,date:string,note:string) {
    let uid=auth.currentUser?.uid;
    let allData={uid,title,amount,category,date,note}
    try{
        let collectionRef=collection(db,"expenses");
        await addDoc(collectionRef,allData);
        console.log("added");
        
    }
    catch(e)
    {
        console.log(e);
        
    }
}

