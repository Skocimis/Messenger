Grupa = function(paket) {
    var self = {};
    self.id = paket.id;
    self.naziv = paket.naziv;
    self.vlasnik = paket.vlasnik;
    self.clanovi = paket.clanovi || [];
    self.poruke = paket.poruke || [];
    Grupa.lista[self.id] = self;
    return self;
}
var trenutnagrupa = null;
Grupa.lista = {};
Grupa.nadjiGrupuPoNazivuIVlasniku = function(nazivivlasnik) {
    for (var i in Grupa.lista) {
        if (Grupa.lista[i].naziv == nazivivlasnik.naziv && Grupa.lista[i].vlasnik == nazivivlasnik.vlasnik) return Grupa.lista[i];
    }
    return null;
}
Grupa.prikaziSve = function() {
    selektSvihGrupa.innerHTML = "";
    selektSvihGrupa.size = Object.keys(Grupa.lista).length + 2; //Da ne bi bio 1
    for (var i in Grupa.lista) {
        var opcija = document.createElement("option");
        opcija.value = i;
        opcija.innerText = Grupa.lista[i].naziv + " (" + Grupa.lista[i].vlasnik + ")";
        selektSvihGrupa.appendChild(opcija);
    }
}