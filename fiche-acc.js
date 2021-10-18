// Générateur de contenu JSON pour la page accueil
function afficherPageAccueil() {
  fetch("FishEyeData.json").then(function(res) {
      if (res.ok) {
        console.log("ça marche ACC");
        return res.json();
      }
    })
  .then(function(data) {
    // Génération de fiche pour chaque photographe
    for(let i=0; i < data.photographers.length; i++) {
      // Création des balises
      const sectionPageAccueil = document.querySelector(".acc-main section");
      const nouveauDiv = document.createElement("div");
      const nouveauA = document.createElement("a");
      const nouveauImg = document.createElement("img");
      const nouveauH2 = document.createElement("h2");
      const nouveauP = document.createElement("p");
      const nouveauUl = document.createElement("ul");
      sectionPageAccueil.appendChild(nouveauDiv);
      nouveauDiv.appendChild(nouveauA);
      nouveauDiv.appendChild(nouveauP);
      nouveauDiv.appendChild(nouveauP.cloneNode(true));
      nouveauDiv.appendChild(nouveauP.cloneNode(true));
      nouveauDiv.appendChild(nouveauUl);
      nouveauA.appendChild(nouveauImg);
      nouveauA.appendChild(nouveauH2);
      // Désignation de classes
      nouveauDiv.setAttribute("class", "fiche-acc");
      nouveauImg.setAttribute("class", "img-fiche");
      nouveauA.setAttribute("class", "fiche-acc__lien");
      nouveauUl.setAttribute("class", "fiche-acc__liste");
    }
    // DOM
    const nomsPhotographePageAccueil = document.querySelectorAll(".fiche-acc__lien h2");
    const portraitsPageAccueil = document.querySelectorAll(".img-fiche"); 
    const lieuxPhotographePageAccueil = document.querySelectorAll(".fiche-acc p:nth-of-type(1)");
    const liensPhotographePageAccueil = document.querySelectorAll(".fiche-acc__lien");
    const citationsPhotographePageAccueil = document.querySelectorAll(".fiche-acc p:nth-of-type(2)");
    const prixPhotographePageAccueil = document.querySelectorAll(".fiche-acc p:nth-of-type(3)"); 
    const listeEtiquettesPageAccueil = document.querySelectorAll(".fiche-acc__liste");
    // Exploitation du contenu JSON pour chaque photographe
    for(let i=0; i < data.photographers.length; i++) {
      // Remplissage des fiches (nom, portrait, lieu, citation, prix) 
      nomsPhotographePageAccueil[i].textContent = data.photographers[i].name;
      portraitsPageAccueil[i].src = "./images/id_photos/" + data.photographers[i].portrait;
      lieuxPhotographePageAccueil[i].textContent = data.photographers[i].city + ", " + data.photographers[i].country;
      citationsPhotographePageAccueil[i].textContent = data.photographers[i].tagline;
      prixPhotographePageAccueil[i].textContent = data.photographers[i].price + " €";
      // Inscription de l'ID et du chemin de navigation
      liensPhotographePageAccueil[i].setAttribute("data-id", data.photographers[i].id);
      liensPhotographePageAccueil[i].setAttribute("href", "photographe.html");
      // Création des étiquettes
      for(let t=0; t < data.photographers[i].tags.length; t++) {
      const nouveauLi = document.createElement("li");
      const nouveauA = document.createElement("a");
      listeEtiquettesPageAccueil[i].appendChild(nouveauLi);
      nouveauLi.appendChild(nouveauA);
      nouveauA.innerHTML = "#" + data.photographers[i].tags[t];
      }
    }
  })
  .catch(function(err) {
  console.log("erreur fetch(fiche-acc)");
  });
}

afficherPageAccueil();

// Évènement de clic (pour accèder à la page des photographes)
const photographeId = function (){
  const liensPhotographePageAccueil = document.querySelectorAll(".fiche-acc__lien");
  console.log("évènement prêt");
  for(let i=0; i < liensPhotographePageAccueil.length; i++) {
    liensPhotographePageAccueil[i].addEventListener("click", function() {
    console.log("ID(page-acc)", liensPhotographePageAccueil[i].getAttribute("data-id"));
    sessionStorage.setItem("id", liensPhotographePageAccueil[i].getAttribute("data-id"));
    })
  }
}

setTimeout (function() {
  photographeId()
}, 100)