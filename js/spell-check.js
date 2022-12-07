// Importing typo.js
var Typo = require("typo-js");
var dictionary = new Typo("en_US");

// GLOBALS
let CURRENT_WORD;

// Selecting DOM Elements
const editArea = document.getElementById("editor");
const editorWrapper = document.getElementById("editArea");

// Function to check if list is present in DOM
const isListPresent = () => {
  const list = document.getElementById("suggestions");
  if (typeof list != "undefined" && list != null) {
    return true;
  } else {
    return false;
  }
};

// Function to place cursor at the end of text
const placeCursorAtEnd = () => {
  const selection = window.getSelection();
  const range = document.createRange();
  selection.removeAllRanges();
  range.selectNodeContents(editArea);
  range.collapse(false);
  selection.addRange(range);
  editArea.focus(); // Focusing on the editor after a list item has been selected
};

// Function to replace word
const replaceWord = (word) => {
  placeCursorAtEnd();
  sel = document.getSelection();
  sel.modify("extend", "backward", "word");
  range = sel.getRangeAt(0);
  range.deleteContents();
  var el = document.createElement("div");
  el.innerHTML = `${word}`;
  var frag = document.createDocumentFragment(),
    node;
  while ((node = el.firstChild)) {
    frag.appendChild(node);
  }
  range.insertNode(frag);
  range.collapse();
};

// Function to create a list of suggestions
const createSuggestionList = (words) => {
  if (!isListPresent()) {
    // Creating a suggestion list only of there is no such list already present in the DOM
    const ul = document.createElement("ul");
    ul.classList.add("suggestions");
    ul.id = "suggestions";
    words.map((word) => {
      const li = document.createElement("li");
      li.innerText = word;
      ul.append(li);
    });
    editorWrapper.append(ul);
    // Adding click event listener to the list items
    ul.addEventListener("click", (e) => {
      // Replacing the misstyped word with the word selected from the list
      replaceWord(e.target.innerText);
      editorWrapper.removeChild(ul); // Removing the list from the DOM after a list item has been selected
      if (document.getElementById("autocomplete")) {
        editorWrapper.removeChild(document.getElementById("autocomplete"));
      }
    });
  } else {
    // Appending the list items if list is already present in the DOM
    const list = document.getElementById("suggestions");
    list.innerHTML = "";
    words.map((word) => {
      const li = document.createElement("li");
      li.innerText = word;
      list.append(li);
    });
  }
};

// Function to show suggestions for incorrect word.
const showSuggestions = (word) => {
  const suggestions = dictionary.suggest(word);
  createSuggestionList(suggestions);
};

// Function to check spelling
const checkSpelling = () => {
  let words = [];
  if (editArea.innerText) {
    let str = editArea.innerText.replace(/[\t\n\r\.\?\!]/gm, " ").split(" ");
    str.map((s) => {
      let trimStr = s.trim();
      if (trimStr.length > 0) {
        words.push(trimStr);
      }
    });
    let currentWord = words[words.length - 1];
    CURRENT_WORD = currentWord;
    if (!dictionary.check(currentWord)) {
      // Calling the showSuggestions function if the word is incorrect
      showSuggestions(currentWord);
    } else {
      if (isListPresent()) {
        const list = document.getElementById("suggestions");
        editorWrapper.removeChild(list);
      }
    }
  } else {
    if (isListPresent()) {
      const list = document.getElementById("suggestions");
      editorWrapper.removeChild(list);
    }
  }
};

// A general debounce function to improve performance
const debounce = (fn, delay) => {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this);
    }, delay);
  };
};
let currentItem = -1; // Setting the current list item as -1, since no item will be selected initially
// Function to select items from suggestion list using arrow keys
const selectSuggestion = (e) => {
  if (isListPresent()) {
    const list_items = document.querySelectorAll(".suggestions li");
    if (e.key === "ArrowRight") {
      editArea.blur();
      list_items[currentItem]?.classList.remove("selected");
      if (currentItem === list_items.length - 1) {
        currentItem = -1;
      }
      list_items[++currentItem].classList.add("selected");
    } else if (e.key === "ArrowLeft") {
      editArea.blur();
      list_items[currentItem]?.classList.remove("selected");
      if (currentItem === -1 || currentItem === 0) {
        currentItem = list_items.length;
      }
      list_items[--currentItem].classList.add("selected");
    }
    if (editArea.innerText.trim() !== "") {
      if (e.key === "Enter") {
        console.log(CURRENT_WORD);
        if (list_items[currentItem]) {
          // Replacing the misstyped word with the word selected from the list
          replaceWord(list_items[currentItem].innerText);
        }
        const list = document.getElementById("suggestions");
        editorWrapper.removeChild(list);
        if (document.getElementById("autocomplete")) {
          editorWrapper.removeChild(document.getElementById("autocomplete"));
        }
        currentItem = -1;
      }
    } else {
      return;
    }
  }
};

// Debouncing the spell checking function for better performance
const betterSpellcheck = debounce(checkSpelling, 2000);

// Adding input event to the editor
editArea.addEventListener("input", betterSpellcheck);
// Adding keydown event listener to window
window.addEventListener("keydown", selectSuggestion);
