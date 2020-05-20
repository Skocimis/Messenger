Grupa = function(param) { //param sadrzi naziv grupe, socketid vlasnika i socketidjeve svih clanova grupe
    self = {};
    self.id = Grupa.lista.length;
    self.vlasnik = param.vlasnik; //String
    self.naziv = param.naziv;
    self.clanovi = param.clanovi; //Svi clanovi grupe
    self.socketi = param.socketi || []; //Socketi aktivnih clanova

    //broadcastuj("napravljenaGrupa", { id: self.id, korisnicko_ime: self.korisnicko_ime });
    Grupa.lista.push(self);
    //return self;
}
Grupa.lista = [];
Grupa.ucitaj = function(param) { //Ucitava grupu u odnosu na podatke iz baze
    /*var grupa = */
    Grupa(param);
}
Grupa.napraviGrupu = function(podci) {

}

/*Korisnik.priOdjavljivanju = function(socket) {
    let korisnik = Korisnik.lista[socket.id];
    if (!korisnik) return;
    broadcastuj("odjavljenKorisnik", { id: socket.id });
    delete Korisnik.lista[socket.id];
}*/