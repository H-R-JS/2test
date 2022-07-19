/**
 * Permet de calculer la navigation tactile pour le carousel
 */

class CarouselTouchPlugin {
  /**
   *
   * @param {Carousel} carousel
   */
  constructor(carousel) {
    carousel.container.addEventListener("dragstart", (e) => e.preventDefault());
    carousel.container.addEventListener("mousedown", this.startDrag.bind(this));
    carousel.container.addEventListener(
      "touchstart",
      this.startDrag.bind(this)
    );
    window.addEventListener("mousemove", this.drag.bind(this));
    window.addEventListener("touchmove", this.drag.bind(this));
    window.addEventListener("touchend", this.endDrag.bind(this));
    window.addEventListener("mouseup", this.endDrag.bind(this));
    window.addEventListener("touchCancel", this.endDrag.bind(this));
    this.carousel = carousel;
  }

  /**
   * Demarre le déplacement au touché
   * @pram (MouseEvent | TouchStart)
   */
  startDrag(e) {
    if (e.touches) {
      // Permet d'écouter s'il y a contact sur l'ecran avec "touches"
      if (e.touches.length > 1) {
        return;
      } else {
        e = e.touches[0]; // On prend le premier point de contact
      }
    }
    this.origin = { x: e.screenX, y: e.screenY };
    this.width = this.carousel.containerWidth;
    this.carousel.disableTransition();
    console.log("no");
  }

  drag(e) {
    if (this.origin) {
      let point = e.touches ? e.touches[0] : e;
      let translate = {
        x: point.screenX - this.origin.x,
        y: point.screenY - this.origin.y,
      };
      if (e.touches && Math.abs(translate.x) > Math.abs(translate.y)) {
        e.preventDefault;
        e.stopPropagation;
      }
      let baseTranslate =
        (this.carousel.currentItem * -100) /*pour la gauche (-)*/ /
        this.carousel.items.length; // Règle de trois pour calculer un pourcentage
      this.lastTranslate = translate;
      this.carousel.translate(baseTranslate + (100 * translate.x) / this.width);
    }
    console.log("yes");
  }

  /**
   * fin du déplacement
   * @pram (MouseEvent | Touchend)
   */

  endDrag(e) {
    if (this.origin && this.lastTranslate) {
      this.carousel.enableTransition();
      if (Math.abs(this.lastTranslate.x / this.carousel.carouselWidth) > 0.2) {
        // Math.abs retourne une valeur absolu donc sans négatit ou positif
        // Donne une valeur entre 1 et 0
        if (this.lastTranslate.x < 0) {
          this.carousel.next();
        } else {
          this.carousel.prev();
        }
      } else {
        this.carousel.gotoItem(this.carousel.currentItem);
      }
      this.origin = null; // plus aucune raison de son existence une fois le drag relaché
    }
  }
}

class Carousel {
  /**
   * @callback moveCallbacks
   * @param (number) index
   *
   */
  /**
   *
   * @param {HTMLElement} element
   * @param {Object} options
   * @param {Object} {options.slidesToScroll=1} Nombre d'éléments à faire défiler
   * @param {Object} {options.slidesVisible=1} Nombre d'éléments visible dans un slide
   * @param {Boolean} {options.loop=false} Doit on boucler en fin de slide
   * @param {boolean} {options.pagination=false}
   * @param {boolean} {options.navigation=true}
   * @param {boolean} {options.infinite=false}
   */

  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign(
      // Le premier argument est l'object qui sera "set" ( vide c'est un nouvel objet) avec les autre argument qui seront "get"
      // Dans ce cas ci on met des propriétés par défaut, qui seront remplacer par les suivantes en arguments ci elles y sont, sinon par défaut reprendra le relet
      {},
      {
        slidesToScroll: 1,
        slidesVisible: 1,
        loop: false,
        pagination: false,
        navigation: true,
        infinite: false,
      },
      options
    );
    if (this.options.loop && this.options.infinite) {
      throw new Error("Loop et infinite ne sont pas compatible"); // Lance une nouvelle erreur ce qui bloque le code et renvoir l'erreur dans la console
    }
    let children = [].slice.call(element.children); // variable array contenant les element enfants ( slice transfert les enfants dans le nouveau tableau, en l'appelant dans le tableau créer et non celui de slice)
    this.isMobile = false;
    this.currentItem = 0;
    this.root = this.createDivWithClass("carousel");
    this.container = this.createDivWithClass("carousel-container");
    this.root.appendChild(this.container);
    this.element.appendChild(this.root);
    this.moveCallbacks = [];
    this.offset = 0;
    this.items = children.map((child) => {
      let item = this.createDivWithClass("carousel-item");
      item.appendChild(child);
      return item; // créer un div de item
    });

