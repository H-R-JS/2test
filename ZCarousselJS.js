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
    let children = [].slice.call(element.children); // variable array contenant les element enfants ( slice transfert les enfants dans le nouveau tableau, en l'appelant dans le tableau créer et non celui de slice)
    this.isMobile = false;
    this.currentItem = 0;
    this.root = this.createDivWithClass("carousel");
    this.container = this.createDivWithClass("carousel-container");
    this.root.appendChild(this.container);
    this.element.appendChild(this.root);
    this.moveCallbacks = [];
    this.items = children.map((child) => {
      let item = this.createDivWithClass("carousel-item");
      item.appendChild(child);
      return item; // créer un div de item
    });

    if (this.options.infinite) {
      // Si infinite = true, alors on va créer un système créant plusieurs tableau avec les items
      let offset = this.options.slidesVisible * 2 - 1;
      this.items = [
        ...this.items // on concate avec ...
          .slice(this.items.length - offset) // on récupère les 5 derniers element pour les mettre devant
          .map((item) => item.cloneNode(true)),
        ...this.items, // Les elements en tout
        ...this.items
          .slice(0, offset) // on récupère les 5 premiers element pour les mettre après
          .map((item) => item.cloneNode(true)), // on clone dans un nouveau tableau "map" avec true pour cloner les enfants
      ];
      this.gotoItem(offset, false);
      console.log(this.items);
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
      i < this.items.length;
      i = i + this.options.slidesToScroll
    ) {
      let button = this.createDivWithClass("carousel-pagination-button");
      button.addEventListener("click", () => this.gotoItem(i));
      pagination.appendChild(button);
      buttons.push(button);
    }
    this.onMove((index) => {
      let activeButton =
        buttons[Math.floor(index / this.options.slidesToScroll)];
      if (activeButton) {
        buttons.forEach((button) =>
          button.classList.remove("carousel-pagination-button--active")
        );
        activeButton.classList.add("carousel-pagination-button--active");
      }
    });
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
      this.container.style.transition = "none";
    }
    this.container.style.transform = "translate3d(" + translateX + "%, 0, 0)";
    this.container.offsetHeight; // recupère une propriété pour forcer l'usage de la prochaine condition
    if (animation === false) {
      this.container.style.transition = "";
    }
    this.currentItem = index;
    this.moveCallbacks.forEach((callB) => callB(index));
  }

  resetInfinite() {
    // créer l'effet d'infini en deplaçant le this.container
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
}

var onReady = function () {
  new Carousel(document.querySelector("#carousel1"), {
    slidesToScroll: 1,
    slidesVisible: 3,
    loop: true,
    pagination: true,
  });

  new Carousel(document.querySelector("#carousel2"), {
    slidesToScroll: 2,
    slidesVisible: 3,
    loop: true,
    pagination: true,
    infinite: true,
  });
};
if (document.readyState !== "loading") {
  onReady();
}
document.addEventListener("DOMContentLoaded", onReady);
