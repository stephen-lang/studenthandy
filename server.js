//jshint : esversion:6
//server side
let useruid, mynamedb, items = "";
let newitemsadd = ["eating", "schooling"]
const express = require('express')
const request = require('request')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
var serveStatic = require('serve-static')
var path = require('path')
const app = express();
const bodyparser = require('body-parser');
const axios = require('axios');
const firebase = require("firebase/app");
const auth = require("firebase/auth");
let details;
const database = require("firebase/database")
const admin = require("firebase-admin")

const csrfMiddleware = csrf({
  cookie: true
});
//import serviceAccount from "./serviceAccountkey.json";
//const serviceAccount=require(__dirname+"/serviceAccountkey.json")
//credential: admin.credential.applicationDefault(),

let defaultAppConfig = {
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "student-handy",
    "private_key_id": "bcaf4e8f6422a1dd9f3d06fd350859e63be9e862",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHJSQQB1c7x0NU\nxX7FV9NYfQBHhk4lPF/L47UF7iPGj74EhQ6JJRCp/kuLUvemSZcaeZfOPtVWWIdO\nZlSUIL6vnC3jRIltkm/EWrTJURRul9t5cnkyJZ9D4O6BsM7Eww/oxzCvrYeh6Qlr\nUl8syzIF0N4z9s3XaLitWgoyXbWKxubdl4wsD+Nww3QqX//RhzP/0phuDubqsLQP\nno4Q4VlULGcBP9duG/bTJnrF2iz1H2jlMwsYbP+chGKzCHTk0kAIAZyTMwvLcDnW\nKDsOMey4LScjz1DY1AIwBxAga5PmYyq5mrEq4jK5YyxZIk3RO7DfUjK8bfBYkXGS\n1TWIrsp3AgMBAAECggEAEs0eMyfeQ9XeNM9TK/fMtkVRlMRzSu9WQ/5C2u/OujJb\n8uVKUrGzJGQjvGBK4ozUEpB5lTk4FFIrWWrZKrBPZcOi+W/rtvKPpsQW3rgkQQSz\n7dVcPTBxcYvM42Wj6nkCtCwKHAE6wD3WFnx3toJAk21Swn6B6d0Ignqbt9btCtBC\n/3xJGY09c3stFyB4EXpe1V6ZapG1Gpg8RKOeAsO6lPxovajAaqWpO0IqWpmyxLVa\n6VkNW7/HB+v4hOEhx+ieLoLCIxGkNBEgLcHj56h/06Jap8YuWRKsTglMJZhIrDHt\n3Yw7UDU1TB9xcvr5ECh3auX+JeMFxmkrGB7WWJdIYQKBgQD4t28rsm7uowxuWjjc\nHp/n0x69dqjRhGb5qVrM4IJ4RnHXgdUMkRyT955dUI7+fUk5SeOsB3KUZWDyYcPS\nBj+sYvzD/fnNbE1C9QKBnAIRFOsddY2CiXrgkbGeyfx8v0x69lpas2gQrGDN/C7K\nsXQSt6fSXZuvryzGnZMJuthj+QKBgQDM+hTvHWBXqN2IaDzMSi3s4qMwrKEZAB6U\nb7PvtMDarg6B85dWErn95HdOKoNsGY1TqA4Uh+XPN5De6ytex02rikeLBqewftuD\nfWdNwI/QUrUaZA0W223DAZg94rRXQ46kwESwGBKbJC0VzTmggjdY8oJrkvzpBo7V\n4SAkRRhd7wKBgQCQJ7meqRgU5poQ5+gm5PUnp70ccUcd0NDiiZ8gOkxErAfVseGr\nG/xlYtL+IPAQXstvEf2MuvBVRIExWyrlc0u6fdElQ/JidxA868ddGfA0uFwhwf2Y\nGFkJCkjZ0Ravsyz/5AOwqGV7rH2bRjxUrQ+qvZnemvTemfio0bHkpNBA+QKBgCM6\n2F5Ark5it7C6ObjjBwGv8lxrT0T8wETC7ipE5uCvCc9MDra8gTsiCV9l7zClM6Ut\nPT5KHTWAV2X5BXtExhS1r5Y1jpzHMPNomljCv/UOQhJHH/jNvg/GNmRskpJtChdG\n9IdPm+MOVLFqlH0B5IFlLQVQPifO+L3J87xII+gBAoGAXXzZbUnk33VD41M3BRcB\nXJcFsF7wqo9fs/HwPFCzhiHdnzbtE73HhB1OBtCAObp8avcgtVP4oZG7WLKIYdr4\n8O4ThI2YStg7wXguTrrYGc/yt4swXQfeBDLKPHxzkaWNK/v2RUVunl0mPjSVCb6j\nKhZOfrSecIPzVbNOWIF4dAA=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-519ks@student-handy.iam.gserviceaccount.com",
    "client_id": "103873548977161165550",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-519ks%40student-handy.iam.gserviceaccount.com"
  }),
  databaseURL: "https://student-handy-default-rtdb.firebaseio.com"
}

