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
