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
        cb(); //mozda treba da se doda gledanje greske
    })
}
Baza.dobraLozinka = function(podaci, cb) {
    db.korisnici.findOne({ korisnicko_ime: podaci.korisnicko_ime, lozinka: podaci.lozinka }, function(err, res) {
        if (res)
            cb(true);
        else cb(false);
    });
}