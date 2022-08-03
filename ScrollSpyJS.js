const ratio = 0.6;
let Observer = null;

const activate = function (element) {
  const id = element.getAttribute("id");
  const anchor = document.querySelector("a[href='#" + id + "']"); // L'ancre sur le menu

  if (anchor === null) {
    return null;
  }
  anchor.parentElement
    .querySelectorAll(".active")
    .forEach((node) => node.classList.remove("active"));
  anchor.classList.add("active");

  console.log(anchor);
};

const callBack = function (entries) {
  // calback qui va dans le param de Observer
  entries.forEach(function (entry) {
    if (entry.intersectionRatio > 0) {
      activate(entry.target);
    }
  });
};

const spies = document.querySelectorAll("[data-spy]");

const observe1 = function (elems) {
  console.log("yes");
  if (Observer !== null) {
    elems.forEach((elem) => Observer.unobserve(elem));
  }
  const y = Math.round(window.innerHeight * ratio);
  Observer = new IntersectionObserver(callBack, {
    rootMargin: `-${window.innerHeight - y - 1}px 0px -${y}px 0px`, // permet de voir section 1 dans le premier calcul
  });
  spies.forEach((elem) => Observer.observe(elem));
};

const debounce = function (callback, delay) {
  let timer;
  return function () {
    let args = arguments;
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, delay);
  };
};

if (spies.length > 0) {
  observe1(spies);
  let windowH = window.innerHeight;
  window.addEventListener(
    "resize",
    debounce(function () {
      if (window.innerHeight !== windowH) {
        console.log("test");
        observe1(spies);
        windowH = window.innerHeight;
      }
    }, 500)
  );
}
