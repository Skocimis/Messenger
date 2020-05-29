require("./server/Baza");
require("./server/Korisnik");
require("./server/Grupa");

const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const serv = https.createServer({ key: fs.readFileSync("server.key"), cert: fs.readFileSync("server.cert") }, app);
const io = require("socket.io")(serv, {});

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

SOCKET_LIST = {};
broadcastuj = function(naziv, podaci) {
    for (var i in SOCKET_LIST) {
        SOCKET_LIST[i].emit(naziv, podaci);
    }
}

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