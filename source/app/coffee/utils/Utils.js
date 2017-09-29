/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Utils {
  // loads json file
  static loadJSON(url) {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open("get", url, true);
      xhr.responseType = "json";
      xhr.onload = function() {
        const { status } = xhr;
        if (status === 200) {
          resolve(xhr.response);
        } else {
          reject(status);
        }
        return null;
      };
      xhr.onerror = function() {
        reject(Error("Network Error"));
        return null;
      };
      xhr.send();
      return null;
    });
  }

  // gets query string params
  static getQueryParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search.toLowerCase());
    if (results === null) {
      return false;
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  }

  // confirm window with callback
  static confirm(action, onConfirm) {
    // bypassing warning
    onConfirm();

    // w = confirm action
    // if w
    //     onConfirm()
    return null;
  }
}
