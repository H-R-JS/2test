var demo = "     lol    ";
console.log(_.trim(demo));

var demo2 = "bam";
console.log(_.pad(demo2, 9, "L"));

var demo3 = "bim";
console.log(_.padStart(demo3, 9, "L"));

var demo3 = "bom";
console.log(_.padEnd(demo3, 9, "L"));

var demo3 = "non il y a pas";
console.log(_.capitalize(demo3));

var demo3 = "non il y a pas";
console.log(_.snakeCase(demo3));

var demo3 = "non il y a pas";
console.log(_.kebabCase(demo3));

var demo3 = "non__il__y_a ____pas";
console.log(_.upperCase(demo3));

var tab1 = [1, 2];
var tab2 = [3, 4];
console.log(_.concat(tab1, tab2, 10, 7));

var comment = { username: "will", content: "uuuh fuck" };
var tab1 = [1, 2];
var tab2 = [3, comment, 4];
console.log(_.without(tab1, 2));
console.log(_.without(tab2, comment));

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];
console.log(
  _.filter(users, function (user) {
    // retourne un tableau
    return user.active;
  })
);

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];
console.log(_.find(users, { active: false })); // retourne la première valeur

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];
console.log(_.orderBy(users, ["user", "age"], ["asc", "desc"]));
console.log(_.orderBy(users, "user", "asc"));

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];
console.log(
  _.map(users, function (user) {
    return user.age; // = user.age * 2
  })
);

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];

_.forEach(users, function (user, key) {
  console.log(key, "=>", user.user);
});

/*_.forEach(users[0], function (value, key) {
  console.log(key, "=>", value);
});*/

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];

console.log(_.sample(users));
//console.log(_.sampleSize(users, 2));

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];

console.log(
  _.groupBy(users, function (user) {
    return user.user.substr(0, 1);
  })
);

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];

console.log(_.size(users));

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];

var user = users[0];

var user2 = _.clone(user); // cela dissoci la tableau user et user2

user2.age = user2.age * 3;

console.log(user2);

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];

var user = users[0];

var user2 = _.clone(user);

_.assign(user2, { active: true, age: 2 });
// OU  var user2 = _.assign({}, user, {active: true, age: 2})

console.log(user2);

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];

var user = users[0];

var user2 = _.assign({}, user, { active: true, age: 2 });

_.unset(user2, "age");
console.log(user2);

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];

var user = users[0];

var user2 = _.assign({}, user, {
  user: { firstname: "john", lastname: "doe" },
  active: true,
  age: 2,
});

_.unset(user2, "user.firstname");
console.log(user2);

var users = [
  { user: "fred", age: 40, active: false },
  { user: "barney", age: 35, active: true },
  { user: "lucie", age: 9, active: true },
];

var user = users[0];

var user2 = _.assign({}, user, {
  user: { firstname: "john", lastname: "doe" },
  active: true,
  age: 2,
});

_.set(user2, "user.firstname", "Jonathan");
console.log(user2);

var user2 = { active: true, age: 2 };

if (_.has(user2, "user.firstname") && user2.user.firstname === "demo") {
  console.log("ok");
}

var user2 = { user: { firstname: "demo" }, active: true, age: 2 };

if (_.get(user2, "user.firstname", false) === "demo") {
  console.log("ok");
}

window.addEventListener(
  "scroll",
  _.debounce(function () {
    console.log("yes");
  }, 300)
);

window.addEventListener(
  "scroll",
  _.throttle(function () {
    console.log("yes");
  }, 300)
);

// POUR INCLURE DU LODASH SANS TOUTES LES METHODES AVEC LE CDN DANS LE HEAD HTML
// IL SUFFIT DE CREER UNE VARIABLE QUI VA CONTENIR UN "require" AVEC LE LODASH EST LE NOM DE LA METHODE
// CELA PERMET D'UTILISER SIMPLEMENT LA VARIABLE SANS L'UNDERSCOR ET D'AVOIR UN CODE PLUS OPTI SANS LE LIEN

var throttle = require("lodash/throttle");

window.addEventListener(
  "scroll",
  throttle(function () {
    console.log("yes");
  }, 300)
);
