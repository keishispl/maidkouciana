function parseNews(array) {

     var date = array.date.split(".");
     var date2 = new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]));
     var dateNow = Date.now();
     console.log("Current Date: " + dateNow)

     if (date2 < dateNow) {

          // Sub-DIV for each JSON data element
          const newsDiv = document.getElementById("news");
          const div = document.createElement("div")

          div.setAttribute("id", "news_"+array.date);
          div.setAttribute("class", "news");

          newsDiv.appendChild(div);

          div.addEventListener('click', () => {
               window.location.href = "../news/" + `${date[0]}_${date[1]}_${date[2]}.html`;
          });

          Object.keys(array).forEach((key) => {

               // Creating text from JSON data
               const para = document.createElement("p");

               div.appendChild(para);
               para.innerHTML = array[key];

                    switch (key) {
                    case "title":
                        para.setAttribute("class", `news_title`);
                        break;
                    case "date":
                         para.setAttribute("class", `news_date`);
                         break;
               }
          });
     }
};