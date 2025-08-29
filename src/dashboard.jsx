import { onAuthStateChanged, signOut } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, db } from "../lib/fbConfigs"
import { Link, useNavigate } from "react-router-dom"
import { addDoc, collection, getDocs, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import PoemTitleComp from "./Poem-title";

export default function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [poemsList, setPoemsList] = useState([]);
    useEffect(() => {
        // Check whether is it an authenticated user or just a reader
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })

        onSnapshot(collection(db, "poems"), (snapshot) => {
            const poemsData = snapshot.docs.map((doc) => ({
                poem: doc.data().poem,
                poemId: doc.id,
                poemTitle: doc.data().title,
            }));
            setPoemsList(poemsData);
        });


    }, [])

    async function handleLogOut() {
        try {
            await signOut(auth);
            navigate('/')
        }
        catch (error) {
            alert("Error signing out", error);
        }
    }


    async function handleDelete(poemId) {
        try {
            await deleteDoc(doc(db, "poems", poemId));
            alert("Deleted successfully");
        } catch (error) {
            alert("Error deleting document: " + error.message);
        }
    }

    return (
        <div>
            {
                user ? (
                    <h1 className="greet-heading">Hiii Goswami 😉</h1>
                ) :
                    (
                        <h1 className="greet-heading">Hey There!!!</h1>
                    )
            }

            <button onClick={handleLogOut}>
                Log out
            </button>

            <div className="poems-list">
                {
                    poemsList.length > 0 ? (
                        <ul>
                            {
                                poemsList.map((obj, i) => (
                                    <PoemTitleComp poemInfo={obj} key={i} onDelete={handleDelete} />
                                ))
                            }
                        </ul>
                    ) : user ? (
                        <h3 className="no-poems-msg">Oops!! Looks like you haven't uploaded any poem yet. Write one now?</h3>
                    ) : (
                        <h3 className="no-poems-msg">:{"("} No Poems have been uploaded yet</h3>
                    )
                }

            </div>

            {
                user ? (
                    <div className="add-poem">
                        <Link to={`/dashboard/writenew`}>
                            <button>
                                Got another poem in mind? 🧠
                            </button>
                        </Link>

                    </div>
                ) : null
            }
        </div>
    )
}