// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, doc, orderBy, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
const messageForm = document.querySelector(".message-submission")
messageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    //adds message to the doc
    // addDoc(colRef, {
    //     content: messageForm.message.value,
    //     user: messageForm.user.value,
    //     userEmail: messageForm.email.value,
    //     messageCreated: serverTimestamp()
    // })
    //     .then(() => {

    //     })
})


//create User

createUserWithEmailAndPassword(auth, email, password)
    .then((userCred) => {

    })


// let messages = []
let messageQ = query(colRef, orderBy("messageCreated"))
onSnapshot(messageQ, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
            let message = { ...change.doc.data(), id: change.doc.id }
            var container = document.getElementById('messagesArrayContainer');
            var div = document.createElement('div');
            div.textContent = `${message.user}: ${message.content}`;
            container.appendChild(div);
            window.scrollTo(0, document.body.scrollHeight);  // Scroll to bottom

        }
    })
})



// function showLoginForm() {
//     showForm('loginForm');
// }

// function showSignupForm() {
//     showForm('signupForm');
// }

// function showForm(formId) {
//     document.querySelector('.form-container').style.display = 'block';
//     document.getElementById('loginForm').style.display = 'none';
//     document.getElementById('signupForm').style.display = 'none';
//     document.getElementById(formId).style.display = 'block';
// }

// function hideForms() {
//     document.querySelector('.form-container').style.display = 'none';
// }


// document.addEventListener('click', function (event) {
//     var isClickInsideForm = document.querySelector('.form-container').contains(event.target);
//     var isClickOnButton = document.querySelector('nav').contains(event.target);

//     if (!isClickInsideForm && !isClickOnButton) {
//         hideForms();
//     }
// });
