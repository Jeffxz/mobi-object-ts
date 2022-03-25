const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const mobiPath = params.get('mobi');

if (mobiPath) {
  window.fetch(mobiPath)
    .then(response => response.arrayBuffer())
    .then(data => {
      const mobi = new mobiObject.MobiFile(data)
      mobi.load()
      const elem = document.getElementById('output');
      elem.textContent = JSON.stringify(mobi, null, 4);
    })
}
