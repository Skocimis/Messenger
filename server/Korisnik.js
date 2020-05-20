Korisnik = function(param) {
    self = {};
    self.id = param.id;
    self.socket = param.socket;
    self.korisnicko_ime = param.korisnicko_ime;
    self.inicijalizujGrupe = function() { //inicijalizujpostojece, pravi init pack za jednog korisnika
        var grupe = [];
        for (var i in Grupa.lista) {
            if (Grupa.lista[i].clanovi.includes(self.korisnicko_ime)) {
                grupe.push({ id: Grupa.lista[i].id, naziv: Grupa.lista[i].naziv, vlasnik: Grupa.lista[i].vlasnik, clanovi: Grupa.lista[i].clanovi });
                Grupa.lista[i].socketi.push(self.socket.id);
            }
        }
        return grupe;
    }
    for (var i in Grupa.lista) {
        if (Grupa.lista[i].clanovi.includes(korisnik.korisnicko_ime)) {
            Grupa.lista[i].socketi.push(self.id);
            Grupa.lista[i].updatujKodClanova();
        }
    }
    broadcastuj("prijavljenKorisnik", { id: self.id, korisnicko_ime: self.korisnicko_ime }); //Mozda ne bi trebalo ovde
    Korisnik.lista[self.id] = self;
    return self;
}
Korisnik.lista = {};
Korisnik.inicijalizujPovezane = function() {
    var korisnici = [];
    for (var i in Korisnik.lista) {
        korisnici.push({ id: Korisnik.lista[i].id, korisnicko_ime: Korisnik.lista[i].korisnicko_ime }); //samo korisnicko ime je u initpacku
    }
    return korisnici;
}
Korisnik.priPovezivanju = function(socket, korisnicko_ime) {
    var korisnik = Korisnik({
        id: socket.id,
        socket: socket,
        korisnicko_ime: korisnicko_ime
    });
    socket.emit("inicijalizacija", { selfId: socket.id, korisnici: Korisnik.inicijalizujPovezane(), grupe: korisnik.inicijalizujGrupe() });
    socket.on("posaljiDmKorisniku", function(podaci) { //Ovde ne bi trebalo da moze da se cituje zato sto se salje korisnicko ime primaoca i tekst poruke, korisnicko ime posiljaoca zavisi od socketa
        var primalac = null;
        for (var i in Korisnik.lista) {
            if (Korisnik.lista[i].korisnicko_ime == podaci.korisnicko_ime) {
                primalac = Korisnik.lista[i].socket;
                break;
            }
        }
        if (primalac === null) {
            console.log("primalac je null");
            //Slanje poruke na server, zato sto se korisnik u medjuvremenu odjvaio, mogao bih i da dodam slanje poruka oflajn ljudima
        } else {
            primalac.emit("dodajUPrivatni", { korisnicko_ime: korisnik.korisnicko_ime, poruka: korisnik.korisnicko_ime + ": " + podaci.poruka });
            socket.emit("dodajUPrivatni", { korisnicko_ime: podaci.korisnicko_ime, poruka: korisnik.korisnicko_ime + ": " + podaci.poruka });
        }
    });
    socket.on("posaljiPorukuSvima", function(podaci) {
        broadcastuj("novaPoruka", { poruka: (korisnik.korisnicko_ime + ": " + podaci.poruka) });
    });
    socket.on("posaljiPorukuUGrupu", function(podaci) {
        let trazenagrupa = null;
        for (var i in Grupa.lista) {
            if (Grupa.lista[i].naziv == podaci.naziv && Grupa.lista[i].vlasnik == podaci.vlasnik) {
                trazenagrupa = Grupa.lista[i];
                break;
            }
        }
        if (!trazenagrupa) {
            console.log("Salje u nepostojecu grupu. ");
            return;
        }
        for (var i = 0; i < trazenagrupa.clanovi; i++) { //Bilo bi brze da ide kroz sokete, ali za svaki slucaj
            if (trazenagrupa.clanovi[i] == korisnik.korisnicko_ime) {
                for (var j in trazenagrupa.socketi) {
                    SOCKET_LIST[j].emit("dodajPorukuUGrupu", {});
                }
            }
        }
    });

    socket.on("napraviGrupu", function(podaci) {
        Baza.postojiGrupa(podaci, function(rez) {
            if (rez) {
                socket.emit("odgovorNaPravljenjeGrupe", { poruka: "Vec ste admin grupe " + podaci.naziv })
            } else {
                Baza.updatujGrupu({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv, clanovi: [korisnik.korisnicko_ime] }, function() {
                    Grupa.ucitaj({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv, clanovi: [korisnik.korisnicko_ime], socketi: [socket.id] });
                    socket.emit("odgovorNaPravljenjeGrupe", { poruka: "Uspesno napravljena grupa " + podaci.naziv });
                });
            }
        });
    });
    socket.on("obrisiGrupu", function(podaci) {
        for (var i in Grupa.lista) {
            if (Grupa.lista[i].naziv == podaci.naziv && Grupa.lista[i].vlasnik == korisnik.korisnicko_ime) {
                Baza.obrisiGrupu({ naziv: podaci.naziv, vlasnik: Grupa.lista[i].vlasnik }, function(neobrisana) {
                    if (neobrisana) {
                        socket.emit("odgovorNaBrisanjeGrupe", { poruka: "Greska" });
                        return;
                    }
                    //res ima ok i deletedCount, mozda je bolje da se to koristi umesto err
                    socket.emit("odgovorNaBrisanjeGrupe", { poruka: "Uspesno" });
                    for (var j in Grupa.lista[i].socketi) {
                        SOCKET_LIST[Grupa.lista[i].socketi[j]].emit("obrisanaGrupa", { vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv }); //TREBA HANDLER NA KLIJENTU
                    }
                    delete Grupa.lista[i];
                });
                return;
            }
        }
        socket.emit("odgovorNaBrisanjeGrupe", { poruka: "Grupa ne postoji " });
    });
    //MOZDA LOSI RETURNOVI
    socket.on("dodajClanaUGrupu", function(podaci) {
        for (var i in Grupa.lista) {
            if (Grupa.lista[i].naziv == podaci.naziv && Grupa.lista[i].vlasnik == korisnik.korisnicko_ime) {
                Baza.iskoriscenoIme({ korisnicko_ime: podaci.korisnicko_ime }, function(rez) {
                    if (!rez) {
                        Grupa.lista[i].clanovi.push(podaci.korisnicko_ime);
                        Baza.updatujGrupu({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv, clanovi: Grupa.lista[i].clanovi }, function() {
                            socket.emit("odgovorNaDodavanjeClana", { poruka: "Uspesno dodavanje u grupu" });
                            Grupa.lista[i].updatujKodClanova();
                            return;
                        });
                        return;
                    }
                    socket.emit("odgovorNaDodavanjeClana", { poruka: "Korisnik ne postoji" });
                });
                return;
            }
        }
        socket.emit("odgovorNaDodavanjeClana", { poruka: "Grupa ne postoji " });
    });
    socket.on("ukloniClanaIzGrupe", function(podaci) {
        for (var i in Grupa.lista) {
            if (Grupa.lista[i].naziv == podaci.naziv && Grupa.lista[i].vlasnik == korisnik.korisnicko_ime) {
                Baza.iskoriscenoIme({ korisnicko_ime: podaci.korisnicko_ime }, function(rez) {
                    if (!rez) {
                        if (Grupa.lista[i].indexOf(podaci.korisnicko_ime) != -1) {
                            Grupa.lista[i].clanovi.splice(Grupa.lista[i].indexOf(podaci.korisnicko_ime), 1);
                            Baza.updatujGrupu({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv, clanovi: Grupa.lista[i].clanovi }, function() {
                                socket.emit("odgovorNaUklanjanjeClana", { poruka: "Uspesno uklanjanje clana" });
                            });
                            for (var j in Korisnik.lista) {
                                if (Korisnik.lista[j].korisnicko_ime == podaci.korisnicko_ime) {
                                    Korisnik.lista[j].socket.emit("obrisanaGrupa", { vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv }); //TREBA HANDLER NA KLIJENTU
                                }
                            }
                            //Updatovanje soketa
                            //Updatovanje aktivnih kod korisnika
                            return;
                        }
                        socket.emit("odgovorNaUklanjanjeClana", { poruka: "Korisnik nije u grupi" });
                        return;
                    }
                    socket.emit("odgovorNaUklanjanjeClana", { poruka: "Korisnik ne postoji" });
                });
                return;
            }
        }
        socket.emit("odgovorNaUklanjanjeClana", { poruka: "Grupa ne postoji " });
    });



    //SOCKET.ON(sendmsgtoserver, sendpmtoserver)

}
Korisnik.priOdjavljivanju = function(socket) {
    let korisnik = Korisnik.lista[socket.id];
    if (!korisnik) return;
    for (var i in Grupa.lista) {
        if (Grupa.lista[i].clanovi.includes(korisnik.korisnicko_ime)) {
            Grupa.lista[i].socketi.splice(Grupa.lista[i].indexOf(socket.id), 1);
            Grupa.lista[i].updatujKodClanova();
        }
    }
    broadcastuj("odjavljenKorisnik", { id: socket.id });
    delete Korisnik.lista[socket.id];
}