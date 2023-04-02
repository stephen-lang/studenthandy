//client side
let result, finalmain, indexcheck;

var mynamedb, data;

//event listener is added to signup form to check if details are ok
//checks for existing username
// checks for existing Email
let theme = []



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


  document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const login = event.target.email.value;
    const password = event.target.password.value;

    if (login === "login@login" && password==="password"){
        window.location.assign("/create");

    }else {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
      firebase
        .auth()
        .signInWithEmailAndPassword(login, password)
        .then(({
          user
        }) => {
          var userr = firebase.auth().currentUser.uid;
          /*  firebase.database().ref("users/userinfo/"+ userr).orderByChild("username").once('value',   function(snapshot) {
                       = snapshot.val().username.toString();
                      theme.push(mynamedb);
                 });*/
          console.log(firebase.auth().currentUser);
          mynamedb = firebase.auth().currentUser.displayName;

          return user.getIdToken().then((idToken) => {
            // link for cooki/ session management == https://firebase.google.com/docs/auth/admin/manage-cookies
            // first we need to get a token for the user to use and be able to do a Post and Get request

            //HTTP POST
            // this side is the validation of the XSRF-TOKEN generated from the backend to make sure its the user that sent it
            const params = {
              idToken: idToken,
              mynamedb: mynamedb
            }
            console.log(theme[0]);
            return fetch("/sessionLogin", {
              method: "POST",
              credentials: 'same-origin',
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                //STEP 2 CHECK IF THE CSRF IS SAME TO ASSIGNED
                // below is the CSRF token FROM cookies to check if
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
              },

              // the idtoken is for the session
              body: JSON.stringify({
                idToken: idToken,
                mynamedb: mynamedb
              }),
            });


          });


        })
        .then(() => {
          return firebase.auth().signOut();
        })
        .then(() => {
          window.location.assign("/todolist");
        }).catch((error) => {
          var node = document.querySelector("#denied");
          document.querySelector(".ready").appendChild(node);
          document.querySelector(".definition").innerHTML = error.message;

          document.querySelector("#denied").style.visibility = "visible";
          console.log(error.message);
        });
    }).catch((error) => {
      // Handle Errors here.
      console.log(error.code + "   " + error.message);
    });
}
  });


  /*   const logout = document.getElementById("logout-btn");
           logout.addEventListener("click", (e) => {

            window.location.assign("/sessionLogout");

           });

*/

  document.getElementById("signup_form").addEventListener("submit", (e) => {
    var signupform = document.getElementById("signup_form")
    e.preventDefault();
    const username = signupform['username'].value
    const index_number = signupform['index_number'].value
    const signup_email = signupform['signup_email'].value
    const signup_password = signupform['signup_password'].value

    var pass = {
      index_number: index_number,
      signup_email: signup_email,
      signup_password: signup_password,
      username: username,
    }

    //snapshot to check existing username
    firebase.database().ref("users/userinfo/").orderByChild("username").equalTo(username).once('value', function(snapshot) {

      if (snapshot.val() < 1) {
        // checkink of index number is found in the students database
        // NOTE: user name and index number should be added to database before user can signup

        firebase.database().ref("users/students").orderByChild("index_number").equalTo(index_number).once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            indexcheck = childSnapshot.val().index_number;
          });
          if (indexcheck == index_number) {
            firebase.auth().createUserWithEmailAndPassword(signup_email, signup_password).then(cred => {
              var user = cred.user;

              cred.user.updateProfile({
                displayName: username
              }).then(() => {

                firebase.database().ref('/users/userinfo/' + user.uid).set(pass).then(function() {
                  console.log(username);
                  console.log('user saved');
                  window.location.replace("/")

                });
              })



            }).catch(function(error) {
              var node = document.querySelector("#denied");
              document.querySelector(".signup_ready").appendChild(node);
              document.querySelector(".definition").innerHTML = error
              document.querySelector("#denied").style.visibility = "visible";
              console.log("creating email.error---" + error)
            }); //-- create email end

          } else {
            var node = document.querySelector("#denied");
            document.querySelector(".signup_ready").appendChild(node);
            document.querySelector(".definition").innerHTML = "Error: Sorry your index number cannot be found in the database"
            document.querySelector("#denied").style.visibility = "visible";
          }

        });

      } else {


        var node = document.querySelector("#denied");
        document.querySelector(".signup_ready").appendChild(node);
        document.querySelector(".definition").innerHTML = "Error: Sorry username is already in Use"
        document.querySelector("#denied").style.visibility = "visible";


      } //-- else end


    })

  }); //-- SIGNUP END


}); //-- DOM END
