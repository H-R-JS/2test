///// FIRST TEST

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

  for (let i = 0; i < elementSpoilS.length; i++) {
    createSpoilerbtn(elementSpoilS[i]);
  }
})();

///// SECOND TEST//////////////////////////////////////////////////
// Lorsque que l'on clique, on doit dans l'ordre:
// - retirer la class active de l'onglet qui n'est plus actuel
// - Ajouter la class active à l'onglet cliqué
// - retirer la class active du contenu qui n'est plus actuel
// - ajouter la class active au contenu cliqué
(function () {
  var afficherOnglet = function (a, animation) {
    if (animation === undefined) {
      animation = true;
    }
    var li = a.parentNode.classList;
    var div = a.parentNode.parentNode.parentNode;
    var activeTab = div.querySelector(".all-tabs-content .active"); // contenu actif
    var AfficheActuel = div.querySelector(a.getAttribute("href")); // contenu à afficher
    if (li.contains("active")) {
      return false;
    } else {
      // on retire la class
      div.querySelector(".tabs .active").classList.remove("active");
      // on ajoute la class
      li.add("active");
      // on retire la class au contenu
      ///div.querySelector(".all-tabs-content .active").classList.remove("active");
      // on ajoute la class au contenu
      ///div.querySelector(a.getAttribute("href")).classList.add("active");
      if (animation) {
        activeTab.classList.add("fade");
        activeTab.classList.remove("in");
        var transitionEnd = function () {
          this.classList.remove("fade");
          this.classList.remove("active");
          AfficheActuel.classList.add("active");
          AfficheActuel.classList.add("fade");
          AfficheActuel.offsetWidth;
          AfficheActuel.classList.add("in");
          activeTab.removeEventListener("transitionend", transitionEnd);
        };
        activeTab.addEventListener("transitionend", transitionEnd);
      } else {
        AfficheActuel.classList.add("active");
        activeTab.classList.remove("active");
      }

      // On ajoute la class fade sur l'élément actif
      // A la fin de l'animation on retire la class fade et active
      // on ajoute la class active et fade à l'élément afficher
      // puis on ajoute la class in
    }
  };

  var tabs = document.querySelectorAll(".tabs a");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function (e) {
      afficherOnglet(this, true);
    });
  }

  var changeHash = function (e) {
    var hash = window.location.hash;
    var a = document.querySelector("a[href='" + hash + "']");
    if (a !== null && !a.parentNode.classList.contains("active")) {
      afficherOnglet(a, e !== undefined);
    }
  };

  window.addEventListener("hashchange", changeHash);
  changeHash();
})();
