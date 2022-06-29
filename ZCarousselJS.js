class Carousel {
  /**
   *
   * @param {HTMLElement} element
   * @param {Object} options
   * @param {Object} options.slidesToScroll Nombre d'éléments à faire défiler
   * @param {Object} options.slidesVisible Nombre d'éléments visible dans un slide
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
      },
      options
    );
    let children = [].slice.call(element.children); // variable array contenant les element enfants ( slice transfert les enfants dans le nouveau tableau, en l'appelant dans le tableau créer et non celui de slice)
    this.currentItem = 0;
    this.root = this.createDivWithClass("carousel");
    this.container = this.createDivWithClass("carousel-container");
    this.root.appendChild(this.container);
    this.element.appendChild(this.root);
    this.items = children.map((child) => {
      let item = this.createDivWithClass("carousel-item");
      item.appendChild(child);
      this.container.appendChild(item);
      return item; // créer un div de item
    });
    this.setStyle(); // appel la fonction de calcul d'emplacement
    this.createNavigation();
  }

  createNavigation() {
    let nextButton = this.createDivWithClass("carousel-next");
    let prevButton = this.createDivWithClass("carousel-prev");
    this.root.appendChild(nextButton);
    this.root.appendChild(prevButton);
    nextButton.addEventListener("click", this.next.bind(this));
    prevButton.addEventListener("click", this.prev.bind(this));
  }

  next() {
    this.gotoItem(this.currentItem + this.options.slidesToScroll); // appel gotoItem et calcul en paramètre l'index par rapport à celui initialisé
  }

  prev() {
    this.gotoItem(this.currentItem - this.options.slidesToScroll);
  }

  gotoItem(index) {
    if (index < 0) {
      index = this.items.length - this.options.slidesVisible;
    } else if (
      index >= this.items.length ||
      this.items[this.currentItem + this.options.slidesVisible] === undefined
    ) {
      index = 0;
    }
    let translateX = (index * -100) / this.items.length; // cacule le déplacement en fonction de l'index donné
    this.container.style.transform = "translate3d(" + translateX + "%, 0, 0)";
    this.currentItem = index;
    console.log(index);
  }

  /**
   * Applique les bonnes dimensions aux élements du carousel
   */

  setStyle() {
    let ratio = this.items.length / this.options.slidesVisible; // Calcule le fait que enfant soit 3 devant nous en prenant la place adéquat
    this.container.style.width = ratio * 100 + "%"; // en pourcentage pour l'adaptation automatique à la fenêtre
    this.items.forEach(
      (item) =>
        (item.style.width = 100 / this.options.slidesVisible / ratio + "%") // Pour chaque item le calcul de son emplacement dans l'itération
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
}

document.addEventListener("DOMContentLoaded", function () {
  new Carousel(document.querySelector("#carousel1"), {
    slidesToScroll: 1,
    slidesVisible: 3,
  });
});
