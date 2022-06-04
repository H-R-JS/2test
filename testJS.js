// affichage du spoiler lorsque que l'on appuit sur le btn spoiler, disparition de celui-ci.
/* var button = document.querySelector(".spoiler button");
button.addEventListener("click", function () {
  this.nextElementSibling.classList.add("visible");
  this.parentNode.removeChild(this);
}); */

const elementSpoilS = document.querySelectorAll(".spoiler");

const createSpoilerbtn = function (elementSpoilS) {
  // On créer le btn
  const btn = document.createElement("button");
  btn.textContent = "Afficher le spoiler";
  // on créer le span
  const span = document.createElement("span");
  span.className = "spoiler-content";
  span.innerHtml = elementSpoilS.innerHtml;
  // on ajoute au DOM
  elementSpoilS.appendChild(btn);
  elementSpoilS.appendChild(span);
};

for (var i = 0; i < elementSpoilS.length; i++) {
  createSpoilerbtn(elementSpoilS[i]);
}
