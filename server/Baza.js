var mongojs = require('mongojs');
var db = mongojs('localhost:27017/messenger', ['korisnici']);
Baza = {};
Baza.iskoriscenoIme = function(podaci, cb) {
    db.korisnici.findOne({ korisnicko_ime: podaci.korisnicko_ime }, function(err, res) {
        if (res) cb(true);
        else cb(false);
    });
}
Baza.dodajKorisnika = function(podaci, cb) {
    db.korisnici.insert({ korisnicko_ime: podaci.korisnicko_ime, lozinka: podaci.lozinka }, function() {
        cb();
    })
}
Baza.dobraLozinka = function(podaci, cb) {
    db.korisnici.findOne({ korisnicko_ime: podaci.korisnicko_ime, lozinka: podaci.lozinka }, function(err, res) {
        if (res)
            cb(true);
        else cb(false);
    });
}

Baza.sveGrupe = function(cb) {
    db.grupe.find({}, function(err, res) {
        cb(err, res);
    })
}
Baza.postojiGrupa = function(podaci, cb) { //Vlasnik, naziv je jedinstveni kljuc
    db.grupe.findOne({ vlasnik: podaci.vlasnik, naziv: podaci.naziv }, function(err, res) {
        if (res) cb(true);
        else cb(false);
    });
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
Baza.updatujGrupu = function(podaci, cb) { //{vlasnik, naziv}
    cb = cb || function() {} //Ako cb nije definisan
    db.grupe.update({ vlasnik: podaci.vlasnik, naziv: podaci.naziv }, { $set: { clanovi: podaci.clanovi } }, { upsert: true }, function(err, res) {
        cb(); //Racunam kao da je uvek uspesno dodavanje u grupu, treba izmeniti
    });
}