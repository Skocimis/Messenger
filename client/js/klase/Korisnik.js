var Korisnik = function(paket) {
    var self = {};
    self.id = paket.id;
    self.korisnicko_ime = paket.korisnicko_ime;
    self.poruke = paket.poruke || [];
    self.img = document.createElement("img");
    self.img.src = "client/img/Novaporuka.png";
    self.img.style.width = "20px";
    self.img.style.height = "20px";
    self.img.style.display = "none";
    self.img.style.marginBottom = "4px";
    self.img.style.marginLeft = "6px";
    self.img.alt = "#";
    self.img.style.right = "0px";
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

var imgSvi = document.createElement("img");
imgSvi.src = "client/img/Novaporuka.png";
imgSvi.style.width = "20px";
imgSvi.style.height = "20px";
imgSvi.style.display = "none";
imgSvi.style.marginBottom = "4px";
imgSvi.style.marginLeft = "6px";
imgSvi.alt = "#";

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
            let k = i;
            a.onclick = function() {
                trenutnagrupa = null;
                trenutnirazgovor = Korisnik.lista[k].korisnicko_ime;
                Korisnik.lista[k].img.style.display = "none";
                Poruka.prikaziPoruke();
                divCaskanja.scrollTop = divCaskanja.scrollHeight;
                opcijeCont.style.display = "none";

            }
            a.appendChild(Korisnik.lista[k].img);
            listaKorisnika.appendChild(a);
        }
    }
}