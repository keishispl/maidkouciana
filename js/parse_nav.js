function parseNav(component) {
     const navDiv = document.getElementById("navdiv");
     const li = document.createElement("li");
     const a = document.createElement("a");
     if (component.disabled) {
          a.innerHTML = `<s>${component.name}</s>`;
          a.classList.add("selectdisabled");
     } else if (window.location.pathname === component.path || window.location.pathname === "/maidkouciana" + component.path) {
          a.innerHTML = component.name;
          a.classList.add("selected");
     } else {
          a.innerHTML = component.name;
          if (window.location.pathname.startsWith("/maidkouciana")) {
               a.href = window.location.origin + "/maidkouciana" + component.path;
          } else {
               a.href = window.location.origin + component.path;
          }
          a.classList.add("select");
     }

     navDiv.appendChild(li);
     li.appendChild(a);
};

jsonFromFile("nav").forEach((item) => parseNav(item));