    if (this.options.infinite) {
      // Si infinite = true, alors on va créer un système créant plusieurs tableau avec les items
      this.offset = this.options.slidesVisible + this.options.slidesToScroll;
      if (this.offset > children.length) {
        console.error("Offset trop haut par rapport au elements"); // Cela renvoit seulement une erreur dans la console, ça ne bloque aucun code
      }
      this.items = [
        ...this.items // on concate avec ...
          .slice(this.items.length - this.offset) // on récupère les 5 derniers element pour les mettre devant
          .map((item) => item.cloneNode(true)),
        ...this.items, // Les elements en tout
        ...this.items
          .slice(0, this.offset) // on récupère les 5 premiers element pour les mettre après
          .map((item) => item.cloneNode(true)), // on clone dans un nouveau tableau "map" avec true pour cloner les enfants
      ];
      this.gotoItem(this.offset, false);
    }
    this.items.forEach((item) => this.container.appendChild(item)); // pour chaque element on l'installe dans le container
    this.setStyle(); // appel la fonction de calcul d'emplacement
    if (this.options.navigation) {
      this.createNavigation();
    }
    if (this.options.pagination) {
      this.createPagination();
    }

    //EVENEMENTS
    this.moveCallbacks.forEach((callB) => callB(this.currentItem));
    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize.bind(this));
    if (this.options.infinite) {
      this.container.addEventListener(
        "transitionend",
        this.resetInfinite.bind(this)
      );
    }
    new CarouselTouchPlugin(this);
  }

  createNavigation() {
    let nextButton = this.createDivWithClass("carousel-next");
    let prevButton = this.createDivWithClass("carousel-prev");
    this.root.appendChild(nextButton);
    this.root.appendChild(prevButton);
    nextButton.addEventListener("click", this.next.bind(this));
    prevButton.addEventListener("click", this.prev.bind(this));
    if (this.options.loop === true) {
      return;
    }
    this.onMove((index) => {
      // Permet de rendre les buttons invisible en fonction de l'emplacement de l'index
      if (index === 0) {
        prevButton.classList.add("carousel-prev-hidden");
      } else {
        prevButton.classList.remove("carousel-prev-hidden");
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add("carousel-next-hidden");
      } else {
        nextButton.classList.remove("carousel-next-hidden");
      }
    });
  }

  createPagination() {
    let pagination = this.createDivWithClass("carousel-pagination");
    let buttons = [];
    this.root.appendChild(pagination);
    for (
      let i = 0;
      i < this.items.length - 2 * this.offset;
      i = i + this.options.slidesToScroll
    ) {
      let button = this.createDivWithClass("carousel-pagination-button");
      button.addEventListener("click", () => this.gotoItem(i + this.offset));
      pagination.appendChild(button);
      buttons.push(button);
    }
    this.onMove((index) => {
      let count = this.items.length - 2 * this.offset;
      let activeButton =
        buttons[
          Math.floor(
            ((index - this.offset) % count) / this.options.slidesToScroll
          )
        ];
      if (activeButton) {
        buttons.forEach((button) =>
          button.classList.remove("carousel-pagination-button--active")
        );
        activeButton.classList.add("carousel-pagination-button--active");
      }
    });
  }

  translate(percent) {
    // Pour deplacer avec le doigt
    this.container.style.transform = "translate3d(" + percent + "%, 0, 0)";
  }

  next() {
    this.gotoItem(this.currentItem + this.slidesToScroll); // appel gotoItem et calcul en paramètre l'index par rapport à celui initialisé
  }

  prev() {
    this.gotoItem(this.currentItem - this.slidesToScroll);
  }

  /**
   * Deplace le carousel vers l'élément ciblé
   * @param {number} index
   * @param {boolean} {animation=true}
   */

  gotoItem(index, animation = true) {
    if (index < 0) {
      index = this.items.length - this.options.slidesVisible;
    } else if (
      index >= this.items.length ||
      (this.items[this.currentItem + this.options.slidesVisible] ===
        undefined &&
        index > this.currentItem)
    ) {
      index = 0;
    }
    let translateX = (index * -100) / this.items.length; // cacule le déplacement en fonction de l'index donné
    if (animation === false) {
      this.disableTransition();
    }
    this.translate(translateX);
    this.container.style.transform = "translate3d(" + translateX + "%, 0, 0)";
    this.container.offsetHeight; // recupère une propriété pour forcer l'usage de la prochaine condition
    if (animation === false) {
      this.enableTransition();
    }
    this.currentItem = index;
    this.moveCallbacks.forEach((callB) => callB(index));
  }

  resetInfinite() {
    // créer l'effet d'infini en deplaçant le this.container
    if (this.currentItem <= this.options.slidesToScroll) {
      this.gotoItem(
        this.currentItem + this.items.length - 2 * this.offset,
        false
      );
    } else if (this.currentItem >= this.items.length - this.offset) {
      this.gotoItem(
        this.currentItem - (this.items.length - 2 * this.offset),
        false
      );
    }
  }

  /**
   *
   * @param {moveCallbacks} callB
   */

  onMove(callB) {
    this.moveCallbacks.push(callB);
  }

  onWindowResize() {
    let mobile = window.innerWidth < 800;
    if (mobile !== this.isMobile) {
      this.isMobile = mobile;
      this.setStyle();
      this.moveCallbacks.forEach((callB) => callB(this.currentItem));
    }
  }

  /**
   * Applique les bonnes dimensions aux élements du carousel
   */

  setStyle() {
    let ratio = this.items.length / this.slidesVisible; // Calcule le fait que enfant soit 3 devant nous en prenant la place adéquat
    this.container.style.width = ratio * 100 + "%"; // en pourcentage pour l'adaptation automatique à la fenêtre
    this.items.forEach(
      (item) => (item.style.width = 100 / this.slidesVisible / ratio + "%") // Pour chaque item le calcul de son emplacement dans l'itération
    );
  }

  /**
   *
   * @param {string} className
   * @returns {HTMLElement}
   */
  createDivWithClass(className) {
    // Créer un div avec une class
    let div = document.createElement("div");
    div.classList.add(className);
    return div;
  }

  disableTransition() {
    this.container.style.transition = "none";
  }

  enableTransition() {
    this.container.style.transition = "";
  }

  /**
   * @return (number)
   */

  get slidesToScroll() {
    return this.isMobile ? 1 : this.options.slidesToScroll;
  }

  /**
   * @return (number)
   */

  get slidesVisible() {
    return this.isMobile ? 1 : this.options.slidesVisible;
  }

  /**
   * @return (number)
   */

  get containerWidth() {
    return this.container.offsetWidth;
  }

  /**
   * @return (number)
   */

  get carouselWidth() {
    return this.root.offsetWidth;
  }
}

var onReady = function () {
  new Carousel(document.querySelector("#carousel1"), {
    slidesToScroll: 1,
    slidesVisible: 3,
    pagination: true,
    infinite: true,
  });

  new Carousel(document.querySelector("#carousel2"), {
    slidesToScroll: 1,
    slidesVisible: 3,
    pagination: true,
    infinite: true,
  });
};
if (document.readyState !== "loading") {
  onReady();
}
document.addEventListener("DOMContentLoaded", onReady);
