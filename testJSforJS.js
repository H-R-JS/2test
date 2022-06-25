var eleve = function (nom) {
  this.nom = nom;
};

eleve.prototype.moyenne = function () {
  var somme = 0;
  this.notes.forEach(function (note, index) {
    somme += this.notes[index];
  }, this);
  return Math.round(somme / this.notes.length);
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

var Jean = new eleve("jean");
Jean.notes = [10, 15];
var Marc = new Delegue("marc");
