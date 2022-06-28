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
    let root = this.createDivWithClass("carousel");
    this.container = this.createDivWithClass("carousel-container");
    root.appendChild(this.container);
    this.element.appendChild(root);
    this.items = children.map((child) => {
      let item = this.createDivWithClass("carousel-item");
      item.appendChild(child);
      this.container.appendChild(item);
      return item; // créer un div de item
    });
    this.setStyle(); // appel la fonction de calcul d'emplacement
  }

  setStyle() {
    let ratio = this.items.length / this.options.slidesVisible; // Calcule le fait que enfant soit 3 devant nous en prenant la place adéquat
    this.container.style.width = ratio * 100 + "%";
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
    slidesToScroll: 3,
    slidesVisible: 3,
  });
});
