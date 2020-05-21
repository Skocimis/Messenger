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
    if (!nazivivlasnik.vlasnik) {
        for (var i in Grupa.lista) {
            if (Grupa.lista[i] && Grupa.lista[i].naziv == nazivivlasnik.naziv) return Grupa.lista[i];
        }
        return null;
    }
    for (var i in Grupa.lista) {
        if (Grupa.lista[i] && Grupa.lista[i].naziv == nazivivlasnik.naziv && Grupa.lista[i].vlasnik == nazivivlasnik.vlasnik) return Grupa.lista[i];
    }
    return null;
}
Grupa.prikaziSve = function() {
    listaGrupa.innerHTML = "";
    let svi = document.createElement("a");
    svi.href = "#";
    if (Korisnik.lista[selfId])
        svi.innerText = "#SVI";
    svi.onclick = function() {
        trenutnagrupa = null;
        trenutnirazgovor = null;
        Poruka.prikaziPoruke();
        divCaskanja.scrollTop = divCaskanja.scrollHeight;
        opcijeCont.style.display = "none";
    }
    listaGrupa.appendChild(svi);
    for (var i in Grupa.lista) {
        if (Grupa.lista[i]) {
            var a = document.createElement("a");
            a.href = "#";
            a.innerText = Grupa.lista[i].naziv + " (" + Grupa.lista[i].vlasnik + ")";
            let k = i;
            a.onclick = function() {
                if (!Grupa.lista[k]) return;
                trenutnagrupa = { naziv: Grupa.lista[k].naziv, vlasnik: Grupa.lista[k].vlasnik };
                trenutnirazgovor = null;
                Poruka.prikaziPoruke();
                divCaskanja.scrollTop = divCaskanja.scrollHeight;
            }
            listaGrupa.appendChild(a);
        }
    }

}
Grupa.prikaziOpcije = function() {
    if (!trenutnagrupa) return (opcijeCont.style.display = "none");
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
    listaAktivnihClanova.innerHTML = "";
    listaSvihClanova.innerHTML = "";
    for (var i in tr.aktivni) {
        var a = document.createElement("a");
        a.href = "#";
        a.innerText = tr.aktivni[i];
        a.onclick = function() {
            trenutnagrupa = null;
            trenutnirazgovor = tr.aktivni[i];
            Poruka.prikaziPoruke();
            divCaskanja.scrollTop = divCaskanja.scrollHeight;
            opcijeCont.style.display = "none";
        }
        listaAktivnihClanova.appendChild(a);
    }
    for (var i in tr.clanovi) {
        var a = document.createElement("a");
        a.href = "#";
        a.innerText = tr.clanovi[i];
        a.onclick = function() {
            trenutnagrupa = null;
            trenutnirazgovor = tr.clanovi[i];
            Poruka.prikaziPoruke();
            divCaskanja.scrollTop = divCaskanja.scrollHeight;
            opcijeCont.style.display = "none";
        }
        listaSvihClanova.appendChild(a);
    }
}