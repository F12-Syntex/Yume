// Import required modules
const http = require('http');
const https = require('https');
const cheerio = require('cheerio');

const { SourceTextModule } = require('vm');

// Set up the server
const hostname = '127.0.0.1';

const express = require('express');
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/search', (req, res) => {
  // Handle the GET request...
  console.log('GET request received at /search');

  const content = req.query.content.trim().replace(/\s/g, '+');

  //https://getwallpapers.com/search?term=
  fetchAndProcessHtml('https://wallhaven.cc/search?q=' + content).then((jsonResponse) => {
    console.log('Response sent to client' + req.ip);
    res.json(jsonResponse);
  });
});



// Start the server
app.listen(3023, () => {
  console.log('Server listening on port ' + 3023);
});

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    };

    protocol.get(url, options, (res) => {
      let data = '';

      // A chunk of data has been received.
      res.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      res.on('end', () => {
        //console.log(data);
        resolve(data);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}


function getImages(html) {
  const $ = cheerio.load(html);
  const images = [];

  $('img[img-src]').each((i, elem) => {
    const imgSrc = $(elem).attr('img-src');
    if (imgSrc !== null) {
      images.push(imgSrc);
    }
  });
  
  $('img[data-src]').each((i, elem) => {
    const dataSrc = $(elem).attr('data-src');
    if (dataSrc !== null) {
      images.push(dataSrc);
    }
  });
  
  $('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href !== null) {
      images.push(href);
    }
  });
  

  return images;
}


async function fetchAndProcessHtml(url) {
  try {
    const html = await fetchHtml(url);
    const images = getImages(html);
    const jsonResponse = { images };
    return JSON.stringify(jsonResponse);
  } catch (err) {
    console.error(err);
  }
}

