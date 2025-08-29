import { Link } from "react-router-dom";
export default function PoemTitleComp({ poemInfo, onDelete }) {

    return (

        <div className="poem-title-div">
            <Link to={`/dashboard/${poemInfo.poemId}`}>
                <li className="poem-title">
                    {poemInfo.poemTitle}
                </li>
            </Link>
            <button onClick={() => onDelete(poemInfo.poemId)}>❌</button>

        </div>
    )
}