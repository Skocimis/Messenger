var formaPrijava = document.getElementById("logregforma");
var container = document.getElementById("container");
var btnReg = document.getElementById("registracija");
var divCaskanja = document.getElementById("poruke");
var divSvihKorisnika = document.getElementById("svi");
var divIzabranog = document.getElementById("izabran");
var formaSlanjaPoruke = document.getElementById("formaSlanjaPoruke");
var listaKorisnika = document.getElementById("listakorisnika");
var listaGrupa = document.getElementById("listagrupa");
var pretragaKorisnika = document.getElementById("tbPretragaKorisnika");
var pretragaGrupa = document.getElementById("tbPretragaGrupa");
var taPoruke = document.getElementById("taPoruke");
var adminKomande = document.getElementById("adminkomande");
var smrtnikKomande = document.getElementById("smrtnikkomande");
var listaAktivnihClanova = document.getElementById("listaaktivnihclanova");
var listaSvihClanova = document.getElementById("listasvihclanova");
var btnBrisiGrupu = document.getElementById("btnBrisiGrupu");
var tbNapraviGrupu = document.getElementById("tbNapraviGrupu");
var btnIzadji = document.getElementById("btnIzadji");
var dodajClanaInpt = document.getElementById("dodajClanaInput");
var izbaciClanaInput = document.getElementById("izbaciClanaInput");
var opcijeCont = document.getElementById("grupa");
var hederDiv = document.getElementById("heder");
var teloDokumenta = document.querySelector("body");
var shift = false;

updateElements = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (trenutnagrupa) {
        teloDokumenta.style.backgroundColor = "rgb(13, 41, 29)";
        document.getElementById("srednjibar").style.maxWidth = (w - 500) + "px";
    } else {
        teloDokumenta.style.backgroundColor = "rgb(21, 36, 85)";
        document.getElementById("srednjibar").style.maxWidth = (w - 200) + "px";
    }
    //console.log(h + " - " + hederDiv.offsetHeight + " - " + taPoruke.offsetHeight + " - " + hederDiv.clientTop);
    divCaskanja.style.height = (h - hederDiv.offsetHeight - taPoruke.offsetHeight) + "px";
    //alert((h - hederDiv.offsetHeight - taPoruke.offsetHeight));
    //taPoruke.
}
window.onresize = function() {
    updateElements();
}



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
    if (e.keyCode == 16) { shift = true; }
    if (!shift && e.keyCode == 13) {
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
    if (!shift && e.keyCode == 13) {
        taPoruke.value = "";
    }
    if (e.keyCode == 16) { shift = false; }
}
pretragaGrupa.onkeydown = function(e) {
    if (e.keyCode == 13) {
        var str = pretragaGrupa.value;
        var naziv = "";
        var vlasnik = null;
        if (str.indexOf("(") > 1 && str.indexOf(")") > 1 && str.indexOf(")") > str.indexOf("(")) {
            naziv = str.substring(0, str.indexOf("(") - 1);
            vlasnik = str.substring(str.indexOf("(") + 1, str.indexOf(")"));
        } else {
            naziv = str;
        }
        var grupa = Grupa.nadjiGrupuPoNazivuIVlasniku({ naziv: naziv, vlasnik: vlasnik });
        if (grupa) {
            trenutnirazgovor = null;
            trenutnagrupa = { naziv: grupa.naziv, vlasnik: grupa.vlasnik }
            Poruka.prikaziPoruke();
            divCaskanja.scrollTop = divCaskanja.scrollHeight;
        } else {
            alert("Nepostojeca grupa: " + naziv + "-" + vlasnik);
        }
    }
}
pretragaGrupa.onkeyup = function(e) {
    if (e.keyCode == 13) {
        pretragaGrupa.value = "";
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
    /*
    formaSlanjaPoruke.onsubmit = function(e) {
        e.preventDefault();
        //Samo ako je selektovan neki korisnik
        /*if (taPoruke.value != "") {
            socket.emit("posaljiDmKorisniku", {
                korisnicko_ime: Korisnik.lista[selektSvihKorisnika.value].korisnicko_ime,
                poruka: taPoruke.value
            });
        }
        taPoruke.value = "";* /
    }*/

//Ponavljajuci kod, ali ok radi
/*





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




*/

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