Poruka = {};

Poruka.prikaziPoruke = function() {
    divCaskanja.innerHTML = "";
    if (trenutnirazgovor) {
        var trenutnirazgovarac = Korisnik.nadjiKorisnikaPoImenu(trenutnirazgovor); //Zbog srca dodato
        if (trenutnirazgovarac == null) {
            Poruka.dodajPoruku("Obavestenje: Osoba koju pokusavate da kontaktirate trenutno nije aktivna. ")
            return;
        }
        for (var i in trenutnirazgovarac.poruke) {
            Poruka.dodajPoruku(trenutnirazgovarac.poruke[i]);
        }
        divIzabranog.innerText = trenutnirazgovor;
    } else if (trenutnagrupa) {
        var trenutnigrupnirazgovor = Grupa.nadjiGrupuPoNazivuIVlasniku(trenutnagrupa);
        if (trenutnigrupnirazgovor == null) {
            Poruka.dodajPoruku("Obavestenje: Grupa koju pokusavate da kontaktirate ne postoji. ")
            return;
        }
        for (var i in trenutnigrupnirazgovor.poruke) {
            Poruka.dodajPoruku(trenutnigrupnirazgovor.poruke[i]);
        }
        divIzabranog.innerText = "Grupa: " + trenutnagrupa.naziv + " (" + trenutnagrupa.vlasnik + ")";
    } else //svi
    {
        for (var i in javneporuke) {
            Poruka.dodajPoruku(javneporuke[i]);
        }
        divIzabranog.innerText = "#SVI";
    }
    //u suprotnom su grupe
}
Poruka.dodajPoruku = function(tekst) { //Posiljalac je trenutno deo teksta poruke
    var poruka = document.createElement("div");
    poruka.innerText = tekst;
    divCaskanja.appendChild(poruka);
}