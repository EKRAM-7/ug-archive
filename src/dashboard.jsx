import { onAuthStateChanged, signOut } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, db } from "../lib/fbConfigs"
import { Link, useNavigate } from "react-router-dom"
import { addDoc, collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function Dashboard() {
    const navigate = useNavigate();
    let [text, setText] = useState("");
    const [user, setUser] = useState(null);
    const [poemsList, setPoemsList] = useState([]);
    useEffect(() => {
        // Check whether is it an authenticated user or just a reader
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })


        let poemObj = []; // This array will hold all the poem details in an object
        async function getPoems() {

            const querySnapshot = await getDocs(collection(db, "poems"));
            querySnapshot.docs.map(doc => {
                let poemInfo = {
                    poem: doc.data().poem,
                    poemId: doc.id,
                    poemTitle: doc.data().title
                }
                poemObj.push(poemInfo);
            })

            setPoemsList(poemObj);
        }


        getPoems();

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

    // NEED TO BE FIXED LATER 
    // =========== IMPORTANT =============== 
    /*
        *
        *
        *
    */
    async function handleDelete(poemId) {
        try {
            await deleteDoc(doc(db, "poems", poemId));
            const querySnapshot = await getDocs(collection(db, "poems"));
            querySnapshot.docs.map(doc => {
                let poemInfo = {
                    poem: doc.data().poem,
                    poemId: doc.id,
                    poemTitle: doc.data().title
                }
                poemObj.push(poemInfo);
            })

            setPoemsList(poemObj);
            alert("Deleted succesfully")
        } catch (error) {
            alert("Error deleting document: ", error);
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

                                    <Link key={i} to={`/dashboard/${obj.poemId}`}>
                                        <li className="poem-title">
                                            {obj.poemTitle}
                                        </li>
                                        {/* {
                                            user ? (
                                                <button onClick={() => handleDelete(obj.poemId)}>🗑️</button>
                                            ) : null
                                        } */}
                                    </Link>

                                ))
                            }
                        </ul>
                    ) : user ? (
                        <h3>Oops!! Looks like you haven't uploaded any poem yet. Write one now?</h3>
                    ) : (
                        <h3>:{"("} No Poems have been uploaded yet</h3>
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