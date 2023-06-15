var Promise = require("promise");

/**
  * FetchModel - Fetch a model from the web server.
  *     url - string - The URL to issue the GET request.
  * Returns: a Promise that should be filled
  * with the response of the GET request parsed
  * as a JSON object and returned in the property
  * named "data" of an object.
  * If the requests has an error the promise should be
  * rejected with an object contain the properties:
  *    status:  The HTTP response status
  *    statusText:  The statusText from the xhr request
  *
*/


function fetchModel(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        const data = JSON.parse(request.responseText);
        resolve({ data });
      } else {
        reject( new Error ({
          status: request.status,
          statusText: request.statusText
        }));
      }
    };

    request.onerror = () => {
      reject( new Error({
        status: request.status,
        statusText: request.statusText
      }));
    };

    request.send();
  });
}

export default fetchModel;