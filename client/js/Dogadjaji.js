var formaPrijava = document.getElementById("logregforma");
var container = document.getElementById("container");
var btnReg = document.getElementById("registracija");
var divCaskanja = document.getElementById("caskanje");
var divSvihKorisnika = document.getElementById("svi");
var divIzabranog = document.getElementById("izabran");
var formaSlanjaPoruke = document.getElementById("formaSlanjaPoruke");
var selektSvihKorisnika = document.getElementById("selektkorisnika");
var taPoruke = document.getElementById("poslataPoruka");

taPoruke.onkeydown = function(e) {
    if (e.keyCode == 13) {
        if (/\S/.test(taPoruke.value)) { //Ako poruka nema whitespace ne salje se
            if (selektSvihKorisnika.selectedIndex == 0) { //Svi
                socket.emit("posaljiPorukuSvima", {
                    poruka: taPoruke.value
                });
            } else if (selektSvihKorisnika.selectedIndex != -1) { //Jedan primalac
                socket.emit("posaljiDmKorisniku", {
                    korisnicko_ime: Korisnik.lista[selektSvihKorisnika.value].korisnicko_ime,
                    poruka: taPoruke.value
                });
            }
            //U suprotnom nije nista selektovano, tu dolaze grupe
        }
        taPoruke.value = "";
    }
}
taPoruke.onkeyup = function(e) {
    if (e.keyCode == 13) {
        taPoruke.value = "";
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
selektSvihKorisnika.onchange = function() {
    if (selektSvihKorisnika.selectedIndex != -1) {
        Poruka.prikaziPoruke();
        divCaskanja.scrollTop = divCaskanja.scrollHeight;
    }
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