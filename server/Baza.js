const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongojs = require('mongojs');
const db = mongojs('localhost:27017/messenger', ['korisnici']);
Baza = {};
Baza.iskoriscenoIme = function(podaci, cb) {
    db.korisnici.findOne({ korisnicko_ime: podaci.korisnicko_ime }, function(err, res) {
        if (res) cb(true);
        else cb(false);
    });
}

Baza.dodajKorisnika = function(podaci, cb) { //Funkcija za upisivanje novog korisnika u bazu
    bcrypt.hash(podaci.lozinka, saltRounds, function(err, hash) {
        db.korisnici.insert({ korisnicko_ime: podaci.korisnicko_ime, lozinka: hash }, function(err, res) {
            cb(!err);
        })
    });
}
Baza.dobraLozinka = function(podaci, cb) { //Funkcija za proveru unesene lozinke
    db.korisnici.findOne({ korisnicko_ime: podaci.korisnicko_ime }, function(err, res) {
        if (err || !res) return cb(false);
        bcrypt.compare(podaci.lozinka, res.lozinka, function(err, result) {
            cb(result);
        });
    });
}

//sveGrupe kao argument dobija funkciju koja ce kasnije 
//biti izvrsena nad vracenim podacima (callback funkciju)
Baza.sveGrupe = function(cb) {
    //find vraca sve grupe koje se "slazu" sa zadatim objektom,
    //a posto je on prazan vratice sve grupe iz baze
    //find kao argumente prima javaskript objekte za gresku i rezultat
    db.grupe.find({ /*PRAZAN OBJEKAT*/ }, function(err, res) {
        cb(err, res); //poziv callback funkcije
    })
}


Baza.ucitajGrupu = function(podaci, cb) {
    db.grupe.findOne({ naziv: podaci.naziv, vlasnik: podaci.vlasnik }, function(err, res) {
        if (res) {
            cb({ clanovi: podaci.clanovi });
            return;
        }
        cb({ neuspesno: 1 });
    });
}


Baza.postojiGrupa = function(podaci, cb) { //Vlasnik, naziv je jedinstveni kljuc
    db.grupe.findOne({ vlasnik: podaci.vlasnik, naziv: podaci.naziv }, function(err, res) {
        if (res) cb(true);
        else cb(false);
    });
}
Baza.updatujGrupu = function(podaci, cb) { //{vlasnik, naziv}
    cb = cb || function() {} //Ako cb nije definisan
    podaci.clanovi = podaci.clanovi || [podaci.vlasnik];
    db.grupe.update({ vlasnik: podaci.vlasnik, naziv: podaci.naziv }, { $set: { clanovi: podaci.clanovi } }, { upsert: true }, function(err, res) {
        cb(); //Racunam kao da je uvek uspesno dodavanje u grupu, treba izmeniti
    });
}
Baza.obrisiGrupu = function(podaci, cb) {
    //Ukoliko callback funkcija nije definisana nece se izvrsiti nista
    cb = cb || function() {};
    //Uklanjanje grupe pomocu MongoJS-a
    db.grupe.remove({ vlasnik: podaci.vlasnik, naziv: podaci.naziv }, {
        justOne: true //parametar za mongo komandu
    }, function(err, res) {
        //Ukoliko se desila greska ili grupa ne postoji, izvrsice se zadata cb funkcija
        // za vrednost true
        cb(res.deletedCount == 0 || err);
    });
}

//Baza.updatujGrupu({ naziv: "slovo banda", vlasnik: "c", clanovi: ["c", "b", "a"] });