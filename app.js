require("./server/Baza");
require("./server/Korisnik");
require("./server/Grupa");

const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const serv = https.createServer({ key: fs.readFileSync("server.key"), cert: fs.readFileSync("server.cert") }, app);
console.log("Server je pokrenut!");

Baza.sveGrupe(function(err, res) {
    if (err || !res) process.exit(1);
    for (var i = 0; i < res.length; i++) {
        Grupa.ucitaj(res[i]);
    }
});
console.log("Baza je ucitana!");

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));

serv.listen(443);

var io = require("socket.io")(serv, {});

SOCKET_LIST = {};
broadcastuj = function(naziv, podaci) {
    for (var i in SOCKET_LIST) {
        SOCKET_LIST[i].emit(naziv, podaci);
    }
}

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
            if (rezultat) {
                return socket.emit("odgovorNaRegistraciju", { poruka: "Već iskorišćeno korisničko ime. " });
            }
            Baza.dodajKorisnika(podaci, function(vr) {
                if (vr) {
                    socket.emit("odgovorNaRegistraciju", { poruka: "Uspešna registracija! " });
                } else {
                    socket.emit("odgovorNaRegistraciju", { poruka: "Neuspešna registracija! " });
                }
            });
        });
    });
    socket.on("prijava", function(podaci) {
        Baza.dobraLozinka(podaci, function(rezultat) {
            if (!rezultat) return socket.emit("odgovorNaPrijavu", { poruka: "Netacni podaci" });
            Korisnik.priPovezivanju(socket, podaci.korisnicko_ime);
            socket.emit("odgovorNaPrijavu", { uspeh: true });
        });
    });
    socket.on("disconnect", function() {
        Korisnik.priOdjavljivanju(socket);
        delete SOCKET_LIST[socket.id];
    });

});
console.log("Server je ucitan!");

//cd '..\..\..\..\Programi\MongoDB\Server\4.2\bin\'