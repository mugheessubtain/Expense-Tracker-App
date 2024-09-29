"use client";

import Logout, { auth } from "@/firebase/firebaseAuth";
import { db, deleteData, saveData } from "@/firebase/firestore";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { collection, doc, DocumentData, onSnapshot, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";

type EditValue = {
    title: string;
    amount: number|string;
    category: string;
    date: string | Date; // depending on how you're storing dates
    note: string;
    id: string ;  // depending on how your ID is structured
};


export default function Home() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState<string|number>("");
    const [category, setCategory] = useState("")
    const [date, setDate] = useState<any>(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState("");
    const [allvalues, setAllValues] = useState<DocumentData[]>([])
    const [editId, setEditId] = useState<string | number|null>(null); // New state to track the editing document




    useEffect(() => {
        let detachAuthChangeListerner=onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchData();
                console.log("fetched");

            }
        })
        return ()=>{
            if(readDataRealTime){
                console.log("detach listerners");
                
                readDataRealTime();
                detachAuthChangeListerner()

            }
        }
    }, []);

    let readDataRealTime:Unsubscribe;
    const fetchData = () => {
        let collectionRef = collection(db, "expenses");
        let currentUser = auth.currentUser?.uid;
        let condition = where("uid", "==", currentUser);
        let q = query(collectionRef, condition);
        let allvaluesdClone = [...allvalues];

        readDataRealTime = onSnapshot(q, (querysnapshot) => {
            // querysnapshot.docChanges().forEach((change) => {
            //     if (change.type === "added") {
            //         let value = change.doc.data();
            //         // console.log(value);

            //         value.id = change.doc.id;
            //         allvaluesdClone.push(value);
            //         setAllValues([...allvaluesdClone])
            //         // console.log(allvaluesdClone);

            //     }
            //     if (change.type === "modified") {
            //     }
            //     if (change.type === "removed") {
            //     }
            // })
            querysnapshot.docChanges().forEach((change) => {
                let value = change.doc.data();
                value.id = change.doc.id; // Add the document ID for future reference
                if (change.type === "added") {
                    // Push new added value into the cloned array
                    allvaluesdClone.push(value);
                }
                if (change.type === "modified") {
                    // Update existing data in case of modification
                    const index = allvaluesdClone.findIndex((item) => item.id === change.doc.id);
                    if (index !== -1) {
                        allvaluesdClone[index] = value;
                    }
                }
                if (change.type === "removed") {
                    //   Remove the deleted item from the array
                    allvaluesdClone = allvaluesdClone.filter((item) => item.id !== change.doc.id);
                }
            });
            setAllValues([...allvaluesdClone]);
        });



    }
    const handleEdit = (value:EditValue) => {
        // Set the current values into the form for editing
        setTitle(value.title);
        setAmount(value.amount);
        setCategory(value.category);
        setDate(value.date);
        setNote(value.note);
        setEditId(value.id); // Track the ID of the document being edited
    };

    const updateData = async () => {
        if (editId) {
            const docRef = doc(db, "expenses",String(editId)); // Reference to the document

            await updateDoc(docRef, {
                title,
                amount,
                category,
                date,
                note
            });
            setEditId(null); // Clear the edit mode after update
            clearForm();
        }
    };

    const clearForm = () => {
        setTitle("");
        setAmount("");
        setCategory("");
        setDate(new Date().toISOString().split('T')[0]);
        setNote("");
    };


    return (
        <>
            <h1>Expense Tracker </h1>
            <label htmlFor="Title">Title:

                <input type="text"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                />
            </label>
            <label htmlFor="Amount">Amount:
                <input type="text"
                    value={amount}
                    onChange={(e) => {
                        setAmount(e.target.value)
                    }}
                />
            </label>
            <label htmlFor="Category">Category:
                <input type="text"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value)
                    }}
                />
            </label>
            <label htmlFor="Date">Date:
                <input type="text"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value)
                    }}
                />
            </label>
            <label htmlFor="Note">Note:
                <input type="text"
                    value={note}
                    onChange={(e) => {
                        setNote(e.target.value)
                    }}
                />
            </label>
            {/* <button onClick={()=>{
            saveData(title,amount,category,date,note)
        }}>Add</button> */}
            {/* Conditionally render Add or Update button */}
            {editId ? (
                <button onClick={updateData}>Update</button>
            ) : (
                <button onClick={() => saveData(title, amount, category, date, note)}>Add</button>
            )}

            {allvalues.length > 0 ? (
                allvalues.map((value, index) => (
                    <div key={index}>
                        <h3>{value.title}</h3>
                        <p>Amount: {value.amount}</p>
                        <p>Category: {value.category}</p>
                        <p>Date: {value.date}</p>
                        <p>Note: {value.note}</p>
                        <button onClick={() => {
                            deleteData(value.id)
                        }}>Delete</button>
                        <button onClick={() => handleEdit(value as EditValue)}>Edit</button>

                    </div>

                ))
            ) : (
                <p>No expenses added yet.</p>
            )}

            <button onClick={Logout}>Logout</button>

        </>
    )
}


