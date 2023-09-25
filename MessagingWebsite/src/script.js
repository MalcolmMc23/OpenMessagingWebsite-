let userName;
let email;
let password;
let user;
let tempEmail
let tempPassword
let tempUserName;
// Import the functions you need from the SDKs you need
import { initializeApp, onLog } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, doc, orderBy, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDoLr3OtSfTj4t66L4KHk-FWwoZCM-eBNM",
    authDomain: "messagingwebsite.firebaseapp.com",
    databaseURL: "https://messagingwebsite-default-rtdb.firebaseio.com",
    projectId: "messagingwebsite",
    storageBucket: "messagingwebsite.appspot.com",
    messagingSenderId: "262282250861",
    appId: "1:262282250861:web:8a84be186a343b3b9a0d64",
    measurementId: "G-KDT0R0VSSQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

const db = getFirestore()

const colRef = collection(db, "Messages")

const logoutButton = document.getElementById('logoutBtn');
const messageSubmission = document.querySelector(".message-submission")


//**************************show login/sign up forms */
const showForm_container = document.querySelector('.form-container')

const showSignUpFormBtn = document.getElementById('showSignupBtn');
const signUpForm = document.querySelector('.SignUpForm');

const showLoginFormBtn = document.getElementById('showLoginBtn');
const loginForm = document.querySelector('.LoginForm');

showSignUpFormBtn.addEventListener('click', () => {
    // Hide the login form if it's not already hidden

    if (!loginForm.classList.contains('hidden')) {
        loginForm.classList.add('hidden');
    }

    // Toggle the sign-up form
    signUpForm.classList.toggle('hidden');
    revealContainerForm()
});

showLoginFormBtn.addEventListener('click', () => {
    // Hide the sign-up form if it's not already hidden
    if (!signUpForm.classList.contains('hidden')) {
        signUpForm.classList.add('hidden');
    }

    // Toggle the login form
    loginForm.classList.toggle('hidden');
    revealContainerForm()
});



function revealContainerForm() {
    // Check if either the signUpForm or loginForm are not hidden
    if (
        !signUpForm.classList.contains('hidden') ||
        !loginForm.classList.contains('hidden')
    ) {
        // If either forms are not hidden, make sure the container is visible
        showForm_container.classList.remove('hidden');
    }

    // Check if both the signUpForm and loginForm are hidden
    if (
        signUpForm.classList.contains('hidden') &&
        loginForm.classList.contains('hidden')
    ) {
        // If both forms are hidden, hide the container as well
        showForm_container.classList.add('hidden');
    }

}
//*************************** */



document.addEventListener('DOMContentLoaded', function () {

    // const messageForm = document.querySelector(".message-submission")
    // messageForm.addEventListener("submit", (e) => {
    //     e.preventDefault()
    //     //adds message to the doc
    //     addDoc(colRef, {
    //         content: messageForm.message.value,
    //         userName: messageForm.user.value,
    //         userEmail: messageForm.email.value,
    //         messageCreated: serverTimestamp()
    //     })
    //         .then(() => {

    //         })
    // })

    //create User
    // const signupForm = document.querySelector(".SignupForm");
    signUpForm.addEventListener("submit", (e) => {
        e.preventDefault()
        tempUserName = signUpForm.signupUsername.value
        tempEmail = signUpForm.signupEmail.value
        tempPassword = signUpForm.signupPassword.value

        createUserWithEmailAndPassword(auth, tempEmail, tempPassword)
            .then((userCred) => {
                user = userCred.user
                console.log("user created", userCred.user)
                return updateProfile(auth.currentUser, {
                    displayName: tempUserName,
                })
                    .then(() => {
                        setUserInfo(userCred)
                    })
                    .catch((error) => {
                        console.log(error.message)
                    })

            })
            .catch((error) => {
                console.log(error.message)
            })

    });


    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        tempUserName = loginForm.loginUsername.value
        tempEmail = loginForm.loginEmail.value
        tempPassword = loginForm.loginPassword.value

        signInWithEmailAndPassword(auth, tempEmail, tempPassword)
            .then((userCred) => {
                user = userCred.user
                console.log(`logged in as: ${user}`)
                setUserInfo(userCred)
            })
            .catch((error) => {
                console.log(error.message)
            })
    })
})

// let messages = []
let messageQ = query(colRef, orderBy("messageCreated"))
onSnapshot(messageQ, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
            let message = { ...change.doc.data(), id: change.doc.id }
            var container = document.getElementById('messagesArrayContainer');
            var div = document.createElement('div');
            div.textContent = `${message.userName}: ${message.content}`;
            container.appendChild(div);
            window.scrollTo(0, document.body.scrollHeight);  // Scroll to bottom

        }
    })
})



onAuthStateChanged(auth, (user) => {
    if (user) {
        // *User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setUserInfo(user)
        console.log(`logged in as: `, user)
        //hides all the unnecessary buttons/forms
        showSignUpFormBtn.classList.add('hidden');
        showLoginFormBtn.classList.add('hidden');
        signUpForm.classList.add('hidden');
        loginForm.classList.add('hidden');
        showForm_container.classList.add('hidden');
        //reveals the logout button
        logoutButton.classList.remove('hidden');
        //reveals the message form
        messageSubmission.classList.remove('hidden');

        // message submission listener
        const submitMessageBtn = document.getElementById('submitMessageBtn')
        const message = document.getElementById('message')
        submitMessageBtn.addEventListener('click', () => {
            addDoc(colRef, { // adds the message to the message document
                content: message.value,
                userName: user.displayName,
                userEmail: user.email,
                messageCreated: serverTimestamp()
            })
                .then(() => {
                })
            message.reset()
            console.log("reset textarea")

        })



        // ...
    } else {
        // *User is signed out
        //reveals the login/signup buttons
        showSignUpFormBtn.classList.remove('hidden');
        showLoginFormBtn.classList.remove('hidden');
        //hides the logout buttons
        logoutButton.classList.add('hidden');
        //hides the message submission form
        messageSubmission.classList.add('hidden');

    }
});

logoutButton.addEventListener('click', () => {

    signOut(auth)
        .then(() => {
            console.log("User logged out")
            loginForm.reset()
        })
        .catch((err) => {
            console.log(err.message)
        })
})


function setUserInfo(userCred) {
    email = userCred.email;
    userName = userCred.isplayName;
}