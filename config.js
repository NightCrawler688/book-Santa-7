import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyDNItFZkcIEpl2weAL7IoiaQ3CH6kgAlNg",
  authDomain: "booksanta-9fc1a.firebaseapp.com",
  projectId: "booksanta-9fc1a",
  storageBucket: "booksanta-9fc1a.appspot.com",
  messagingSenderId: "989777488813",
  appId: "1:989777488813:web:1e72af585b4cb37d9d0f24"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
