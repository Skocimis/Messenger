require("./server/Baza");
require("./server/Korisnik");
require("./server/Grupa");

//cd '..\..\..\..\Programi\MongoDB\Server\4.2\bin\'

var express = require("express");
var app = express();
var serv = require("http").Server(app);

Baza.sveGrupe(function(err, res) { //Ucitaj sve postojece grupe u memoriju
    if (err || !res) process.exit(1);
    for (var i = 0; i < res.length; i++) {
        Grupa.ucitaj(res[i]);
    }
    /*
        delete Grupa.lista[0];
        for (var i = 0; i < Grupa.lista.length; i++) {
            if (Grupa.lista[i])
        }*/
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));

serv.listen(80);
console.log("Server je pokrenut!");

var io = require("socket.io")(serv, {});

broadcastuj = function(naziv, podaci) {
    for (var i in SOCKET_LIST) {
        SOCKET_LIST[i].emit(naziv, podaci);
    }
}
SOCKET_LIST = {};

//Nova grupa, onaj ko hoce da napravi grupu salje samo naziv i inicijalna grupa se pravi na serveru
//Prvo da se doda vlasnik u clanove
/*var pdc = { vlasnik: "joca", naziv: "rganb", clanovi: ["joca"] };
Baza.postojiGrupa(pdc, function(rezultat) {
    if (rezultat) console.log("Grupa postoji");
    else {
        Baza.updatujGrupu(pdc, function() {
            Grupa.ucitaj(pdc);
            console.log("Napravljena grupa");
        });
    }
});*/

//


io.sockets.on("connection", function(socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on("registracija", function(podaci) {
        Baza.iskoriscenoIme(podaci, function(rezultat) {
            if (rezultat) return socket.emit("odgovorNaRegistraciju", { poruka: "Već iskorišćeno korisničko ime. " });
            Baza.dodajKorisnika(podaci, function() {
                socket.emit("odgovorNaRegistraciju", { poruka: "Uspešna registracija! " });
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
        console.log("diss");
        Korisnik.priOdjavljivanju(socket);
        delete SOCKET_LIST[socket.id];
    });

});
console.log("Server je ucitan");