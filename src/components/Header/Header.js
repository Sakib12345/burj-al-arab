import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import header from '../../images/header.png';
import logo from '../../images/icons/logo.png';
import { UserContext } from '../../App'
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../Login/firebase.config';

const Header = () => {

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    console.log(loggedInUser);
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized, use that one
    }

    const handleSignOut = () => {
        firebase.auth().signOut()
            .then((res) => {
                const signOutUser = {
                    userSignedIn: false,
                    name: '',
                    photoURL: '',
                    email: '',
                    error: '',
                    success: false
                }
                setLoggedInUser(signOutUser)
                // Sign-out successful.
            }).catch((error) => {
                console.log(error)
            })

    }

    return (
        <div style={{ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${header})` }} className="header">
            <nav className="nav">
                <ul>
                    <li>
                        <img className="logo" src={logo} alt=""/>
                    </li>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link className="btn-book" to="/book">Book</Link>
                    </li>
                    {
                        loggedInUser.email === '' ?
                        <button >google sign in</button> :
                        <button style={{backgroundColor:'red',color:'white'}} onClick={handleSignOut}>Sign out</button>  

                    }
                </ul>
            </nav>
            <div className="title-container">
                <h1>Burj Al Arab</h1>
                <h2>A global icon of Arabian luxury</h2>
            </div>
        </div>
    );
};

export default Header;