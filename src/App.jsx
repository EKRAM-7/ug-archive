import { useState, useRef, useEffect } from "react"
import { auth } from '../lib/fbConfigs'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Dashboard from "./dashboard";
import ViewPoem from "./View-Poem";
import WriteNew from "./Write-new";


export default function App() {

	let [email, setEmail] = useState("");
	let [password, setPassword] = useState("")
	const [showInputs, setShowInputs] = useState(false);
	let [user, setUser] = useState(null);
	useEffect(() => {
		onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		})
	})

	async function login(email, password) {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			console.log("Logged in:", userCredential.user.email);
		}
		catch (error) {
			switch (error.code) {
				case "auth/invalid-email":
					alert("Invalid email format");
					break;
				case "auth/user-not-found":
					alert("No account found with this email");
					break;
				case "auth/wrong-password":
					alert("Incorrect password");
					break;
				default:
					alert("Something went wrong: " + error.message);
			}
		}
	}

	const router = createBrowserRouter([
		{
			path: '/',
			element:
				user ? (
					<Dashboard />
				) : (
					<div className="container">
						<h1 className="heading">U. Goswami's Archive</h1>
						<p className="question">Are you THE Goswami? 🧐</p>
						<button
							className="toggle-btn"
							onClick={() => setShowInputs(!showInputs)}
						>
							{showInputs ? "YES 🔼" : "YES 🔽"}
						</button>

						<div className={`dropdown ${showInputs ? "open" : ""}`}>
							<input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
							<input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter password :)" /> <br />
							<button className="login-btn" onClick={() => login(email, password)}>
								LOGIN
							</button>
						</div>
						<button className="no-btn">
							<Link to="/dashboard">No</Link>
						</button>
					</div>
				)
		},

		{
			path: '/dashboard',
			element:
				<Dashboard />
		},

		{
			path: '/dashboard/:poemId',
			element:
				<ViewPoem />
		},

		{
			path: '/dashboard/writenew',
			element: 
				<WriteNew />
		}
	])

	return (
		<RouterProvider router={router} />
	)
}