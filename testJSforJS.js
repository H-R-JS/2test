var eleve = function (nom) {
  this.nom = nom;
};

eleve.prototype.moyenne = function () {
  return 10;
};

eleve.prototype.present = function () {
  return this.nom + "présent !";
};

var Delegue = function (nom) {
  eleve.call(this, nom);
  this.role = "delegue";
};

Delegue.prototype = Object.create(eleve.prototype);
Delegue.prototype.constructor = Delegue;

Delegue.prototype.moyenne = function () {
  return 20;
};

var Jean = new eleve("jean");
var Marc = new Delegue("marc");
