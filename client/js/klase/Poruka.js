Poruka = {};

Poruka.prikaziPoruke = function() {
    divCaskanja.innerHTML = "";
    if (selektSvihKorisnika.selectedIndex == 0) { //Svi
        for (var i in javneporuke) {
            Poruka.dodajPoruku(javneporuke[i]); //Ovo za sad ide po dobrom redu
        }
        divIzabranog.innerText = "#SVI KORISNICI";
        //console.log("Prikazujem poruke za sve korisnike. ");
    } else if (selektSvihKorisnika.selectedIndex != -1) { //Jedan primalac
        var id = selektSvihKorisnika.value;
        if (Korisnik.lista[id]) {
            for (var i in Korisnik.lista[id].poruke) {
                Poruka.dodajPoruku(Korisnik.lista[id].poruke[i]);
            }
            divIzabranog.innerText = Korisnik.lista[id].korisnicko_ime;
        }
    }
    //u suprotnom su grupe
}
Poruka.dodajPoruku = function(tekst) { //Posiljalac je trenutno deo teksta poruke
    var poruka = document.createElement("div");
    poruka.innerText = tekst;
    divCaskanja.appendChild(poruka);
}