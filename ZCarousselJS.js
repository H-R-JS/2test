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
      this.container.appendChild(item);
      return item; // créer un div de item
    });
    this.setStyle(); // appel la fonction de calcul d'emplacement
    this.createNavigation();
    this.moveCallbacks.forEach((callB) => callB(0));
    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize.bind(this));
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

  next() {
    this.gotoItem(this.currentItem + this.slidesToScroll); // appel gotoItem et calcul en paramètre l'index par rapport à celui initialisé
  }

  prev() {
    this.gotoItem(this.currentItem - this.slidesToScroll);
  }

  gotoItem(index) {
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
    this.container.style.transform = "translate3d(" + translateX + "%, 0, 0)";
    this.currentItem = index;
    this.moveCallbacks.forEach((callB) => callB(index));
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

document.addEventListener("DOMContentLoaded", function () {
  new Carousel(document.querySelector("#carousel1"), {
    slidesToScroll: 1,
    slidesVisible: 3,
    loop: false,
  });

  new Carousel(document.querySelector("#carousel2"), {
    slidesToScroll: 2,
    slidesVisible: 3,
    loop: false,
  });
});
