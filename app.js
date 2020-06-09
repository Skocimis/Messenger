require("./server/Baza"); //Biblioteke za rad sa bazom i klasama korisnik i grupa
require("./server/Korisnik");
require("./server/Grupa");

const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const serv = https.createServer({
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert")
}, app);
const io = require("socket.io")(serv, {}); //Pokretanje socket.io na https serveru

//Poziva se funkcija sveGrupe, sa prosledjenom definisanom callback funckijom
Baza.sveGrupe(function(err, res) {
    if (err) process.exit(1); //Ukoliko se dogodila greska gasi se server
    for (var i = 0; i < res.length; i++) {
        Grupa.ucitaj(res[i]);
        //U suprotnom poziva se funkcija ucitaj za sve grupe u rezultatu
    }
});

app.get("/", function(req, res) { //Konfiguracija Express-a
    res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));
serv.listen(443); //Server pocinje da slusa na portu 443, koji je standardan port za https komunikaciju

SOCKET_LIST = {}; //Lista socketa svih povezanih korisnika
broadcastuj = function(naziv, podaci) { //Funkcija koriscenja za slanje socket.io paketa trenutno povezanim korisnicima
    for (var i in SOCKET_LIST) {
        SOCKET_LIST[i].emit(naziv, podaci);
    }
}

//Pristizanje paketa connection, koji klijent salje prilikom inicijalizacije klijentskog dela socket.io-a 
io.sockets.on("connection", function(socket) {
    socket.id = Math.random(); //Dodeljivanje nasumicnog identifikatora socketu
    SOCKET_LIST[socket.id] = socket; //upisivanje socketa u listu svih socketa

    //prilikom primanja paketa sa nazivom "registracija" poziva se sledeca funkcija nad poslatim podacima
    socket.on("registracija", function(podaci) {
        //"rezultat" dole je bool koji kaze da li je ime iskorisceno
        Baza.iskoriscenoIme(podaci, function(rezultat) { //Provera da li je korisnicko ime vec iskorisceno
            if (rezultat) {
                return socket.emit("odgovorNaRegistraciju", { poruka: "Već iskorišćeno korisničko ime. " });
            }
            Baza.dodajKorisnika(podaci, function(vr) { //Dodavanje korisnika u bazu, iz fajla Baza.js
                //insert u kolekciju, koji je pozvan u funkciji dodajKorisnika vraca vrednost upisanog 
                //korisnika ako je uspesan
                if (vr) {
                    //Korisniku se salje paket koji kaze da mu je registracija uspesna
                    socket.emit("odgovorNaRegistraciju", { poruka: "Uspešna registracija! " });
                } else {
                    //A ako insert nije uspesan, nece vratiti nista kao rezultat
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
        // Na prethodnoj slici se puni objekat SOCKET_LIST
        // delete je javascript operator koji uklanja svojstvo iz objekta
        // to jest iz liste povezanih soketa se uklanja soket kome je id socket.id
    });

});
console.log("Server je pokrenut!"); //Poruka koje se prikazuje u konzoli servera kada se on ucita

//cd '..\..\..\..\Programi\MongoDB\Server\4.2\bin\'