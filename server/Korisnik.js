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

    socket.on("napraviGrupu", function(podaci) {
        Baza.postojiGrupa(podaci, function(rez) {
            if (rez) {
                socket.emit("odgovorNaPravljenjeGrupe", { poruka: "Vec ste admin grupe " + podaci.naziv })
            } else {
                Baza.updatujGrupu({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv, clanovi: [korisnik.korisnicko_ime] }, function() {
                    Grupa.ucitaj({ vlasnik: korisnik.korisnicko_ime, naziv: podaci.naziv, clanovi: [korisnik.korisnicko_ime], socketi: [socket.id] });
                    socket.emit("odgovorNaPravljenjeGrupe", { poruka: "Uspesno napravljena grupa " + podaci.naziv })
                });
            }
        })
    });



    //SOCKET.ON(sendmsgtoserver, sendpmtoserver)

}
Korisnik.priOdjavljivanju = function(socket) {
    let korisnik = Korisnik.lista[socket.id];
    console.log(Korisnik.lista[socket.id]);
    if (!korisnik) return;
    broadcastuj("odjavljenKorisnik", { id: socket.id });
    delete Korisnik.lista[socket.id];
}