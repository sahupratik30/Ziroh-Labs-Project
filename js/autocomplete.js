// GLOBALS
let MAX_SUGGESTIONS = 5;
let CONTENT;

// DOM Elements
const edit_area = document.getElementById("editor");
const editor_wrapper = document.getElementById("editArea");

// Function to check if list is present in DOM
const isListPresent = () => {
  const list = document.getElementById("autocomplete");
  if (typeof list != "undefined" && list != null) {
    return true;
  } else {
    return false;
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

// Debouncing the spell checking function for better performance
const betterFunction = debounce(getCurrentWord, 130);

// Event Listeners
window.addEventListener("load", async () => {
  const words = await fetch("../dictionary/words.json");
  CONTENT = await words.json();
});
edit_area.addEventListener("input", betterFunction);

// Function to place cursor at the end of text
const placeCursorAtEnd = () => {
  const selection = window.getSelection();
  const range = document.createRange();
  selection.removeAllRanges();
  range.selectNodeContents(edit_area);
  range.collapse(false);
  selection.addRange(range);
  edit_area.focus(); // Focusing on the editor after a list item has been selected
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

// Function to get the current word typed
function getCurrentWord() {
  let words = [];
  if (edit_area.innerText) {
    let str = edit_area.innerText.replace(/[\t\n\r\.\?\!]/gm, " ").split(" ");
    str.map((s) => {
      let trimStr = s.trim();
      if (trimStr.length > 0) {
        words.push(trimStr);
      }
    });
    let currentWord = words[words.length - 1];
    currentWord && createAutocomplete(currentWord);
  } else {
    if (isListPresent()) {
      const list = document.getElementById("autocomplete");
      editor_wrapper.removeChild(list);
    }
  }
}

// Function to create the autocomplete list
function createAutocomplete(word) {
  if (!isListPresent()) {
    const ul = document.createElement("ul");
    ul.classList.add("autocomplete");
    ul.id = "autocomplete";
    const matches = CONTENT.filter((data) => {
      const regex = new RegExp(`^${word}`, "gi");
      return data.word.match(regex);
    });
    let html = "";
    if (matches.length > MAX_SUGGESTIONS) {
      for (let i = 0; i < MAX_SUGGESTIONS; i++) {
        html += `<li>${matches[i].word}</li>`;
      }
    } else {
      for (let i = 0; i < matches.length; i++) {
        html += `<li>${matches[i].word}</li>`;
      }
    }
    ul.innerHTML = html;
    editor_wrapper.appendChild(ul);
    let words = matches.map((match) => {
      return match.word;
    });
    if (words.includes(word) || words.includes(word.toLowerCase())) {
      const list = document.getElementById("autocomplete");
      editor_wrapper.removeChild(list);
    }
    // Adding click event listener to the list items
    ul.addEventListener("click", (e) => {
      // Replacing the misstyped word with the word selected from the list
      replaceWord(e.target.innerText);
      editor_wrapper.removeChild(ul); // Removing the list from the DOM after a list item has been selected
      if (document.getElementById("suggestions")) {
        editor_wrapper.removeChild(document.getElementById("suggestions"));
      }
    });
  } else {
    html = "";
    const matches = CONTENT.filter((data) => {
      const regex = new RegExp(`^${word}`, "gi");
      return data.word.match(regex);
    });
    // Appending the list items if list is already present in the DOM
    const list = document.getElementById("autocomplete");
    list.innerHTML = "";
    if (matches.length > MAX_SUGGESTIONS) {
      for (let i = 0; i < MAX_SUGGESTIONS; i++) {
        html += `<li>${matches[i].word}</li>`;
      }
    } else {
      for (let i = 0; i < matches.length; i++) {
        html += `<li>${matches[i].word}</li>`;
      }
    }
    list.innerHTML = html;
    let words = matches.map((match) => {
      return match.word;
    });
    if (words.includes(word) || words.includes(word.toLowerCase())) {
      const list = document.getElementById("autocomplete");
      editor_wrapper.removeChild(list);
    }
  }
}
