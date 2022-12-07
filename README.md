# About the project

A document editor with spell-check and auto-completion functionality.

# Technology Stack

- HTML
- CSS
- JavaScript
- Browserify _(allows developers to write and use Node.js-style modules that compile for use in the browser.)_

# Files and Folders

- **index.html** _(contains all the html code for building the structure of the page)_
- **style.css** _(contains all the styles for the page)_
- `js` _(folder containing all the javascript files)_
  - **_app.js_** _(contains all the logic for the styling part i.e `bold`, `italic`, `underline`, and `color`)_
  - **_spell-check.js_** _(contains all the logic for the spell-checking functionality)_
  - **autocomplete.js** _(conatins all the logic for the auto-completion functionality)_
  - **download-file.js** _(conatins all the logic for downloading file)_
- `node_modules` _(folder used to save all downloaded packages from NPM)_
- `dictionary` _(folder containing a file ***words.json*** which contains all words from en_US dictionary)_
- `dist` _(folder containing a file ***bundle.js*** which contains all the code which is being compiled by `browserify`)_

# External packages used

- **Typo.js** _(open source library used to implement the spell-check functionality)_
- **html2pdf.js** _(open source library used to convert HTML code into PDF files)_
