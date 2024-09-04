import fetch from "node-fetch";
/* global console, document,setTimeout */

function loadView(viewName: string) {
  const content = document.getElementById("content");
  if (content) {
    fetch(`views/${viewName}.html`)
      .then((response) => response.text())
      .then((html) => {
        content.innerHTML = html;
        animateView();
      });
  }
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
(document as any).loadView = loadView;
