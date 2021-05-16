if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDZLaJUJtKFvJ7T73GpiSfJk3FDTS0CiGk",
    authDomain: "webb4-7e924.firebaseapp.com",
    projectId: "webb4-7e924",
  });
}

var db = firebase.firestore();

let userList = document.getElementById("user-list");
let feed = document.getElementById("feed");

let dmOpen = false;
let dmHover = false;

db.collection("users")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (
        (doc.data().profilePicture = "none") &&
        doc.data().name != localStorage.getItem("loggedIn")
      )
        userList.innerHTML +=
          '<div class="user-preview" onClick="OpenDM(\'' +
          doc.data().name +
          '\')"><img src="img/default-picture.png" /><h3>' +
          doc.data().name +
          "</h3></div>";
    });
  });

// Load posts

db.collection("posts")
  .orderBy("time", "desc")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      feed.innerHTML +=
        '<div class="post-normal"><div><img src="img/default-picture.png" /> <p>' +
        doc.data().user +
        "</div><p>" +
        doc.data().text +
        "</p></div>";
    });
  });

function CreatePost() {
  let text = document.getElementById("post-text").value;
  let user = localStorage.getItem("loggedIn");

  document.getElementById("post-text").value = "";

  db.collection("posts")
    .add({
      text: text,
      user: user,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

  // Update feed

  feed.innerHTML = "";

  db.collection("posts")
    .orderBy("time", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        feed.innerHTML +=
          '<div class="post-normal"><div><img src="img/default-picture.png" /> <p>' +
          doc.data().user +
          "</div><p>" +
          doc.data().text +
          "</p></div>";
      });
    });
}
// För att hitta vem man klickar på DM
// Ganska inte effektivt borde fixa

function OpenDM(target) {
  localStorage.setItem("dmTarget", target);

  let dm = document.getElementById("dm");
  let h2 = document.getElementById("dm-h2");

  dmOpen = true;

  let name = localStorage.getItem("dmTarget");
  let dmExists = false;

  document.getElementById("home-page").classList.add("stop-scrolling");
  document.getElementById("home-page").classList.add("blur");

  db.collection("dms")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (!(localStorage.getItem("loggedIn") == name)) {
          if (
            doc.data().user1 == localStorage.getItem("loggedIn") ||
            doc.data().user2 == localStorage.getItem("loggedIn")
          ) {
            if (
              doc.data().user1 == localStorage.getItem("dmTarget") ||
              doc.data().user2 == localStorage.getItem("dmTarget")
            ) {
              dmExists = true;
            }
          }
        } else {
          dmExists = true;
        }
      });
      if (!dmExists) {
        db.collection("dms")
          .add({
            user1: localStorage.getItem("loggedIn"),
            user2: name,
            msg: {},
          })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      }
    });

  dm.style.display = "flex";

  let foundDm = false;

  db.collection("dms")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!foundDm) {
          if (
            doc.data().user1 == localStorage.getItem("loggedIn") ||
            doc.data().user2 == localStorage.getItem("loggedIn")
          ) {
            if (
              doc.data().user1 == localStorage.getItem("dmTarget") ||
              doc.data().user2 == localStorage.getItem("dmTarget")
            ) {
              foundDm = true;
              let msgHistory = doc.data().msg;

              if (msgHistory[0] != undefined) {
                for (let i = 0; i < msgHistory.length; i++) {
                  if (msgHistory[i].user == localStorage.getItem("loggedIn")) {
                    document.getElementById("chat").innerHTML +=
                      "<p class='msg-me'>" + msgHistory[i].content + "</p>";
                  } else {
                    document.getElementById("chat").innerHTML +=
                      "<p class='msg-other'>" + msgHistory[i].content + "</p>";
                  }
                }
              }
            }
          }
        }
      });
    });
  h2.innerHTML = localStorage.getItem("dmTarget");
}

function SendMsg() {
  // User msg
  let input = document.getElementById("user-msg").value;

  if (input.trim() != "") {
    db.collection("dms")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (
            doc.data().user1 == localStorage.getItem("loggedIn") ||
            doc.data().user2 == localStorage.getItem("loggedIn")
          ) {
            if (
              doc.data().user1 == localStorage.getItem("dmTarget") ||
              doc.data().user2 == localStorage.getItem("dmTarget")
            ) {
              let msgHistory = doc.data().msg;

              // If no msg history
              if (msgHistory[0] == undefined) {
                return db
                  .collection("dms")
                  .doc(doc.id)
                  .update({
                    msg: [
                      {
                        user: localStorage.getItem("loggedIn"),
                        content: input,
                      },
                    ],
                  })
                  .then(() => {
                    console.log("Document successfully updated!");
                  })
                  .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                  });
              } else {
                let msgHistory = doc.data().msg;
                msgHistory.push({
                  user: localStorage.getItem("loggedIn"),
                  content: input,
                });

                return db
                  .collection("dms")
                  .doc(doc.id)
                  .update({
                    msg: msgHistory,
                  })
                  .then(() => {
                    console.log("Document successfully updated!");
                  })
                  .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                  });
              }
            }
          }
        });
      });
  }
}

db.collection("dms").onSnapshot((doc) => {
  let foundDm = false;

  document.getElementById("chat").innerHTML = "";

  db.collection("dms")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!foundDm) {
          if (
            doc.data().user1 == localStorage.getItem("loggedIn") ||
            doc.data().user2 == localStorage.getItem("loggedIn")
          ) {
            if (
              doc.data().user1 == localStorage.getItem("dmTarget") ||
              doc.data().user2 == localStorage.getItem("dmTarget")
            ) {
              foundDm = true;
              let msgHistory = doc.data().msg;

              if (msgHistory[0] != undefined) {
                for (let i = 0; i < msgHistory.length; i++) {
                  if (msgHistory[i].user == localStorage.getItem("loggedIn")) {
                    document.getElementById("chat").innerHTML +=
                      "<p class='msg-me'>" + msgHistory[i].content + "</p>";
                  } else {
                    document.getElementById("chat").innerHTML +=
                      "<p class='msg-other'>" + msgHistory[i].content + "</p>";
                  }
                }
              }
            }
          }
        }
      });
    });
});

function Close() {
  // Close dm
  this.document.getElementById("dm").style.display = "none";
  let div = this.document.getElementById("home-page");
  div.classList.remove("blur");
  div.classList.remove("stop-scrolling");

  dmOpen = false;
}
