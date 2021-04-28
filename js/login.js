if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDZLaJUJtKFvJ7T73GpiSfJk3FDTS0CiGk",
    authDomain: "webb4-7e924.firebaseapp.com",
    projectId: "webb4-7e924",
  });
}

var db = firebase.firestore();

document.getElementById("login").style.display = "none";
document.getElementById("create-account").style.display = "block";

function SubmitUser() {
  let username = document.getElementById("create-username").value;
  let email = document.getElementById("create-email").value;
  let password = document.getElementById("create-password").value;

  if (
    username != "" &&
    email != "" &&
    password == document.getElementById("confirm-password").value &&
    password != ""
  ) {
    db.collection("users")
      .doc(username)
      .set({
        name: username,
        email: email,
        password: password,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

    document.getElementById("create-account").style.display = "none";
    document.getElementById("login").style.display = "block";
  } else {
    alert(
      "Please fill in all information and make sure that the passwords match"
    );
  }
}

function SwitchLogin() {
  if (document.getElementById("create-account").style.display == "block") {
    document.getElementById("create-account").style.display = "none";
    document.getElementById("login").style.display = "block";
  } else {
    document.getElementById("create-account").style.display = "block";
    document.getElementById("login").style.display = "none";
  }
}

function SubmitLogin() {
  // Values from user
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  var docRef = db.collection("users").doc(username);

  // Get user with same username fromd databse
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().password == password) {
          // Login
        }
      } else {
        // doc.data() will be undefined in this case
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
