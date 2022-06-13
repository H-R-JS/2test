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

///// THIRD TEST////////////////////////////////////////////////// (vocabulaire)

(function () {
  /*
    Lorsque l'on scroll
    Si le menu sors de l'écran
    alors il deviendra fixe
  */
  var scrollY = function () {
    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = (document.compatMode || "") === "CSS1Compat";

    return supportPageOffset
      ? window.pageYOffset
      : isCSS1Compat
      ? document.documentElement.scrollTop
      : document.body.scrollTop;
  };
  // cette function permet d'être comprit par toutes les versions des navigateurs, d'où sont utilité.

  // Selecteurs

  var elementS = document.querySelectorAll("[data-sticky]");

  for (i = 0; i < elementS.length; i++) {
    (function (element) {
      var rect = element.getBoundingClientRect(); // getBoundingClientRec () méthode permettant de retourner la position ( largeur et hauteur) de l'element par rapport à la gauche au haut de la page
      var offset = parseInt(element.getAttribute("data-offset") || 0, 10); // Soit l'offset est la valeur contenu par l'attrabu, OU il n'y a pas d'attribu dans ces cas là ce sera 0
      if (element.getAttribute("data-contraint")) {
        var contraint = document.querySelector(
          element.getAttribute("data-contraint")
        );
      } else {
        var contraint = document.body;
      }
      var contraintRect = contraint.getBoundingClientRect();
      var contraintBottom =
        contraintRect.top +
        scrollY() +
        contraintRect.height -
        offset -
        rect.height;
      var top = rect.top + scrollY();
      var fake = document.createElement("div");
      fake.style.width = rect.width + "px";
      fake.style.height = rect.height + "px";

      // Fonctions
      var onScroll = function () {
        if (
          scrollY() > contraintBottom &&
          element.style.position != "absolute"
        ) {
          element.style.position = "absolute";
          element.style.bottom = "0";
          element.style.top = "auto";
        } else if (
          scrollY() > top - offset &&
          element.style.position != "fixed"
        ) {
          element.classList.add("fixed");
          element.style.position = "fixed";
          element.style.top = offset + "px";
          element.style.bottom = "auto";
          element.style.width = rect.width + "px";
          element.parentNode.insertBefore(fake, element);
        } else if (
          scrollY() < top - offset &&
          element.style.position != "static"
        ) {
          element.classList.remove("fixed");
          element.style.position = "static";
          element.parentNode.removeChild(fake);
        }
      };

      var onResize = function () {
        // On recalcule tout pour que cela prenne la taille de l'écran lors de la modification de taille de la fenêtre.
        element.style.width = "auto";
        element.classList.remove("fixed");
        fake.style.display = "none";
        rect = element.getBoundingClientRect();
        top = rect.top + scrollY();
        fake.style.width = rect.width + "px";
        fake.style.height = rect.height + "px";
        fake.style.display = "block";
        onScroll();
      };

      // Listener
      window.addEventListener("scroll", onScroll); // On applique l'event scroll ( pour écouter le scroll de la souris) sur window car cela concerne toute la fenêtre et pas dans un scroll overflow
      window.addEventListener("resize", onResize); // On applique l'event scroll ( pour écouter le scroll de la souris) sur window car cela concerne toute la fenêtre et pas dans un scroll overflow
    })(elementS[i]);
  }
})();
