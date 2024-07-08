const axios = require('axios');
const { parseString } = require('xml2js');
const fs = require('fs');

// Function to fetch RSS/Atom feed title
async function fetchFeedTitle(xmlUrl) {
  try {
    const response = await axios.get(xmlUrl);
    const xmlData = response.data;
    let title = '';
	let info = { title: '', site: ''};

    // Parse XML to extract title based on feed type and extract site URL based on feed type
    parseString(xmlData, (err, result) => {
      if (err) throw err;

      if (result.rss && result.rss.channel && result.rss.channel[0].title) {
        info.title = result.rss.channel[0].title[0];
      } else if (result.feed && result.feed.title) {
        info.title = result.feed.title[0]._;
        console.log("Title Atom:",result.feed.title[0]._) 
      }
 
      if (result.rss && result.rss.channel && result.rss.channel[0].link[0]) {
        info.site = result.rss.channel[0].link[0];
        console.log("Channel:",result.rss.channel[0].link[0]) 
      } else if (result.feed && result.feed.link) {
        info.site = result.feed.link[2].$.href;
        console.log("ChannelAtom:",result.feed.link[2].$.href) 
      }
      console.log("Title:", info.title);
      console.log("Site:", info.site);
	  

 });

    return info;
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
	feedinfo = { title: '', site: ''};
	let site = '';
	let title = '';

    // Fetch feed title and site URL
    feedinfo = await fetchFeedTitle(xmlUrl);
	
    console.log("Null test:", feedinfo);
	if (feedinfo === null)
	{
		site = xmlUrl;
		title = xmlUrl;
        console.log("Null test:", site, title);
	}
	else
	{
		site = feedinfo.site;
		title = feedinfo.title;
        console.log("Null test feedinfo:", site, title);
	}	

    // Append to OPML
    opml += `    <outline type="rss" text="${title || xmlUrl}" htmlUrl="${site || xmlUrl}" xmlUrl="${xmlUrl}"/>\n`;
  }

  opml += `  </body>"
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
