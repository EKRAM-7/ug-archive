import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth } from "../lib/fbConfigs";

export default function Loading() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
    })



    return (
        <div>

        </div>
    )
}