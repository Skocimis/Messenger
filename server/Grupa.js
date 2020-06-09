Grupa = function(param) {
    self = {}; //Alokacija memorije za novi objekat 
    //Definicija "atributa" novog objekta
    self.id = Grupa.lista.length;
    self.vlasnik = param.vlasnik;
    self.naziv = param.naziv;
    self.clanovi = param.clanovi;
    //U redu dole, ako parametar ne sadrzi sockete, socketi ce biti prazan niz
    self.socketi = param.socketi || [];
    Grupa.lista.push(self); //Ubacivanje grupe u listu svih grupa (niz)
    return self; //Vracanje novog objekta, tacnije pokazivaca na njega
}
Grupa.lista = []; //Lista grupa je u stvari niz koji sadrzi sve grupe
Grupa.ucitaj = function(param) { //Ucitava grupu u odnosu na podatke iz baze
    var grupa = Grupa(param); //Samo se poziva konstruktor grupe
    //Kada bih hteo da uradim nesto sa tom grupom sto nije u konstruktoru,
    //to bi moglo da bude ovde
}

Grupa.updatujKodClanova = function(grupa) {
    var onlajnclanovi = [];
    for (var i in grupa.socketi) {
        if (grupa.socketi[i])
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