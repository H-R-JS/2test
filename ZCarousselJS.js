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
    let root = this.createDivWithClass("carousel");
    let container = this.createDivWithClass("caroussel-container");
    root.appendChild(container);
    this.element.appendChild(root);
  }

  createDivWithClass(className) {
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
