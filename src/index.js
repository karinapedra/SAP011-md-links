const fs = require('fs');

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, fileContent) => {
      if (err) {
        reject(err);
        return;
      }

      const linkRegex = /https?:\/\/\S+/g;
      const links = fileContent.match(linkRegex);
      const results = [];

      if (links) {
        Promise.all(links.map((link) => {
          return fetch(link)
            .then((response) => {
              results.push({
                url: link,
                status: response.status,
                statusText: response.statusText,
              });
              return {
                url: link,
                status: response.status,
                statusText: response.statusText,
              };
            })
            .catch((error) => {
              results.push({
                url: link,
                error: error.message,
              });
              return {
                url: link,
                error: error.message,
              };
            });
        })).then(() => {
          resolve(results);
        });
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = readFile;
