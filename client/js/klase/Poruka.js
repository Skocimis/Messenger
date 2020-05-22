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
        divIzabranog.innerText = trenutnagrupa.naziv + " (" + trenutnagrupa.vlasnik + ")";
    } else //svi
    {
        for (var i in javneporuke) {
            Poruka.dodajPoruku(javneporuke[i]);
        }
        divIzabranog.innerText = "#SVI";
    }
    Grupa.prikaziOpcije();
    updateElements();
    //u suprotnom su grupe
}
Poruka.dodajPoruku = function(tekst) { //Posiljalac je trenutno deo teksta poruke
    let poruka = document.createElement("div");
    let granica = tekst.indexOf(":");
    let posiljalac = tekst.substring(0, granica);
    let telo = tekst.substring(granica + 1, tekst.length);
    let elemp = document.createElement("span");
    elemp.style.color = "#192";
    elemp.style.fontWeight = "bold";
    elemp.style.fontSize = "larger";
    let elemt = document.createElement("span");
    elemp.innerText = posiljalac;
    elemp.innerHTML += "&nbsp;&nbsp;";
    elemt.innerText = telo;
    poruka.appendChild(elemp);
    poruka.appendChild(elemt);
    divCaskanja.appendChild(poruka);
}