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
    /*var idtrenutnoselektovanog = selektSvihKorisnika.selectedIndex;
    if (idtrenutnoselektovanog != -1)
        var trenutnoselektovan = selektSvihKorisnika.options[idtrenutnoselektovanog].value;*/
    selektSvihKorisnika.innerHTML = "";
    selektSvihKorisnika.size = Object.keys(Korisnik.lista).length + 1; //Da ne bi bio 1
    for (var i in Korisnik.lista) {
        if (i != selfId) {
            var opcija = document.createElement("option");
            opcija.value = i;
            opcija.innerText = Korisnik.lista[i].korisnicko_ime;
            selektSvihKorisnika.appendChild(opcija);
        }
    }
    //Da bi razgovor pre apdejta ostao ukljucen
    /*if (idtrenutnoselektovanog != -1) {
        for (var i = 0; i < selektSvihKorisnika.options.length; i++) {
            console.log(trenutnoselektovan + " " + selektSvihKorisnika.options[i].value);
            if (selektSvihKorisnika.options[i].value == trenutnoselektovan) { //Lose za sada ali radi
                console.log("Selektujem " + i);
                selektSvihKorisnika.selectedIndex = i;
                break;
            }
        }
        //Ako ne nadje ni jedan znaci da se odjavio onaj sa kojim korisnik trenutno razgovara, sto se u ovom slucaju preskace, a treba da se omoguci kasnije
    }*/

    //divSvihKorisnika.appendChild(selektSvihKorisnika);
}