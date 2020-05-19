Grupa = function(param) { //param sadrzi naziv grupe, socketid vlasnika i socketidjeve svih clanova grupe
    self = {};
    self.id = Math.random();
    self.vlasnik = param.vlasnik; //String
    self.naziv = param.naziv;
    self.clanovi = param.clanovi; //Svi clanovi grupe
    self.socketi = param.socketi; //Socketi aktivnih clanova

    //broadcastuj("napravljenaGrupa", { id: self.id, korisnicko_ime: self.korisnicko_ime });
    Grupa.lista[self.id] = self;
    return self;
}
Grupa.lista = {};
Grupa.ucitaj = function(param) { //Ucitava grupu u odnosu na podatke iz baze
    /*var grupa = */
    Grupa(param);
}
Grupa.inicijalizujPostojece = function(korisnicko_ime) { //Grupa.inicijalizujpostojece, pravi init pack za jednog korisnika
    var grupe = [];
    for (var i in Grupa.lista) {
        if (Grupa.lista[i].clanovi.includes(korisnicko_ime)) {
            grupe.push({ naziv: Grupa.lista[i].nziv, vlasnik: Grupa.lista[i].vlasnik, clanovi: Grupa.lista[i].clanovi });
        }
    }
    return grupe;
}
Korisnik.priOdjavljivanju = function(socket) {
    let korisnik = Korisnik.lista[socket.id];
    if (!korisnik) return;
    broadcastuj("odjavljenKorisnik", { id: socket.id });
    delete Korisnik.lista[socket.id];
}