Grupa = function(paket) {
    var self = {};
    self.id = Math.random();
    self.naziv = paket.naziv;
    self.vlasnik = paket.vlasnik;
    self.clanovi = paket.clanovi || [];
    self.aktivni = paket.aktivni || [];
    self.poruke = paket.poruke || [];
    self.img = document.createElement("img");
    self.img.src = "client/img/Novaporuka.png";
    self.img.style.width = "20px";
    self.img.style.height = "20px";
    self.img.style.marginBottom = "4px";
    self.img.style.marginLeft = "6px";
    self.img.style.display = "none";
    self.img.alt = "#";
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
        imgSvi.style.display = "none";
    }
    svi.appendChild(imgSvi);
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
                Grupa.lista[k].img.style.display = "none";
                Poruka.prikaziPoruke();
                divCaskanja.scrollTop = divCaskanja.scrollHeight;
            }
            a.appendChild(Grupa.lista[k].img);
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
        //alert(i);
        var a = document.createElement("a");
        a.href = "#";
        let k = i;
        a.innerText = tr.aktivni[k];
        a.onclick = function() {
            trenutnagrupa = null;
            trenutnirazgovor = tr.aktivni[k];
            Korisnik.nadjiKorisnikaPoImenu(trenutnirazgovor).img.style.display = "none";
            if (Korisnik.lista[k])
                Korisnik.lista[k].img.style.display = "none";
            Poruka.prikaziPoruke();
            divCaskanja.scrollTop = divCaskanja.scrollHeight;
            opcijeCont.style.display = "none";
        }
        listaAktivnihClanova.appendChild(a);
    }
    for (var i in tr.clanovi) {
        var a = document.createElement("a");
        a.href = "#";
        let k = i;
        a.innerText = tr.clanovi[k];
        a.onclick = function() {
            trenutnagrupa = null;
            trenutnirazgovor = tr.clanovi[k];
            Korisnik.nadjiKorisnikaPoImenu(trenutnirazgovor).img.style.display = "none";
            Poruka.prikaziPoruke();
            divCaskanja.scrollTop = divCaskanja.scrollHeight;
            opcijeCont.style.display = "none";
        }
        listaSvihClanova.appendChild(a);
    }
}