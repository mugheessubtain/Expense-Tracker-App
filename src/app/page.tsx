// "use client"
// import { useRouter } from "next/navigation";


// export default function Home() {
//   let router=useRouter()
//   return (
//     <div>
//     {router.push("/login")}
//     <h1>Loading...</h1>
//     </div>
//   );
// }
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter(); // This should infer correctly

    useEffect(() => {
        // Redirect to the login page when the component mounts
        router.push("/login");
    }, [router]);

    return (
        <div>
            <h1>Loading...</h1>
        </div>
    );
}
