window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logout-btn").addEventListener("click", () => {

   window.location.assign("/sessionLogout");

  });
  document.getElementById("todolist").addEventListener("click", () => {

   window.location.assign("/todolist");

  });

  document.getElementById("todolist").addEventListener("click", () => {

   window.location.assign("/todolist");

  });
  
  let postCollection = document.querySelector("#posts-collection");

  function createPost(title, time, content) {
    let div = document.createElement("div");
    div.setAttribute("class", "col-md-4");

    let h2 = document.createElement("h2");
    let p = document.createElement("p");
    let small = document.createElement("small");

    h2.textContent = title;
    small.textContent = time;
    p.textContent = content;

    div.appendChild(h2);
    div.appendChild(small);
    div.appendChild(p);

    postCollection.appendChild(div);
  }





});
