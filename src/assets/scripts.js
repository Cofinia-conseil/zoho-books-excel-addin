/* global console, document, setTimeout */
function loadView(viewName) {
  document.location.href = `${viewName}.html`;
}


function animateView() {
  const content = document.getElementById("content");
  console.log("zeee");
  if (content) {
    content.style.opacity = "0";
    setTimeout(() => {
      content.style.opacity = "1";
    }, 100);
  }
}

// Expose loadView to the global scope
window.loadView = loadView;