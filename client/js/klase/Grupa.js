Grupa = function(paket) {
    var self = {};
    self.id = paket.id;
    self.naziv = paket.naziv;
    self.vlasnik = paket.vlasnik;
    self.clanovi = paket.clanovi || [];
    Grupa.lista[self.id] = self;
    return self;
}
Grupa.lista = {};
Grupa.prikaziSve = function() {
    selektSvihGrupa.innerHTML = "";
    selektSvihGrupa.size = Object.keys(Grupa.lista).length + 2; //Da ne bi bio 1
    for (var i in Grupa.lista) {
        var opcija = document.createElement("option");
        opcija.value = i;
        opcija.innerText = Grupa.lista[i].naziv;
        selektSvihGrupa.appendChild(opcija);
    }
}