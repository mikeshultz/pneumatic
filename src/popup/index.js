import html from './index.html'
console.log('popup.js')
/*browser.tabs.executeScript({file: "../content_scripts/inject.js"})
    .then(() => {
      console.log('executeScript success.  now init()')
      init()
      console.log('init() complete')
    })
    .catch(reportExecuteScriptError)*/

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}

function init() {
  document.addEventListener("click", (e) => {
    console.log('CLICK')
  })
}

(function () {
  console.log('exec-')
  init()
  console.log('-exec')
})()
