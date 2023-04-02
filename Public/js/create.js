window.addEventListener("DOMContentLoaded", () => {
  var firebaseConfig = {
    apiKey: "AIzaSyDvrvrd9kuO5Tzx094nH8psLL4R0tHv6xY",
    authDomain: "student-handy.firebaseapp.com",
    databaseURL: "https://student-handy-default-rtdb.firebaseio.com",
    projectId: "student-handy",
    storageBucket: "student-handy.appspot.com",
    messagingSenderId: "711648441059",
    appId: "1:711648441059:web:0a0420ef308d8c01948bd6",
    measurementId: "G-5892B2K7QZ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

document.querySelector("#submitBtn").addEventListener("click", function() {
  let postAuthor = document.querySelector("#author").value;
  let postTitle = document.querySelector("#postTitle").value;
  let postContent = document.querySelector("#postContent").value;
  let postDate = document.querySelector("#postDate").value;

  if (
    postAuthor === "" ||
    postTitle === "" ||
    postContent === "" ||
    postDate === ""
  ) {
    alert("Fields Empty");
  } else {
    var newsevent = {
      createdAt:postDate,
      postauthor:postAuthor,
      postcontent:postContent,
      postname:postTitle
    };
    var uniquekey = firebase.database().ref("users/").child("event").push().key;

  firebase.database().ref("users/event/"+uniquekey).set(newsevent);

        console.log(postAuthor,postTitle,uniquekey);
  }
});
}); //-- DOM END
