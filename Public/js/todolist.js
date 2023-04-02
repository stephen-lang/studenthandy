//window.addEventListener("DOMContentLoaded", () => {
/*var firebaseConfig = {
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

*/


  document.getElementById("logout-btn").addEventListener("click", () => {

   window.location.assign("/sessionLogout");

  });


document.getElementById("entertask").addEventListener("submit", (e) => {
e.preventDefault();
location.reload();

  input_box = document.getElementById("input_box").value;
  input_date = document.getElementById("input_date").value;
   unfinished_task_container = document.getElementsByClassName("container")[0];
  if(input_box.length != 0 && input_date.length != 0){
    // our boxes have data and we take database

// this section appends the new created data to the data box and sends them to the database
    task_container = document.createElement("div");
    task_container.setAttribute("class", "task_container");


    // TASK DATA
    task_data = document.createElement('div');
    task_data.setAttribute('id', 'task_data');

    title = document.createElement('p');
    title.setAttribute('id', 'task_title');
    title.setAttribute('contenteditable', false);
    title.innerHTML = input_box;

    date = document.createElement('p');
    date.setAttribute('id', 'task_date');
    date.setAttribute('contenteditable', false);
    date.innerHTML = input_date;

    // TASK TOOLS
    task_tool = document.createElement('div');
    task_tool.setAttribute('id', 'task_tool');

    task_done_button = document.createElement('button');
    task_done_button.setAttribute('id', 'task_done_button');
    task_done_button.setAttribute('onclick', "task_done(this.parentElement.parentElement, this.parentElement)");
    fa_done = document.createElement('i');
    fa_done.setAttribute('class', 'fa fa-check');

    task_edit_button = document.createElement('button');
    task_edit_button.setAttribute('id', 'task_edit_button');
    task_edit_button.setAttribute('onclick', "task_edit(this.parentElement.parentElement, this)");
    fa_edit = document.createElement('i');
    fa_edit.setAttribute('class', 'fa fa-pencil');

    task_delete_button = document.createElement('button');
    task_delete_button.setAttribute('id', 'task_delete_button');
    task_delete_button.setAttribute('onclick', "task_delete(this.parentElement.parentElement, this.parentElement)");
    fa_delete = document.createElement('i');
    fa_delete.setAttribute('class', 'fa fa-trash');


    unfinished_task_container.append(task_container);
    task_container.append(task_data);
    task_data.append(title);
    task_data.append(date);

    task_container.append(task_tool);
    task_tool.append(task_done_button);
    task_done_button.append(fa_done);
    task_tool.append(task_edit_button);
    task_edit_button.append(fa_edit);
    task_tool.append(task_delete_button);
    task_delete_button.append(fa_delete);

// this section sends the data to the server side to be sent to the database
     console.log(input_box);
    fetch("/taskentered", {
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
        input_box:input_box,
        input_date:input_date
                      }),
    });

  }

})


function create_unfinished_task(){
  unfinished_task_container = document.getElementsByClassName("container")[0];
  unfinished_task_container.innerHTML = "";

  task_array = [];
  firebase.database().ref("unfinished_task").once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      task_array.push(Object.values(childData));
    });
    for(var i, i = 0; i < task_array.length; i++){
      task_date = task_array[i][0];
      task_key = task_array[i][1];
      task_title = task_array[i][2];

      task_container = document.createElement("div");
      task_container.setAttribute("class", "task_container");
      task_container.setAttribute("data-key", task_key);

      // TASK DATA
      task_data = document.createElement('div');
      task_data.setAttribute('id', 'task_data');

      title = document.createElement('p');
      title.setAttribute('id', 'task_title');
      title.setAttribute('contenteditable', false);
      title.innerHTML = task_title;

      date = document.createElement('p');
      date.setAttribute('id', 'task_date');
      date.setAttribute('contenteditable', false);
      date.innerHTML = task_date;

      // TASK TOOLS
      task_tool = document.createElement('div');
      task_tool.setAttribute('id', 'task_tool');

      task_done_button = document.createElement('button');
      task_done_button.setAttribute('id', 'task_done_button');
      task_done_button.setAttribute('onclick', "task_done(this.parentElement.parentElement, this.parentElement)");
      fa_done = document.createElement('i');
      fa_done.setAttribute('class', 'fa fa-check');

      task_edit_button = document.createElement('button');
      task_edit_button.setAttribute('id', 'task_edit_button');
      task_edit_button.setAttribute('onclick', "task_edit(this.parentElement.parentElement, this)");
      fa_edit = document.createElement('i');
      fa_edit.setAttribute('class', 'fa fa-pencil');

      task_delete_button = document.createElement('button');
      task_delete_button.setAttribute('id', 'task_delete_button');
      task_delete_button.setAttribute('onclick', "task_delete(this.parentElement.parentElement, this.parentElement)");
      fa_delete = document.createElement('i');
      fa_delete.setAttribute('class', 'fa fa-trash');


      unfinished_task_container.append(task_container);
      task_container.append(task_data);
      task_data.append(title);
      task_data.append(date);

      task_container.append(task_tool);
      task_tool.append(task_done_button);
      task_done_button.append(fa_done);
      task_tool.append(task_edit_button);
      task_edit_button.append(fa_edit);
      task_tool.append(task_delete_button);
      task_delete_button.append(fa_delete);
    }

  });

}
function create_finished_task(){

  finished_task_container = document.getElementsByClassName("container")[1];
  finished_task_container.innerHTML = "";

  finished_task_array = [];
  firebase.database().ref("finished_task").once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      finished_task_array.push(Object.values(childData));
    });
    for(var i, i = 0; i < finished_task_array.length; i++){
      task_date = finished_task_array[i][0];
      task_key = finished_task_array[i][1];
      task_title = finished_task_array[i][2];

      task_container = document.createElement("div");
      task_container.setAttribute("class", "task_container");
      task_container.setAttribute("data-key", task_key);

      // TASK DATA
      task_data = document.createElement('div');
      task_data.setAttribute('id', 'task_data');

      title = document.createElement('p');
      title.setAttribute('id', 'task_title');
      title.setAttribute('contenteditable', false);
      title.innerHTML = task_title;

      date = document.createElement('p');
      date.setAttribute('id', 'task_date');
      date.setAttribute('contenteditable', false);
      date.innerHTML = task_date;

      // TASK TOOLS
      task_tool = document.createElement('div');
      task_tool.setAttribute('id', 'task_tool');

      task_delete_button = document.createElement('button');
      task_delete_button.setAttribute('id', 'task_delete_button');
      task_delete_button.setAttribute('onclick', "task_finished_delete(this.parentElement.parentElement)");
      fa_delete = document.createElement('i');
      fa_delete.setAttribute('class', 'fa fa-trash');

      finished_task_container.append(task_container);
      task_container.append(task_data);
      task_data.append(title);
      task_data.append(date);

      task_container.append(task_tool);
      task_tool.append(task_delete_button);
      task_delete_button.append(fa_delete);
    }

  });

}

