import { addDoc, collection } from "firebase/firestore";
import { useState } from "react"
import { db } from "../lib/fbConfigs";
import { useNavigate } from "react-router-dom";

export default function WriteNew() {

    const navigate = useNavigate();

    const [poemTitle, setPoemTitle] = useState("");
    const [poemContent, setPoemContent] = useState("");

    async function handleSave() {
        
        if (poemTitle.length > 0 && poemContent.length > 0) {

            try {
                await addDoc(collection(db, "poems"), {
                    poem: poemContent,
                    title: poemTitle
                })

                navigate('/dashboard');

            } catch (error) {
                alert("Something went wrong,", error);
            }
        } else {
            alert("Sorry :( You cannot leave it blank");
        }
    }

    return (
        <div className="write-new-container">
            <input type="text" value={poemTitle} placeholder="Enter Poem Title" className="new-poem-title" onChange={(e) => setPoemTitle(e.target.value)}></input>
            <textarea className="new-poem-content" value={poemContent} onChange={(e) => setPoemContent(e.target.value)} placeholder="Let your imagination out (❁´◡`❁)">

            </textarea>
            <button className="save-btn" onClick={handleSave}>SAVE✅</button>
        </div>
    )
}