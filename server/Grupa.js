Grupa = function(param) { //param sadrzi naziv grupe, socketid vlasnika i socketidjeve svih clanova grupe
    self = {};
    self.id = Grupa.lista.length;
    self.vlasnik = param.vlasnik; //String
    self.naziv = param.naziv;
    self.clanovi = param.clanovi; //Svi clanovi grupe
    self.socketi = param.socketi || []; //Socketi aktivnih clanova, ovo treba da dodam da se apdejtuje kad se korisnici loguju u izloguju
    self.updatujKodClanova = function() { //Novi clan, removovan clan, ulogovao se clan, izlogovao se clan, salje obavestenje svim aktivnim clanovima
        var onlajnclanovi = [];
        for (var i in self.socketi) {
            onlajnclanovi.push(Korisnik.lista[self.socketi[i]].korisnicko_ime);
        }
        for (var i in self.socketi) {
            SOCKET_LIST(self.socketi[i]).emit("noviClanovi", { vlasnik: self.vlasnik, naziv: self.naziv, clanovi: self.clanovi, onlajnclanovi: onlajnclanovi }); //Trenutno ne kaze koji clanovi su onlajn a koji nisu
        }
    };
    //broadcastuj("napravljenaGrupa", { id: self.id, korisnicko_ime: self.korisnicko_ime });
    Grupa.lista.push(self);
    //return self;
}
Grupa.lista = [];
Grupa.ucitaj = function(param) { //Ucitava grupu u odnosu na podatke iz baze
    /*var grupa = */
    Grupa(param);
}

/*Grupa.napraviGrupu = function(podaci) { //Samo naziv grupe

}*/

/*Korisnik.priOdjavljivanju = function(socket) {
    let korisnik = Korisnik.lista[socket.id];
    if (!korisnik) return;
    broadcastuj("odjavljenKorisnik", { id: socket.id });
    delete Korisnik.lista[socket.id];
}*/