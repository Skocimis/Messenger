Korisnik = function(param) {
    self = {};
    self.id = param.id;
    self.socket = param.socket;
    self.korisnicko_ime = param.korisnicko_ime;

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
    socket.emit("inicijalizacija", { selfId: socket.id, korisnici: Korisnik.inicijalizujPovezane(), grupe: Grupa.inicijalizujPostojece(korisnicko_ime) });
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

    //SOCKET.ON(sendmsgtoserver, sendpmtoserver)

}
Korisnik.priOdjavljivanju = function(socket) {
    let korisnik = Korisnik.lista[socket.id];
    if (!korisnik) return;
    broadcastuj("odjavljenKorisnik", { id: socket.id });
    delete Korisnik.lista[socket.id];
}