function task_done(task, task_tool){ //
  finished_task_container = document.getElementsByClassName("container")[1];
  console.log(task)
    var key = task.getAttribute("data-key");
    console.log(key)
  task.removeChild(task_tool);
  finished_task_container.append(task);



  fetch("/taskroute", {
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
      taskkey:key
                    }),
  });

console.log(key)

  // delete our task from unfinished
  //task_delete(task,task_tool);
//  create_finished_task();
}

function task_edit(task, edit_button){
  edit_button.setAttribute("id", "task_edit_button_editing");
  edit_button.setAttribute("onclick", "finish_edit(this.parentElement.parentElement, this)");
//document.getElementById('task_edit_button').parentElement.parentElement.childNodes[3].childNodes[1]
  title = task.childNodes[3].childNodes[1];
  title.setAttribute("contenteditable", true);
  title.setAttribute("id", "title_editing");
  title.focus();
//document.getElementById('task_edit_button').parentElement.parentElement.childNodes[3].childNodes[3]
  date=task.childNodes[3].childNodes[3];
  date.setAttribute("contenteditable", true);
  date.setAttribute("id", "date_editing");

}
// below code works when user finich editing the task
function finish_edit(task, edit_button){
  edit_button.setAttribute("id", "task_edit_button");
  edit_button.setAttribute("onclick", "task_edit(this.parentElement.parentElement, this)");

  title = task.childNodes[3].childNodes[1];
  title.setAttribute("contenteditable", false);
  title.setAttribute("id", "task_title");

  date = task.childNodes[3].childNodes[3];
  date.setAttribute("contenteditable", false);
  date.setAttribute("id", "task_date");

  // change in firebase to
  var key = task.getAttribute("data-key");
  var tasktitle = task.childNodes[3].childNodes[1].innerHTML;
  var dateoftask = task.childNodes[3].childNodes[3].innerHTML;
  var task_obj = {
    title: tasktitle,
    date: dateoftask,
    key: key
  };
  fetch("/taskedit", {
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
      taskedittitle:tasktitle,
      taskeditdate:dateoftask,
      taskeditkey:key
                    }),
  });
  console.log(task_obj)
}

function task_delete(task,task_tool){
    var taskkey = task.getAttribute("data-key");
  tasktitle = document.getElementById("task_title").innerHTML;
  console.log(tasktitle);
  // sends the data to the server side for the item to be deleted
  fetch("/taskroutedelete", {
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
      taskdeletekey:taskkey
                    }),
  });
  task.removeChild(task_tool);

  //task_to_remove = firebase.database().ref("unfinished_task/" + key);
  //task_to_remove.remove();
  // remove from html view or whatevesss
  task.remove();

}

function task_finished_delete(task){
  key = task.getAttribute("data-key");
  finished_task_container = document.getElementsByClassName("container")[0];
  task.removeChild(task);

  // remove from html view or whatevesss
  task.remove();

}
//});
