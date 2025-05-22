/**
 * Renders a news item as a div containing a link to the news page, the title of the news, and the date of the news.
 * @param {Object} newsItem - The news item to render. It should contain a date and title property.
 */
function renderNewsItem(newsItem) {
     const { date, title } = newsItem;
     const dateParts = date.split('.');
     const newsDate = new Date(
          parseInt(dateParts[0], 10),
          parseInt(dateParts[1], 10) - 1,
          parseInt(dateParts[2], 10)
     );
     const now = Date.now();

     // If the news item is in the past, render it
     if (newsDate < now) {
          /**
           * Creates a new HTML object and sets its properties before appending it to a given body.
           * @param {HTMLElement} body - The body element to append the new HTML object to.
           * @param {string} item - The type of HTML object to create.
           * @param {Array} [object] - An array containing extra properties to set on the new HTML object. The property names are the names of the attributes to set, and the values are the values to set them to.
           * @param {boolean} [returnObject] - Whether to return the new HTML object or not. Defaults to false.
           * @returns {HTMLElement | void} The new HTML object if returnObject is true, otherwise undefined.
           */
          function setHTMLObject(body, item, object = undefined, returnObject = false) {
               const htmlObject = document.createElement(item);

               if (object !== undefined) {
                    for (const obj in object) {
                         if (obj === 'textContent') htmlObject.textContent = object[obj];
                         else htmlObject.setAttribute(obj, object[obj]);
                    };
               };

               body.appendChild(htmlObject);

               if (returnObject) return htmlObject;
          };

          // Create the specific news div
          const div = setHTMLObject(document.getElementById('news'), 'div', {
               class: 'news',
               id: `news_${date}`
          }, true);

          // Create a link to the news item
          setHTMLObject(div, 'a', {
               class: 'cover-link',
               href: `./news/?date=${date}`,
               textContent: title + " | " + date
          });

          // Create the title element
          setHTMLObject(div, 'p', {
               class: 'news_title',
               textContent: title
          });

          // Create the date element
          setHTMLObject(div, 'p', {
               class: 'news_date',
               textContent: date
          });
     }
}

// Wait 100 milliseconds before rendering the news items
setTimeout(() => {
     jsonFromFile('news').forEach(renderNewsItem);
}, 100);
