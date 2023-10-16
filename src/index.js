// index.js
const fs = require('fs');
const path = require('path');
const http = require('http');

function extractLinks(markdownContent, file) {
  const linkRegex = /(?:^|[^!])\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
  const links = [];

  let match;
  while ((match = linkRegex.exec(markdownContent)) !== null) {
    const text = match[1];
    const href = match[2];
    links.push({ text, href, file });
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


module.exports = mdLinks;
