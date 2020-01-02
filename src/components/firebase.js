import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'

// const firebaseConfig = {
//     apiKey: "AIzaSyDiAYUx42Ns97Hpl8zoxZ6_HNuHquVLOSE",
//     authDomain: "unexpected-fyp.firebaseapp.com",
//     databaseURL: "https://unexpected-fyp.firebaseio.com",
//     projectId: "unexpected-fyp",
//     storageBucket: "unexpected-fyp.appspot.com",
//     messagingSenderId: "901726295810",
//     appId: "1:901726295810:web:2a7d13c77bf56ff227d41b",
//     measurementId: "G-4YK051Z3Y5"
// };

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default firebase;
export {
    db
}