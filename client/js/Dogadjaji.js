var formaPrijava = document.getElementById("logregforma");
var container = document.getElementById("container");
var btnReg = document.getElementById("registracija");
var divCaskanja = document.getElementById("caskanje");
var divSvihKorisnika = document.getElementById("svi");
var divIzabranog = document.getElementById("izabran");
var formaSlanjaPoruke = document.getElementById("formaSlanjaPoruke");
var selektSvihKorisnika = document.getElementById("selektkorisnika");
var posebanSelekt = document.getElementById("posebanselekt");
var pretragaKorisnika = document.getElementById("pretragaKorisnika");
var taPoruke = document.getElementById("poslataPoruka");
var selektSvihGrupa = document.getElementById("grupeselekt");

taPoruke.onkeydown = function(e) {
    if (e.keyCode == 13) {
        if (/\S/.test(taPoruke.value)) //Ako poruka nema whitespace ne salje se
        {
            if (trenutnirazgovor) {
                socket.emit("posaljiDmKorisniku", {
                    korisnicko_ime: trenutnirazgovor,
                    poruka: taPoruke.value
                });
            } else if (trenutnagrupa) {

            } else //svi
            {
                socket.emit("posaljiPorukuSvima", {
                    poruka: taPoruke.value
                });
            }
        }
        taPoruke.value = "";
    }
}
taPoruke.onkeyup = function(e) {
    if (e.keyCode == 13) {
        taPoruke.value = "";
    }
}
pretragaKorisnika.onkeydown = function(e) {
    if (e.keyCode == 13) {
        var korime = pretragaKorisnika.value;
        trenutnagrupa = "";
        trenutnirazgovor = korime;
        Poruka.prikaziPoruke();
        divCaskanja.scrollTop = divCaskanja.scrollHeight;
    }
}
pretragaKorisnika.onkeyup = function(e) {
    if (e.keyCode == 13) {
        pretragaKorisnika.value = "";
    }
}

formaSlanjaPoruke.onsubmit = function(e) {
    e.preventDefault();
    //Samo ako je selektovan neki korisnik
    /*if (taPoruke.value != "") {
        socket.emit("posaljiDmKorisniku", {
            korisnicko_ime: Korisnik.lista[selektSvihKorisnika.value].korisnicko_ime,
            poruka: taPoruke.value
        });
    }
    taPoruke.value = "";*/
}

posebanSelekt.onchange = function() {
    if (posebanSelekt.selectedIndex != -1) {
        if (posebanSelekt.selectedIndex == 0) {
            trenutnagrupa = null;
            trenutnirazgovor = null;
        } else {
            trenutnagrupa = null;
            trenutnirazgovor = Korisnik.lista[selfId].korisnicko_ime;
        }
        Poruka.prikaziPoruke();
        divCaskanja.scrollTop = divCaskanja.scrollHeight;
        posebanSelekt.selectedIndex = -1;
        selektSvihKorisnika.selectedIndex = -1;
    }
}
selektSvihKorisnika.onchange = function() {
    if (selektSvihKorisnika.selectedIndex != -1) {
        trenutnagrupa = null;
        trenutnirazgovor = Korisnik.lista[selektSvihKorisnika.value].korisnicko_ime;
        Poruka.prikaziPoruke();
        divCaskanja.scrollTop = divCaskanja.scrollHeight;
    }
    posebanSelekt.selectedIndex = -1;
    selektSvihKorisnika.selectedIndex = -1;
}

formaPrijava.onsubmit = function(e) {
    e.preventDefault();
    let korisnicko_ime = document.getElementById("korisnicko_ime").value;
    let lozinka = document.getElementById("lozinka").value;
    socket.emit("prijava", {
        korisnicko_ime: korisnicko_ime,
        lozinka: lozinka
    });
}
btnReg.onclick = function(e) {
    e.preventDefault();
    let korisnicko_ime = document.getElementById("korisnicko_ime").value;
    let lozinka = document.getElementById("lozinka").value;
    socket.emit("registracija", {
        korisnicko_ime: korisnicko_ime,
        lozinka: lozinka
    });
}