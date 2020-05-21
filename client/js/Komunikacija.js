var socket = io();

socket.on("odgovorNaRegistraciju", function(rezultat) {
    document.getElementById("rezPrijave").innerText = rezultat.poruka;
});
socket.on("odgovorNaPrijavu", function(rezultat) {
    if (!rezultat.uspeh) return alert("Netacni podaci. ");
    formaPrijava.style.display = "none";
    container.style.display = "block";
    updateElements();
});


socket.on("inicijalizacija", function(podaci) {
    if (podaci.selfId) {
        selfId = podaci.selfId;
    }
    //alert(podaci.grupe.length);
    /*var korisnickaOpcija = document.createElement("option");
    korisnickaOpcija.innerText = "Ja (" + Korisnik.lista[selfId].korisnicko_ime + ")";
    posebanSelekt.appendChild(korisnickaOpcija);*/
    for (var i = 0; i < podaci.korisnici.length; i++) {
        new Korisnik(podaci.korisnici[i]);
    }
    /*for (var i = 0; i < podaci.grupe.length; i++) {
        new Grupa(podaci.grupe[i]);
    }*/
    Korisnik.prikaziSve();
    Grupa.prikaziSve();
    Poruka.prikaziPoruke();
});
socket.on("prijavljenKorisnik", function(podaci) {
    new Korisnik(podaci);
    Korisnik.prikaziSve();
    //Kasnije samo ako je clan grupe
    Grupa.prikaziOpcije();
});

socket.on("odjavljenKorisnik", function(podaci) {
    //alert("ee");
    if (!Korisnik.lista[podaci.id]) { //OVDE SE JAVILA GRESKA, msm da ovo resava
        Korisnik.prikaziSve();
        //Kasnije samo ako je clan grupe
        Grupa.prikaziOpcije();
        return;
    }
    if (Korisnik.lista[podaci.id].korisnicko_ime == trenutnirazgovor) {
        Poruka.dodajPoruku(Korisnik.lista[podaci.id].korisnicko_ime + " više nije aktivan. ");
    }
    delete Korisnik.lista[podaci.id];
    Korisnik.prikaziSve();
    //Kasnije samo ako je clan grupe
    Grupa.prikaziOpcije();
});


socket.on("dodajUPrivatni", function(podaci) {
    for (var i in Korisnik.lista) {
        if (Korisnik.lista[i].korisnicko_ime == podaci.korisnicko_ime) {
            Korisnik.lista[i].poruke.push(podaci.poruka);
            Poruka.prikaziPoruke();
            return;
        }
    }
});
socket.on("dodajPorukuUGrupu", function(podaci) {
    //alert(podaci.naziv + "(" + podaci.vlasnik + ")");
    for (var i in Grupa.lista) {
        if (!Grupa.lista[i]) continue;
        if (Grupa.lista[i].naziv == podaci.naziv && Grupa.lista[i].vlasnik == podaci.vlasnik) {
            //alert("nova poruka u grupi: " + podaci.poruka);
            Grupa.lista[i].poruke.push(podaci.posiljalac + ": " + podaci.poruka);
            Poruka.prikaziPoruke();
            return;
        }
    }
});
socket.on("novaPoruka", function(podaci) {
    javneporuke.push(podaci.poruka); //Podaci bi trebali da sadrze i korisnika koji je poslao poruku ako bih hteo da dodam blokiranje
    Poruka.prikaziPoruke();
});
socket.on("odgovorNaPravljenjeGrupe", function(podaci) {
    alert(podaci.poruka);
});
socket.on("odgovorNaBrisanjeGrupe", function(podaci) {
    alert(podaci.poruka);
});
socket.on("odgovorNaDodavanjeClana", function(podaci) {
    alert(podaci.poruka);
});
socket.on("odgovorNaUklanjanjeClana", function(podaci) {
    alert(podaci.poruka);
});

socket.on("obrisanaGrupa", function(podaci) {
    //alert(podaci.naziv + " " + podaci.vlasnik);
    for (var i in Grupa.lista) {
        if (!Grupa.lista[i]) continue;
        if (Grupa.lista[i].vlasnik == podaci.vlasnik && Grupa.lista[i].naziv == podaci.naziv) {
            Grupa.lista[i] = null;

            if (trenutnagrupa && trenutnagrupa.vlasnik == podaci.vlasnik && trenutnagrupa.naziv == podaci.naziv) {
                trenutnirazgovor = null;
                trenutnagrupa = null;
                opcijeCont.style.display = "none";
                Poruka.prikaziPoruke();
            }
            Grupa.prikaziSve();
        }
    }
    Grupa.prikaziSve();
});
socket.on("noviClanovi", function(podaci) {
    for (var i in Grupa.lista) {
        if (!Grupa.lista[i]) continue;
        if (Grupa.lista[i].naziv == podaci.naziv && Grupa.lista[i].vlasnik == podaci.vlasnik) {
            Grupa.lista[i].aktivni = podaci.aktivni;
            Grupa.lista[i].clanovi = podaci.clanovi;
            Grupa.prikaziOpcije();
            return;
        }
    }
    new Grupa(podaci);
    Grupa.prikaziSve();
});