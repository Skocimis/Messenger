var socket = io();

socket.on("odgovorNaRegistraciju", function(rezultat) {
    if (!rezultat.uspeh) alert("Zauzeto korisnicko ime!");
    else alert("Uspesna registracija");
});
socket.on("odgovorNaPrijavu", function(rezultat) {
    if (!rezultat.uspeh) return alert("Netacni podaci. ");
    formaPrijava.style.display = "none";
    container.style.display = "block";
});


socket.on("inicijalizacija", function(podaci) {
    if (podaci.selfId) {
        selfId = podaci.selfId;
    }
    for (var i = 0; i < podaci.korisnici.length; i++) {
        new Korisnik(podaci.korisnici[i]);
    }
    Korisnik.prikaziSve();
});
socket.on("prijavljenKorisnik", function(podaci) {
    new Korisnik(podaci);
    Korisnik.prikaziSve();
});

socket.on("odjavljenKorisnik", function(podaci) {
    delete Korisnik.lista[podaci.id];
    Korisnik.prikaziSve();
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
socket.on("novaPoruka", function(podaci) {
    javneporuke.push(podaci.poruka); //Podaci bi trebali da sadrze i korisnika koji je poslao poruku ako bih hteo da dodam blokiranje
    Poruka.prikaziPoruke();
});