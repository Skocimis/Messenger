Korisnik = function(param) {
    self = {};
    self.id = param.id;
    self.socket = param.socket;
    self.korisnicko_ime = param.korisnicko_ime;
    broadcastuj("prijavljenKorisnik", { id: self.id, korisnicko_ime: self.korisnicko_ime });
    Korisnik.lista[self.id] = self;
    for (var i in Grupa.lista) {
        if (Grupa.lista[i].clanovi.includes(self.korisnicko_ime)) {
            Grupa.lista[i].socketi.push(self.id);
            Grupa.updatujKodClanova(Grupa.lista[i]);
        }
    }
    return self;
}
Korisnik.lista = {};
Korisnik.inicijalizujPovezane = function() {
    var korisnici = [];
    for (var i in Korisnik.lista) {
        korisnici.push({ id: Korisnik.lista[i].id, korisnicko_ime: Korisnik.lista[i].korisnicko_ime });
    }
    return korisnici;
}

//Funkcija koja se poziva kada se korisnik uspesno prijavi
Korisnik.priPovezivanju = function(socket, korisnicko_ime) {
    var korisnik = Korisnik({
        id: socket.id,
        socket: socket,
        korisnicko_ime: korisnicko_ime
    }); //pozivanje konstruktora
    socket.emit("inicijalizacija", {
        selfId: socket.id, //da bi klijent znao svoj id
        korisnici: Korisnik.inicijalizujPovezane()
    }); //Paketi koje korisnik dobija prilikom prijave
    socket.on("posaljiDmKorisniku", function(podaci) {
        //podaci je objekat koji sadrzi primaoca poruke i njen tekst
        var primalac = null;
        for (var i in Korisnik.lista) {
            if (Korisnik.lista[i].korisnicko_ime == podaci.korisnicko_ime) {
                primalac = Korisnik.lista[i].socket;
                break;
            }
        }
        //sve iznad ovoga je pretraga primaoca u listi prijavljenih
        if (primalac === null) {} //Ako primalac nije nadjen
        else {
            //ako jeste paket se salje
            primalac.emit("dodajUPrivatni", {
                korisnicko_ime: korisnik.korisnicko_ime,
                poruka: korisnik.korisnicko_ime + ": " + podaci.poruka
            });
            //i posiljaocu se u chatu prikazuje poruka koju je poslao
            socket.emit("dodajUPrivatni", {
                korisnicko_ime: podaci.korisnicko_ime,
                poruka: korisnik.korisnicko_ime + ": " + podaci.poruka
            });
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
            return;
        }
        if (trazenagrupa.clanovi.includes(korisnik.korisnicko_ime)) {
            for (var j in trazenagrupa.socketi) {
                if (SOCKET_LIST[trazenagrupa.socketi[j]])
                    SOCKET_LIST[trazenagrupa.socketi[j]].emit("dodajPorukuUGrupu", { posiljalac: korisnik.korisnicko_ime, poruka: podaci.poruka, naziv: trazenagrupa.naziv, vlasnik: trazenagrupa.vlasnik });
            }
            return;
        }
    });

    socket.on("napraviGrupu", function(podaci) {
        Baza.postojiGrupa({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv }, function(rez) { //Ovo proverava u bazi a treba u memoriji, treba da se izmeni
            if (rez) {
                socket.emit("odgovorNaPravljenjeGrupe", { poruka: "Vec ste admin grupe " + podaci.naziv })
            } else {
                Baza.updatujGrupu({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv, clanovi: [korisnik.korisnicko_ime] }, function() {
                    Grupa.ucitaj({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv, clanovi: [korisnik.korisnicko_ime], socketi: [socket.id] }); //samo pravi grupu
                    socket.emit("odgovorNaPravljenjeGrupe", { poruka: "Uspesno napravljena grupa " + podaci.naziv });

                    Grupa.updatujKodClanova(Grupa.lista[Grupa.lista.length - 1]);
                });
            }
        });
    });
    socket.on("obrisiGrupu", function(podaci) {
        for (var i in Grupa.lista) {
            // Jedini poslat parametar za brisanje grupe je njen naziv, zato sto je njen vlasnik jedini korisnik koji ima pravo da je
            // obrise, a preko soketa koji salje zahtev, on je vec poznat
            if (Grupa.lista[i].naziv == podaci.naziv && Grupa.lista[i].vlasnik == korisnik.korisnicko_ime) {
                Baza.obrisiGrupu({ naziv: podaci.naziv, vlasnik: Grupa.lista[i].vlasnik }, function(neobrisana) {
                    //videti funkciju obrisiGrupu dole
                    if (neobrisana) {
                        socket.emit("odgovorNaBrisanjeGrupe", { poruka: "Greska" });
                        return;
                    }
                    socket.emit("odgovorNaBrisanjeGrupe", { poruka: "Uspesno" });
                    for (var j in Grupa.lista[i].socketi) {
                        //takodje se svim korisnicima grupe salje da je grupa obrisana
                        SOCKET_LIST[Grupa.lista[i].socketi[j]].emit("obrisanaGrupa", { vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv });
                    }
                    delete Grupa.lista[i];
                });
                return;
            }
        }
        //Ukoliko grupa sa datim imenom nije nadjena salje se adekvatna poruka
        socket.emit("odgovorNaBrisanjeGrupe", { poruka: "Grupa ne postoji " });
    });
    socket.on("dodajClanaUGrupu", function(podaci) {
        for (var i in Grupa.lista) {
            if (Grupa.lista[i].naziv == podaci.naziv && Grupa.lista[i].vlasnik == korisnik.korisnicko_ime) {
                Baza.iskoriscenoIme({ korisnicko_ime: podaci.korisnicko_ime }, function(rez) {
                    if (rez) {

                        if (Grupa.lista[i].clanovi.includes(podaci.korisnicko_ime)) {
                            socket.emit("odgovorNaDodavanjeClana", { poruka: "Korisnik je vec u grupi. " });
                            return;
                        }
                        Grupa.lista[i].clanovi.push(podaci.korisnicko_ime);
                        Baza.updatujGrupu({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv, clanovi: Grupa.lista[i].clanovi }, function() {
                            socket.emit("odgovorNaDodavanjeClana", { poruka: "Uspesno dodavanje u grupu" });
                            for (var j in Korisnik.lista) {
                                if (Korisnik.lista[j].korisnicko_ime == podaci.korisnicko_ime) {
                                    Grupa.lista[i].socketi.push(j);
                                }
                            }
                            Grupa.updatujKodClanova(Grupa.lista[i]);
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
            if (Grupa.lista[i].naziv == podaci.naziv && Grupa.lista[i].vlasnik == podaci.vlasnik) {
                Baza.iskoriscenoIme({ korisnicko_ime: podaci.korisnicko_ime }, function(rez) {
                    if (rez) {
                        if (Grupa.lista[i].clanovi.indexOf(podaci.korisnicko_ime) != -1) {
                            if (korisnik.korisnicko_ime == podaci.vlasnik || korisnik.korisnicko_ime == podaci.korisnicko_ime) {
                                Grupa.lista[i].clanovi.splice(Grupa.lista[i].clanovi.indexOf(podaci.korisnicko_ime), 1);
                                Baza.updatujGrupu({ vlasnik: podaci.vlasnik, naziv: podaci.naziv, clanovi: Grupa.lista[i].clanovi }, function() {
                                    socket.emit("odgovorNaUklanjanjeClana", { poruka: "Uspesno uklanjanje clana" });
                                    for (var j in Korisnik.lista) {
                                        if (Korisnik.lista[j].korisnicko_ime == podaci.korisnicko_ime) {
                                            Korisnik.lista[j].socket.emit("obrisanaGrupa", { vlasnik: podaci.vlasnik, naziv: podaci.naziv });
                                            Grupa.lista[i].socketi.splice(Grupa.lista[i].socketi.indexOf(j), 1);
                                        }
                                    }
                                    Grupa.updatujKodClanova(Grupa.lista[i]);
                                });
                                return;
                            }
                            socket.emit("odgovorNaUklanjanjeClana", { poruka: "Nemate dozvolu za zeljenu akciju" });
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
}
Korisnik.priOdjavljivanju = function(socket) {
    let korisnik = Korisnik.lista[socket.id];
    if (!korisnik) return; //ako ne postoji korisnik
    for (var i in Grupa.lista) {
        //Svim clanovima grupa u kojima je korisnik se takodje salje podatak da se on odjavio
        //kako bi u grupama radio prikaz aktivnih clanova u realnom vremenu 
        if (Grupa.lista[i].clanovi.includes(korisnik.korisnicko_ime)) {
            Grupa.lista[i].socketi.splice(Grupa.lista[i].socketi.indexOf(socket.id), 1);
            Grupa.updatujKodClanova(Grupa.lista[i]);
        }
    }
    //slanje paketa obavestenja svim korisnicima
    broadcastuj("odjavljenKorisnik", { id: socket.id });
    //Jedan korisnik i njegov soket imaju isti id
    delete Korisnik.lista[socket.id];
}