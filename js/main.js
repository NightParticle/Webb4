// Initialize Cloud Firestore through Firebase
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDZLaJUJtKFvJ7T73GpiSfJk3FDTS0CiGk",
    authDomain: "webb4-7e924.firebaseapp.com",
    projectId: "webb4-7e924",
  });
}

var db = firebase.firestore();

/*
Skriv data exempel
db.collection("users")
  .add({
    first: "Ada",
    last: "Lovelace",
    born: 1815,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
*/
