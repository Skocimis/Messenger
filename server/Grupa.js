Grupa = function(param) { //param sadrzi naziv grupe, socketid vlasnika i socketidjeve svih clanova grupe
    self = {};
    self.id = Grupa.lista.length;
    self.vlasnik = param.vlasnik; //String
    self.naziv = param.naziv;
    self.clanovi = param.clanovi; //Svi clanovi grupe
    self.socketi = param.socketi || []; //Socketi aktivnih clanova, ovo treba da dodam da se apdejtuje kad se korisnici loguju u izloguju
    /*self.updatujKodClanova = function() { //Novi clan, removovan clan, ulogovao se clan, izlogovao se clan, salje obavestenje svim aktivnim clanovima
        //console.log(self.naziv);
        
    }
    self.prikaziIme = function() {
        console.log(self.naziv);
    }*/

    //broadcastuj("napravljenaGrupa", { id: self.id, korisnicko_ime: self.korisnicko_ime });
    Grupa.lista.push(self);
    //return self;
}
Grupa.lista = [];
Grupa.ucitaj = function(param) { //Ucitava grupu u odnosu na podatke iz baze
    /*var grupa = */
    Grupa(param);
}
Grupa.updatujKodClanova = function(grupa) {
    var onlajnclanovi = [];
    for (var i in grupa.socketi) {
        onlajnclanovi.push(Korisnik.lista[grupa.socketi[i]].korisnicko_ime);
    }
    for (var i in grupa.socketi) {
        //console.log("stigo ovde");
        SOCKET_LIST[grupa.socketi[i]].emit("noviClanovi", { vlasnik: grupa.vlasnik, naziv: grupa.naziv, clanovi: grupa.clanovi, aktivni: onlajnclanovi }); //Trenutno ne kaze koji clanovi su onlajn a koji nisu
    }
}

/*Grupa.napraviGrupu = function(podaci) { //Samo naziv grupe

}*/

/*Korisnik.priOdjavljivanju = function(socket) {
    let korisnik = Korisnik.lista[socket.id];
    if (!korisnik) return;
    broadcastuj("odjavljenKorisnik", { id: socket.id });
    delete Korisnik.lista[socket.id];
}*/