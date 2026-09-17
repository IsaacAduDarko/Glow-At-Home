// Firebase App
import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


// Firebase Realtime Database
import { getDatabase } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// Firebase Authentication
import { getAuth } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



// Firebase configuration

const firebaseConfig = {

apiKey: "AIzaSyCfTS_QYRuX4kQAy-NX7tf-3Q0vAdwQoL0",
    authDomain: "glow-at-home-d393f.firebaseapp.com",
    databaseURL: "https://glow-at-home-d393f-default-rtdb.firebaseio.com",
    projectId: "glow-at-home-d393f",
    storageBucket: "glow-at-home-d393f.firebasestorage.app",
    messagingSenderId: "251668300030",
    appId: "1:251668300030:web:571c7e7a76c33f1dc1a5af",
    measurementId: "G-00Z5CNCK7M"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);



// Realtime Database

export const db = getDatabase(app);


// Authentication

export const auth = getAuth(app);