defaultApp = admin.initializeApp(defaultAppConfig);
//firestore database
const db = admin.firestore();

//admin.initializeApp({
//credential: admin.credential.cert(serviceAccount),
//databaseURL: "https://student-handy-default-rtdb.firebaseio.com"
//});


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
// middlewares start ---
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(express.json({
  limit: '2mb'
}))
app.use(bodyparser.json());

// sets and checks csrf related cookies
app.use(cookieParser());
app.use(csrfMiddleware);
app.set('view engine', 'ejs');

//my middleware (personal ) takes any request and assign cookies
//FIRST STEP CSRF GENERATION
//SPA framework (single page application)
//req.csrfToken generates the token from the csurf library and assigns it as "XSRF-TOKEN for the user to be validated with the generated token"
app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.locals.csrftoken = req.csrfToken();
  next();
});
//To take advantage of this, set the value from req.csrfToken() in the cookie used by the SPA framework. This is only necessary to do on the route that renders the page (where res.render or res.sendFile is called in Express, for example).
//middle wares end ----
app.listen(process.env.PORT || 3000, function() {
  console.log("server running on port 3000");
});

// GET THE FIRST PAGE
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/Studenthandyfront.html");

});
// GET THE CREATE PAGE
app.get("/create", function(req, res) {

  res.sendFile(__dirname + "/create.html");
});


//GET THE SECOND PAGE
app.get("/Homepage", function(req, res) {
  // check if the user is logged in

//  const sessionCookie = req.cookies.session || '';
  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  //admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */ ).then((decodedClaims) => {
    //  console.log(decodedClaims)
   let posts_array = [];

   let posts_name = [];
   let posts_content = [];
   let posts_createdat = [];
   let posts_author = [];

   //// Get Posts from database
   function getPosts(){
     firebase.database().ref("users/event").once('value', function(snapshot) {
       snapshot.forEach(function(childSnapshot) {
         var childData = childSnapshot.val();
         posts_array.push(Object.values(childData));
 //console.log(childData);
  //console.log(posts_array);
       });

     for (var i, i = 0; i < posts_array.length; i++) {
          posts_createdat.push(posts_array[i][0]);
          posts_author.push(posts_array[i][1]);
           posts_content.push(posts_array[i][2]);
           posts_name.push(posts_array[i][3]);
               }
               res.render('Homepage', {postsname: posts_name, postscontent: posts_content, postscreatedat: posts_createdat,postsauthor: posts_author});
               console.log(posts_content);
     })

   }
     getPosts();
      //res.sendFile(__dirname+"/Homepage.html");
    //}).catch((error) => {
      // Session cookie is unavailable or invalid. Force user to login.
      //console.log("no cookie or cookie invalid" + error)
    //  res.redirect('/');
  //  });

  //console.log( firebase.auth().currentUser)
});

app.post("/sessionLogin", (req, res) => {
  //STEP 3 TAKES THE TOKEN
  //this part takes the token
  const idToken = req.body.idToken.toString();
  //  mynamedb = req.body.mynamedb;


  //const csrf= req.cookies.csrfToken;
  //console.log(req.cookies._csrf);
  //console.log(req.headers['csrf-token'])
  console.log(req.body);


  console.log(mynamedb);


  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // 60 secs 60 min/hr  24hrs 5days 1000millisecs
  admin
    .auth()
    .createSessionCookie(idToken, {
      expiresIn
    })
    .then(
      (sessionCookie) => {
        const options = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: true
        };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({
          status: "success"
        }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.post("/apiresult", function(req, res) {
  res.json(details);
  console.log(details)
});
//GETS THE POST ROUTE
app.post("/api", function(req, res) {
  console.log(req.body.username)
});

app.get('/sessionLogout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/');
});


app.get('/todolist', (req, res) => {
  const sessionCookie = req.cookies.session || '';
  admin
    .auth().verifySessionCookie(sessionCookie, true /** checkRevoked */ ).then((decodedClaims) => {
      useruid = decodedClaims.user_id;

      function fetchdatabd() {

        let task_array = [];
        let task_date = [],
          task_key = [],
          task_title = [];

        firebase.database().ref("users/" + useruid + "/unfinished_task").once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            task_array.push(Object.values(childData));
  console.log(childData);
          });

          for (var i, i = 0; i < task_array.length; i++) {
            task_date.push(task_array[i][0]);
            task_key.push(task_array[i][1]);
            task_title.push(task_array[i][2]);

          }
          console.log(task_date, task_key, task_title)
          res.render('list', {myname: decodedClaims.name,newitemadded: newitemsadd,task_title: task_title,task_keyy: task_key,task_date: task_date});
        })
      }
      fetchdatabd();
    }).catch((error) => {
      // Session cookie is unavailable or invalid. Force user to login.
      console.log("no cookie or cookie invalid" + error)
      res.redirect('/');
    });
  //console.log( firebase.auth().currentUser)
});