// import Logout, { auth } from "@/firebase/firebaseAuth";
// import { db, saveData } from "@/firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { collection, onSnapshot, query, where } from "firebase/firestore";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [note, setNote] = useState("");
//   const [allvalues, setAllValues] = useState([]);

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         fetchData();
//         console.log("fetched");
//       }
//     });
//   }, []);

//   const fetchData = () => {
//     let collectionRef = collection(db, "expenses");
//     let currentUser = auth.currentUser?.uid;
//     let condition = where("uid", "==", currentUser);
//     let q = query(collectionRef, condition);
//     let allvaluesClone = [...allvalues];

//     const unsubscribe = onSnapshot(q, (querysnapshot) => {
//       querysnapshot.docChanges().forEach((change) => {
//         let value = change.doc.data();
//         if (change.type === "added") {
//           // Push new added value into the cloned array
//           allvaluesClone.push(value);
//         }
//         if (change.type === "modified") {
//           // Update existing data in case of modification
//           const index = allvaluesClone.findIndex((item) => item.id === change.doc.id);
//           if (index !== -1) {
//             allvaluesClone[index] = value;
//           }
//         }
//         if (change.type === "removed") {
//           // Remove the deleted item from the array
//           allvaluesClone = allvaluesClone.filter((item) => item.id !== change.doc.id);
//         }
//       });
//       setAllValues([...allvaluesClone]);
//     });

//     return () => unsubscribe(); // Unsubscribe from the listener when component unmounts
//   };

//   return (
//     <>
//       <h1>Expense Tracker</h1>

//       <label htmlFor="Title">
//         Title:
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => {
//             setTitle(e.target.value);
//           }}
//         />
//       </label>

//       <label htmlFor="Amount">
//         Amount:
//         <input
//           type="text"
//           value={amount}
//           onChange={(e) => {
//             setAmount(e.target.value);
//           }}
//         />
//       </label>

//       <label htmlFor="Category">
//         Category:
//         <input
//           type="text"
//           value={category}
//           onChange={(e) => {
//             setCategory(e.target.value);
//           }}
//         />
//       </label>

//       <label htmlFor="Date">
//         Date:
//         <input
//           type="text"
//           value={date}
//           onChange={(e) => {
//             setDate(e.target.value);
//           }}
//         />
//       </label>

//       <label htmlFor="Note">
//         Note:
//         <input
//           type="text"
//           value={note}
//           onChange={(e) => {
//             setNote(e.target.value);
//           }}
//         />
//       </label>

//       <button
//         onClick={() => {
//           saveData(title, amount, category, date, note);
//         }}
//       >
//         Add
//       </button>

//       {allvalues.length > 0 ? (
//         allvalues.map((value, index) => (
//           <div key={index}>
//             <h3>{value.title}</h3>
//             <p>Amount: {value.amount}</p>
//             <p>Category: {value.category}</p>
//             <p>Date: {value.date}</p>
//             <p>Note: {value.note}</p>
//           </div>
//         ))
//       ) : (
//         <p>No expenses added yet.</p>
//       )}

//       <button onClick={Logout}>Logout</button>
//     </>
//   );
// }
