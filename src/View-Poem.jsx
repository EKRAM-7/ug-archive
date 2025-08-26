import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { db, auth } from "../lib/fbConfigs";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";


export default function ViewPoem() {
    const id = useParams();
    const navigate = useNavigate();
    const [poemContent, setPoemContent] = useState("");
    const [poemTitle, setPoemTitle] = useState("");
    const [user, setUser] = useState(null);
    useEffect(() => {

        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })

        async function getPoem() {
            const querySnapshot = await getDocs(collection(db, "poems"));
            querySnapshot.docs.map(doc => {
                setPoemContent(doc.data().poem);
                setPoemTitle(doc.data().title)
            })
        }

        getPoem();

    }, [])


    async function handleSaveChanges() {

        if (poemContent.length > 0 && poemTitle.length > 0) {
            let docRef = doc(db, "poems", id.poemId);
            await updateDoc(docRef, {
                poem: poemContent,
                title: poemTitle
            })

            navigate('/')

        } else {
            alert("Sorry :( You cannot leave it blank");
        }


    }

    return (
        <div className="view-poem-box">
            {
                user ? (
                    <input value={poemTitle} onChange={(e) => setPoemTitle(e.target.value)} className="poem-heading-input" placeholder="What's the title? 😆">
                    </input>
                ) : null
            }

            {
                user ? (
                    <div>
                        <textarea onChange={(e) => setPoemContent(e.target.value)} value={poemContent} className="poem" placeholder="What's on your mind?">

                        </textarea>
                        <button className="save-btn" onClick={handleSaveChanges}>SAVE ✅</button>
                    </div>


                ) :

                    (
                        <div className="poem-box">
                            <h1 className="poem-heading">
                                {poemTitle}
                            </h1>
                            <pre>
                                {poemContent}
                            </pre>
                        </div>
                    )
            }

        </div>
    )
}