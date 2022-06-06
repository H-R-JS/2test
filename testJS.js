// affichage du spoiler lorsque que l'on appuit sur le btn spoiler, disparition de celui-ci.
/* var button = document.querySelector(".spoiler button");
button.addEventListener("click", function () {
  this.nextElementSibling.classList.add("visible");
  this.parentNode.removeChild(this);
}); */
(function () {
  const elementSpoilS = document.querySelectorAll(".spoiler");

  const createSpoilerbtn = function (elementSpoilS) {
    // On créer le btn
    const btn = document.createElement("button");
    btn.textContent = "Afficher le spoiler";
    // on créer le span
    const span = document.createElement("span");
    span.className = "spoiler-content";
    span.innerHTML = elementSpoilS.innerHTML;
    // on ajoute au DOM
    elementSpoilS.innerHTML = "";
    elementSpoilS.appendChild(btn);
    elementSpoilS.appendChild(span);

    btn.addEventListener("click", () => {
      if (btn.textContent == "Afficher le spoiler") {
        btn.textContent = "Tu es sûr ?";
      } else {
        span.classList.add("visible");
        elementSpoilS.removeChild(btn);
      }
    });
  };

  for (var i = 0; i < elementSpoilS.length; i++) {
    createSpoilerbtn(elementSpoilS[i]);
  }
})();
