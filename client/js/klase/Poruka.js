Poruka = {};

Poruka.prikaziPoruke = function() {
    divCaskanja.innerHTML = "";
    if (trenutnirazgovor) {
        var trenutnirazgovarac = Korisnik.nadjiKorisnikaPoImenu(trenutnirazgovor);
        if (trenutnirazgovarac == null) {
            Poruka.dodajPoruku("Obavestenje: Osoba koju pokusavate da kontaktirate trenutno nije aktivna. ")
            return;
        }
        for (var i in trenutnirazgovarac.poruke) {
            Poruka.dodajPoruku(trenutnirazgovarac.poruke[i]);
        }
        divIzabranog.innerText = trenutnirazgovor;
    } else if (trenutnagrupa) {

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