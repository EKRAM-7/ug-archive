import { Link } from "react-router-dom";
import {auth} from '../lib/fbConfigs'
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";


export default function PoemTitleComp({ poemInfo, onDelete }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
    }, [])

    return (

        <div className="poem-title-div">
            <Link to={`/dashboard/${poemInfo.poemId}`}>
                <li className="poem-title">
                    {poemInfo.poemTitle}
                </li>
            </Link>

            {
                user ? (
                    <button onClick={() => onDelete(poemInfo.poemId)}>❌</button>
                ) : null
            }

        </div>
    )
}