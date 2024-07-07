const axios = require('axios');
const { parseString } = require('xml2js');
const fs = require('fs');

// Function to fetch RSS/Atom feed title
async function fetchFeedTitle(xmlUrl) {
  try {
    const response = await axios.get(xmlUrl);
    const xmlData = response.data;
    let title = '';

    // Parse XML to extract title based on feed type
    parseString(xmlData, (err, result) => {
      if (err) throw err;

      if (result.rss && result.rss.channel && result.rss.channel[0].title) {
        title = result.rss.channel[0].title[0];
      } else if (result.feed && result.feed.title) {
        title = result.feed.title[0];
      }
    });

    return title;
  } catch (error) {
    console.error(`Error fetching ${xmlUrl}: ${error.message}`);
    return null;
  }
}

// Main function to process URLs and generate OPML
async function generateOPML(urls) {
  let opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Feed Subscriptions</title>
  </head>
  <body>\n`;

  for (const url of urls) {
    const xmlUrl = url.trim();
    const htmlUrl = xmlUrl; // Assuming htmlUrl is same as xmlUrl

    // Fetch feed title
    const title = await fetchFeedTitle(xmlUrl);

    // Append to OPML
    opml += `    <outline type="rss" htmlUrl="${htmlUrl}" xmlUrl="${xmlUrl}" text="${title || xmlUrl}"/>\n`;
  }

  opml += `  </body>
</opml>`;

  // Write OPML to file
  fs.writeFile('feeds.opml', opml, (err) => {
    if (err) throw err;
    console.log('OPML file generated successfully.');
  });
}

// Example usage: Read URLs from a file
fs.readFile('urls.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  const urls = data.trim().split('\n');
  generateOPML(urls);
});
