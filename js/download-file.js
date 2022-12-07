// DOM Elements
const txtBtn = document.getElementById("txtBtn");
const wordBtn = document.getElementById("wordBtn");
const pdfBtn = document.getElementById("pdfBtn");
const file = document.getElementById("editor");

// Adding click event to txt button
txtBtn.addEventListener("click", saveAsTxt);

// Adding click event to Word button
wordBtn.addEventListener("click", saveAsWord);

// Adding click event to PDF button
pdfBtn.addEventListener("click", saveAsPDF);

// Function to save file as TXT
function saveAsTxt() {
  let fileName = prompt("Enter the file name:");
  const a = document.createElement("a"); // Creating an anchor element
  const blob = new Blob([file.innerText]); // Creating a blob
  const url = URL.createObjectURL(blob); // Creating an URL for the anchor element
  a.href = url; // Add the generated URL to the anchor element
  a.download = fileName ? `${fileName}.txt` : "document.txt"; // Add theGenerating the name of the file which will be dowloaded
  a.click(); // Clicking the anchor element programatically
}

// Function to save file as word
function saveAsWord() {
  let fileName = prompt("Enter the file name:");
  let preHtml =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  let postHtml = "</body></html>";
  let html = preHtml + file.innerHTML + postHtml;
  let blob = new Blob(["\ufeff", html], {
    type: "application/msword",
  });
  let url =
    "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);
  let a = document.createElement("a");
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    a.href = url;
    a.download = fileName ? `${fileName}.doc` : "document.doc";
    a.click();
  }
}

// Function to save file as PDF
function saveAsPDF() {
  let fileName = prompt("Enter the file name:");
  html2pdf()
    .from(file)
    .save(fileName ? fileName : "document");
}
