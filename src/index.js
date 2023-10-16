// index.js
const fs = require('fs');
const path = require('path');
const http = require('http');

function extractLinks(markdownContent, file) {
  const lines = markdownContent.split('\n');
  const links = [];
  let currentTitle = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#')) {
      currentTitle = line.replace(/#/g, '').trim();
    } else if (line.match(/\[.*\]\(https?:\/\/[^\s)]+\)/)) {
      const linkMatches = line.match(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g);
      if (linkMatches) {
        linkMatches.forEach((match) => {
          const text = match.match(/\[(.*?)\]/)[1];
          const href = match.match(/\((https?:\/\/[^\s)]+)\)/)[1];
          links.push({ text, href, title: currentTitle, file });
        });
      }
    }
  }

  return links;
}


function validateLink(link) {
  return new Promise((resolve, reject) => {
    const url = new URL(link.href);
    const options = {
      host: url.host,
      path: url.pathname,
      method: 'HEAD',
    };

    const req = http.request(options, (res) => {
      link.status = res.statusCode;
      link.ok = res.statusCode >= 200 && res.statusCode < 400;
      resolve(link);
    });

    req.on('error', () => {
      link.status = null;
      link.ok = false;
      resolve(link);
    });

    req.end();
  });
}

function mdLinks(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath);

    fs.readFile(absolutePath, 'utf8', (err, fileContent) => {
      if (err) {
        reject(err);
        return;
      }

      const links = extractLinks(fileContent, absolutePath);

      if (options.validate || options.stats) {
        const linksPromises = links.map((link) => validateLink(link));

        Promise.all(linksPromises)
          .then((validatedLinks) => {
            if (options.stats) {
              const stats = {
                total: validatedLinks.length,
                unique: new Set(validatedLinks.map((link) => link.href)).size,
                broken: validatedLinks.filter((link) => !link.ok).length,
              };
              resolve({ links: validatedLinks, stats });
            } else {
              resolve({ links: validatedLinks });
            }
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve({ links });
      }
    });
  });
}


module.exports = {
  extractLinks,
  validateLink,
  mdLinks,
};
