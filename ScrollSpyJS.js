const activate = function (element) {
  const id = element.getAttribute("id");
  const anchor = document.querySelector("a[href='#" + id + "']");

  if (anchor === null) {
    return null;
  }
  anchor.classList.add("active");

  console.log(anchor);
};

const callBack = function (entries, observer) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio > 0) {
      activate(entry.target);
    }
  });
};

const spies = document.querySelectorAll("[data-spy]");

if (spies.length > 0) {
  const Observer = new IntersectionObserver(callBack, {});
  spies.forEach(function (spy) {
    Observer.observe(spy);
  });
}
