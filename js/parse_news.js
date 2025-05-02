/**
 * Renders a news item
 *
 * @param {object} newsItem
 * @prop {string} date - The date of the news item in the format 'YYYY.MM.DD'
 * @prop {string} title - The title of the news item
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
          const newsDiv = document.getElementById('news');
          const newsItemDiv = document.createElement('div');
          newsItemDiv.classList.add('news');
          newsItemDiv.id = `news_${date}`;

          // Create a link to the news item
          const link = document.createElement('a');
          link.classList.add('cover-link');
          link.href = `./news/?date=${date}`;
          newsItemDiv.appendChild(link);

          // Create the title element
          const titleElement = document.createElement('p');
          titleElement.classList.add('news_title');
          titleElement.textContent = title;
          newsItemDiv.appendChild(titleElement);

          // Create the date element
          const dateElement = document.createElement('p');
          dateElement.classList.add('news_date');
          dateElement.textContent = date;
          newsItemDiv.appendChild(dateElement);

          // Add the news item to the news div
          newsDiv.appendChild(newsItemDiv);
     }
}

// Wait 250 milliseconds before rendering the news items
setTimeout(() => {
     jsonFromFile('news').forEach(renderNewsItem);
}, 250);
