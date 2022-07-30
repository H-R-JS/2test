const ratio = 0.2;
const options = {
  root: null, // element de zone d'affichage ( null car il n'y a pas d'élément car on veut l'ecran)
  rootMargin: "0px", // Permet d'insérer des marges, si on dépasse cette marge alors l'element devient visible
  threshold: 0.2, // à partir de quel moment ( au niveau de l'element) le système de detersection va être detecté ( 1.0 c'est l'entièreté de l'element qui doit être sur l'écran pour qu'il s'affiche)
};

const handleIntersect = function (entries, observer) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio > ratio) {
      entry.target.classList.add("reveal-visible");
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(handleIntersect, options);
observer.observe(document.querySelector(".reveal"));
