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
var adminKomande = document.getElementById("adminkomande");
var smrtnikKomande = document.getElementById("smrtnikkomande");
var selektAktivnihClanova = document.getElementById("selektaktivnihclanova");
var selektSvihClanova = document.getElementById("selektsvihclanova");
var btnBrisiGrupu = document.getElementById("btnBrisiGrupu");
var tbNapraviGrupu = document.getElementById("tbNapraviGrupu");
var btnIzadji = document.getElementById("btnIzadji");
var dodajClanaInpt = document.getElementById("dodajClanaInpt");
var izbaciClanaInput = document.getElementById("izbaciClanaInput");
var opcijeCont = document.getElementById("opcijecont");


dodajClanaInpt.onkeydown = function(e) {
    if (e.keyCode == 13) {
        if (/\S/.test(dodajClanaInpt.value)) //Ako poruka nema whitespace ne salje se
        {
            socket.emit("dodajClanaUGrupu", { korisnicko_ime: dodajClanaInpt.value, naziv: trenutnagrupa.naziv });
        }
        dodajClanaInpt.value = "";
    }
}
dodajClanaInpt.onkeyup = function(e) {
    if (e.keyCode == 13) {
        dodajClanaInpt.value = "";
    }
}
izbaciClanaInput.onkeydown = function(e) {
    if (e.keyCode == 13) {
        if (/\S/.test(izbaciClanaInput.value)) //Ako poruka nema whitespace ne salje se
        {
            socket.emit("ukloniClanaIzGrupe", { korisnicko_ime: izbaciClanaInput.value, vlasnik: trenutnagrupa.vlasnik, naziv: trenutnagrupa.naziv });
        }
        izbaciClanaInput.value = "";
    }
}
izbaciClanaInput.onkeyup = function(e) {
    if (e.keyCode == 13) {
        izbaciClanaInput.value = "";
    }
}
btnIzadji.onclick = function(e) {
    socket.emit("ukloniClanaIzGrupe", { korisnicko_ime: Korisnik.lista[selfId].korisnicko_ime, vlasnik: trenutnagrupa.vlasnik, naziv: trenutnagrupa.naziv });
}
tbNapraviGrupu.onkeydown = function(e) {
    if (e.keyCode == 13) {
        if (/\S/.test(tbNapraviGrupu.value)) //Ako poruka nema whitespace ne salje se
        {
            socket.emit("napraviGrupu", { naziv: tbNapraviGrupu.value });
        }
        tbNapraviGrupu.value = "";
    }
}
tbNapraviGrupu.onkeyup = function(e) {
    if (e.keyCode == 13) {
        tbNapraviGrupu.value = "";
    }
}
btnBrisiGrupu.onclick = function() {
    socket.emit("obrisiGrupu", { naziv: trenutnagrupa.naziv });
}





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
                socket.emit("posaljiPorukuUGrupu", {
                    vlasnik: trenutnagrupa.vlasnik,
                    naziv: trenutnagrupa.naziv,
                    poruka: taPoruke.value
                });
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
        trenutnagrupa = null;
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

//Ponavljajuci kod, ali ok radi
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
        selektSvihGrupa.selectedIndex = -1;
        opcijeCont.style.display = "none";
    }
}
selektSvihGrupa.onchange = function() {
    if (selektSvihGrupa.selectedIndex != -1) {
        trenutnagrupa = { naziv: Grupa.lista[selektSvihGrupa.value].naziv, vlasnik: Grupa.lista[selektSvihGrupa.value].vlasnik };
        trenutnirazgovor = null;
        Poruka.prikaziPoruke();
        Grupa.prikaziOpcije();
        divCaskanja.scrollTop = divCaskanja.scrollHeight;
        posebanSelekt.selectedIndex = -1;
        selektSvihKorisnika.selectedIndex = -1;
        selektSvihGrupa.selectedIndex = -1;
    }
}
selektSvihKorisnika.onchange = function() {
    if (selektSvihKorisnika.selectedIndex != -1) {
        trenutnagrupa = null;
        trenutnirazgovor = Korisnik.lista[selektSvihKorisnika.value].korisnicko_ime;
        Poruka.prikaziPoruke();
        divCaskanja.scrollTop = divCaskanja.scrollHeight;
        posebanSelekt.selectedIndex = -1;
        selektSvihKorisnika.selectedIndex = -1;
        selektSvihGrupa.selectedIndex = -1;
        opcijeCont.style.display = "none";
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