var Korisnik = function(paket) {
    var self = {};
    self.id = paket.id;
    self.korisnicko_ime = paket.korisnicko_ime;
    self.poruke = paket.poruke || [];

    self.prikazi = function() { //Za sada se ne koristi
        //Dodavanje onoga sto treba u div sa svim korisnicima, sa onclickom
    }
    Korisnik.lista[self.id] = self;
    return self;
}
Korisnik.lista = {};
var javneporuke = [];
var selfId = -1;
var trenutnirazgovor = null;

Korisnik.nadjiKorisnikaPoImenu = function(ime) {
    for (var i in Korisnik.lista) {
        if (Korisnik.lista[i].korisnicko_ime == ime) return Korisnik.lista[i];
    }
    return null;
}
Korisnik.prikaziSve = function() {
    listaKorisnika.innerHTML = "";
    let samSaSobom = document.createElement("a");
    samSaSobom.href = "#";
    if (Korisnik.lista[selfId])
        samSaSobom.innerText = "Ja (" + Korisnik.lista[selfId].korisnicko_ime + ")";
    samSaSobom.onclick = function() {
        trenutnagrupa = null;
        trenutnirazgovor = Korisnik.lista[selfId].korisnicko_ime;
        Poruka.prikaziPoruke();
        divCaskanja.scrollTop = divCaskanja.scrollHeight;
        opcijeCont.style.display = "none";
    }
    listaKorisnika.appendChild(samSaSobom);
    for (var i in Korisnik.lista) {
        if (i != selfId) {
            var a = document.createElement("a");
            a.href = "#";
            a.innerText = Korisnik.lista[i].korisnicko_ime;
            a.onclick = function() {
                trenutnagrupa = null;
                trenutnirazgovor = Korisnik.lista[i].korisnicko_ime;
                Poruka.prikaziPoruke();
                divCaskanja.scrollTop = divCaskanja.scrollHeight;
                opcijeCont.style.display = "none";
            }
            listaKorisnika.appendChild(a);
        }
    }
}