app.post('/newadd', function(req, res) {
  items = req.body.newitem;
  console.log(items)
  newitemsadd.push(items)
  res.redirect('/todolist');
});

// task taskentered is sent to the database
app.post('/taskentered', function(req, res) {

  const sessionCookie = req.cookies.session || '';
  admin
    .auth().verifySessionCookie(sessionCookie, true /** checkRevoked */ ).then((decodedClaims) => {
      useruid = decodedClaims.user_id;
  var puskkey = firebase.database().ref("users/" + useruid).child("unfinished_task").push().key;
  var task = {
    title: req.body.input_box,
    date: req.body.input_date,
    key: puskkey
  };

  var updates = {};
  updates["/unfinished_task/" + puskkey] = task;
  firebase.database().ref("users/" + useruid).update(updates);

  res.redirect('/todolist');

   }).catch((error) => {
  // Session cookie is unavailable or invalid. Force user to login.
   console.log("no cookie or cookie invalid" + error)
   res.redirect('/');
  });
});


//removes item from the database
app.post('/taskroute', function(req, res) {
  const sessionCookie = req.cookies.session || '';
  admin
    .auth().verifySessionCookie(sessionCookie, true /** checkRevoked */ ).then((decodedClaims) => {
      useruid = decodedClaims.user_id;
  var taskdelete = {
    taskkey: req.body.taskkey,
  };
  var taskkey = taskdelete.taskkey;
  var task_to_remove = firebase.database().ref("users/" + useruid + "/unfinished_task/" + taskkey);
  task_to_remove.remove();
  console.log(taskdelete.taskkey)
  res.redirect('/todolist');
   }).catch((error) => {
     // Session cookie is unavailable or invalid. Force user to login.
   console.log("no cookie or cookie invalid" + error)
   res.redirect('/');
    });
});



app.post('/taskroutedelete', function(req, res) {
  const sessionCookie = req.cookies.session || '';
  admin
    .auth().verifySessionCookie(sessionCookie, true /** checkRevoked */ ).then((decodedClaims) => {
      useruid = decodedClaims.user_id;

  var taskdelete = {
    taskkey: req.body.taskdeletekey,
  };
  var taskkey = taskdelete.taskkey;
  var task_to_remove = firebase.database().ref("users/" + useruid + "/unfinished_task/" + taskkey);
  task_to_remove.remove();
  console.log(taskdelete.taskkey)
  res.redirect('/todolist');
    }).catch((error) => {
  // Session cookie is unavailable or invalid. Force user to login.
   console.log("no cookie or cookie invalid" + error)
  res.redirect('/');
   });
});

// edit task in the database
app.post('/taskedit', function(req, res) {
  const sessionCookie = req.cookies.session || '';
  admin
    .auth().verifySessionCookie(sessionCookie, true /** checkRevoked */ ).then((decodedClaims) => {
      useruid = decodedClaims.user_id;

  var task_obj = {
    title: req.body.taskedittitle,
    date: req.body.taskeditdate,
    key: req.body.taskeditkey
  };

  var task_obj = req.body.taskedittitle;
  var updates = {};
  updates["users/" + useruid + "/unfinished_task/" + task_obj.key] = task_obj;
  firebase.database().ref().update(updates);

  res.redirect('/todolist');
  }).catch((error) => {
  // Session cookie is unavailable or invalid. Force user to login.
  console.log("no cookie or cookie invalid" + error)
  res.redirect('/');
  });

});
