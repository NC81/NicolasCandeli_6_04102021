// Générateur de contenu JSON pour la page des photographes
function chargePho() {
  fetch("FishEyeData.json").then(function(res) {
    if (res.ok) {
      console.log("ça marche PHO");
      return res.json();
    }
  })
  .then(function(data) {
    // Exploitation du contenu JSON du photographe
    for(let i=0; i < data.photographers.length; i++) {
      console.log("ID(page-pho)", sessionStorage.getItem("id"));
        if (data.photographers[i].id == sessionStorage.getItem("id")) {
        // DOM
        const nomPhotographePagePhoto = document.querySelector(".fiche-pho h1");
        const lieuPhotographePagePhoto = document.querySelector(".fiche-pho__lieu");
        const citationPhotographePagePhoto = document.querySelector(".fiche-pho__citation");
        const prixPhotographePagePhoto = document.querySelector(".infosup__prix");
        const portraitPhotographePagePhoto = document.querySelector(".img-fiche--pho");
        const listeEtiquettesPagePhoto = document.querySelector(".fiche-pho__liste");
        // Remplissage de la fiche
        nomPhotographePagePhoto.innerHTML = data.photographers[i].name;
        lieuPhotographePagePhoto.innerHTML = data.photographers[i].city + ", " + data.photographers[i].country;
        citationPhotographePagePhoto.innerHTML = data.photographers[i].tagline;
        prixPhotographePagePhoto.innerHTML = data.photographers[i].price;
        portraitPhotographePagePhoto.src= "./images/id_photos/" + data.photographers[i].portrait;
        portraitPhotographePagePhoto.alt= "" + data.photographers[i].name;
        // Création des Étiquettes
        for(let t=0; t < data.photographers[i].tags.length; t++) {
          const nouveauLi = document.createElement("li");
          const nouveauA = document.createElement("a");
          listeEtiquettesPagePhoto.appendChild(nouveauLi);
          nouveauLi.appendChild(nouveauA);
          nouveauA.innerHTML = "#" + data.photographers[i].tags[t];
        }
      }
    }
  })
  .catch(function(err) {
    console.log("erreur fetch(fiche-pho)");
  });
}

setTimeout (function() {
    chargePho()
}, 100)