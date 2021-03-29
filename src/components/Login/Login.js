import React, { useContext, useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App'
import { useHistory, useLocation } from 'react-router';
import { Input,  Button, makeStyles } from '@material-ui/core';

const Login = () => {

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }));
    const classes = useStyles();

    const [newUser, setNewUser] = useState(false)

    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
    })


    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    const history = useHistory();
    const location = useLocation()

    const { from } = location.state || { from: { pathname: "/" } };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized, use that one
    }
    // Initialize Firebase


    const handleGoogleSignIn = () => {
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        firebase.auth()
            .signInWithPopup(googleProvider)
            .then((result) => {
                const { displayName, email } = result.user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    email: email
                }
                setUser(signedInUser)
                setLoggedInUser(signedInUser);
                history.replace(from);
                // ...
            }).catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
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
                setUser(signOutUser)
                // Sign-out successful.
            }).catch((error) => {
                console.log(error)
            })

    }

    const handleSubmit = (event) => {
        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(result => {
                    const newUserInfo = { ...user }
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    updateUserName(user.name);
                })
                .catch((error) => {
                    const newUserInfo = { ...user }
                    newUserInfo.error = error.message
                    newUserInfo.success = false
                    setUser(newUserInfo)
                    // ..
                });

        }

        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then((result) => {
                    const newUserInfo = { ...user }
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    setLoggedInUser(newUserInfo);
                    history.replace(from);
                    console.log('sign in user info', result)
                })
                .catch((error) => {
                    const newUserInfo = { ...user }
                    newUserInfo.error = error.message
                    newUserInfo.success = false
                    setUser(newUserInfo)
                });
        }
        event.preventDefault()
    }
    //function finished


    const updateUserName = name => {
        const user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name,
        }).then(() => {
            console.log('Username updated successfully', name)
        }).catch((error) => {
            console.log(error)
        });
    }


    const handleChange =  (event)=> {
        let fieldValid = true;
        if(event.target.name === 'email'){
          fieldValid = /\S+@\S+\.\S+/.test(event.target.value);
        }
        if(event.target.name === 'password'){
          const isPasswordValid =  event.target.value.length > 6
          const passwordHasNumber = /\d{1}/.test(event.target.value);
          fieldValid = passwordHasNumber && isPasswordValid
        }
        if(fieldValid){
          const newUserInfo = {...user};
          newUserInfo[event.target.name] = event.target.value;
          setUser(newUserInfo);
        }
      }


    return (
        <div className="App">
            <h1>This is Login</h1>
            <p>Name: {loggedInUser.name}</p>

            {  
      user.isSignedIn ?
      <button style={{backgroundColor:'red',color:'white'}} onClick={handleSignOut}>Sign out</button>
      :
      <button style={{
        border:'none',
        cursor:'pointer',
        padding:'20px',
        margin:'40px 0px',
        boxShadow:'2px 5px 5px lightgray',
        borderRadius: '10px',
        backgroundColor:'orange' ,color:'black'}} onClick={handleGoogleSignIn}>Sign in with Google</button>
    }
    <br/>


            <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
            <label htmlFor="newUser">New User Sign Up</label>
            <br/>
            <form onSubmit={handleSubmit}>
                {newUser && <Input type="text" onChange={handleChange} name="name" placeholder="Your Name" required />}
                <br />
                <br />
                <Input type="text" onChange={handleChange} placeholder="Your Email Address" name="email" required />
                <br />
                <br />
                <Input type="password" onChange={handleChange} name="password" id="" placeholder="Your Password" required />
                <br />
                <br />
                <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
                {/* <Button type="submit" variant="contained" color="primary">{newUser ? 'Sign Up' : 'Sign In'}</Button> */}
            </form>

            <br />
            {
                user.success ? <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged in'} Successfully</p> : <p style={{ color: 'red' }}>{user.error}</p>
            }
            <br />
            <button onClick={handleGoogleSignIn}>google sign in</button>
        </div>
    );
};

export default Login;