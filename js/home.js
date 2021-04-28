if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDZLaJUJtKFvJ7T73GpiSfJk3FDTS0CiGk",
    authDomain: "webb4-7e924.firebaseapp.com",
    projectId: "webb4-7e924",
  });
}

var db = firebase.firestore();

let userList = document.getElementById("user-list");

db.collection("users")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if ((doc.data().profilePicture = "none"))
        userList.innerHTML +=
          '<div class="user-preview"><img src="img/default-picture.png" /><h3>' +
          doc.data().name +
          "</h3></div>";
    });
  });
