Grupa = function(paket) {
    var self = {};
    self.id = Math.random();
    self.naziv = paket.naziv;
    self.vlasnik = paket.vlasnik;
    self.clanovi = paket.clanovi || [];
    self.aktivni = paket.aktivni || [];
    self.poruke = paket.poruke || [];
    Grupa.lista[self.id] = self;
    return self;
}
var trenutnagrupa = null;
Grupa.lista = {};
Grupa.nadjiGrupuPoNazivuIVlasniku = function(nazivivlasnik) {
    for (var i in Grupa.lista) {
        if (Grupa.lista[i] && Grupa.lista[i].naziv == nazivivlasnik.naziv && Grupa.lista[i].vlasnik == nazivivlasnik.vlasnik) return Grupa.lista[i];
    }
    return null;
}
Grupa.prikaziSve = function() {
    selektSvihGrupa.innerHTML = "";
    selektSvihGrupa.size = Object.keys(Grupa.lista).length + 2; //Da ne bi bio 1
    for (var i in Grupa.lista) {
        if (Grupa.lista[i]) {
            var opcija = document.createElement("option");
            opcija.value = i;
            opcija.innerText = Grupa.lista[i].naziv + " (" + Grupa.lista[i].vlasnik + ")";
            selektSvihGrupa.appendChild(opcija);
        }
    }
}
Grupa.prikaziOpcije = function() {
    if (!trenutnagrupa) return;
    opcijeCont.style.display = "block";
    var tr = this.nadjiGrupuPoNazivuIVlasniku({ naziv: trenutnagrupa.naziv, vlasnik: trenutnagrupa.vlasnik });
    if (!tr) return;

    if (tr.vlasnik == Korisnik.lista[selfId].korisnicko_ime) {
        smrtnikKomande.style.display = "none";
        adminKomande.style.display = "block";
    } else {
        smrtnikKomande.style.display = "block";
        adminKomande.style.display = "none";
    }
    selektAktivnihClanova.innerHTML = "";
    selektSvihClanova.innerHTML = "";
    selektAktivnihClanova.size = tr.aktivni.length + 1;
    selektSvihClanova.size = tr.clanovi.length + 1; //Da ne bi bio 1
    for (var i in tr.aktivni) {
        var opcija = document.createElement("option");
        opcija.value = i;
        opcija.innerText = tr.aktivni[i];
        selektAktivnihClanova.appendChild(opcija);
    }
    for (var i in tr.clanovi) {
        var opcija = document.createElement("option");
        opcija.value = i;
        opcija.innerText = tr.clanovi[i];
        selektSvihClanova.appendChild(opcija);
    }
}