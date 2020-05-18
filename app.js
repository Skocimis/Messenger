require("./server/Baza");

var express = require("express");
var app = express();
var serv = require("http").Server(app);

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));

serv.listen(25565);

var io = require("socket.io")(serv, {});

console.log("Server je pokrenut!");

var SOCKET_LIST = {};

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
    socket.emit("inicijalizacija", { selfId: socket.id, korisnici: Korisnik.inicijalizujPovezane() });
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




var broadcastuj = function(naziv, podaci) {
    for (var i in SOCKET_LIST) {
        SOCKET_LIST[i].emit(naziv, podaci);
    }
}

io.sockets.on("connection", function(socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on("registracija", function(podaci) {
        Baza.iskoriscenoIme(podaci, function(rezultat) {
            if (rezultat) return socket.emit("odgovorNaRegistraciju", { uspeh: false });
            Baza.dodajKorisnika(podaci, function() {
                socket.emit("odgovorNaRegistraciju", { uspeh: true });
            });
        });
    });
    socket.on("prijava", function(podaci) {
        Baza.dobraLozinka(podaci, function(rezultat) {
            if (!rezultat) return socket.emit("odgovorNaPrijavu", { uspeh: false });
            Korisnik.priPovezivanju(socket, podaci.korisnicko_ime);
            socket.emit("odgovorNaPrijavu", { uspeh: true });
        });
    });
    socket.on("disconnect", function() {
        Korisnik.priOdjavljivanju(socket);
        delete SOCKET_LIST[socket.id];
    });

});