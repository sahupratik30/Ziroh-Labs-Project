// DOM Elements
const editor = document.getElementById("editor");
const colorBtn = document.getElementById("colorBtn");
const toolsContainer = document.getElementById("tools");
const color = document.getElementById("color");

// Focus on edtior when page loads
window.addEventListener("load", () => {
  editor.focus();
});

// Handling click events for tools
toolsContainer.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "bold":
      // Making text bold using bold button
      document.execCommand("bold");
      break;
    case "italic":
      // Making text italic using italic button
      document.execCommand("italic");
      break;
    case "underline":
      // Making text underline using underline button
      document.execCommand("underline");
      break;
    case "colorBtn":
      // Changing color of selected
      document.execCommand("foreColor", false, `${color.value}`);
      break;
  }
});

// Changing color of color button
color.addEventListener("change", (e) => {
  let colorValue = e.target.value;
  document.getElementById(
    "colorWrapper"
  ).style.backgroundColor = `${colorValue}`;
  colorBtn.style.setProperty("--background", `${colorValue}`);
});
