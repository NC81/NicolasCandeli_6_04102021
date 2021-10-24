// Affiche le contenu JSON pour la page d'accueil
let affichePageAccueil = () => {
  fetch("FishEyeData.json").then(function(res) {
    if (res.ok) {
      console.log("ça marche ACC");
      return res.json();
    }
  })
  .then(function(data) {
    // Génération de fiche pour chaque photographe
    for(let i=0; i < data.photographers.length; i++) {
      // Création de la structure HTML
      const sectionPageAccueil = document.querySelector(".acc-main section");
      const nouveauDiv = document.createElement("div");
      sectionPageAccueil.appendChild(nouveauDiv);
      nouveauDiv.innerHTML = "<a><img><h2></h2></a><p></p><p></p><p></p><ul></ul>";
      // Désignation des sélecteurs
      nouveauDiv.setAttribute("class", "fiche-acc");
      nouveauDiv.firstChild.setAttribute("class", "fiche-acc__lien");
      nouveauDiv.firstChild.firstChild.setAttribute("class", "img-fiche");
      nouveauDiv.lastChild.setAttribute("class", "fiche-acc__liste");
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
      let photographeId = data.photographers[i].id;
      // Remplissage des fiches (nom, portrait, lieu, citation, prix) 
      nomsPhotographePageAccueil[i].textContent = data.photographers[i].name;
      portraitsPageAccueil[i].src = "./images/id_photos/" + data.photographers[i].portrait;
      lieuxPhotographePageAccueil[i].textContent = data.photographers[i].city + ", " + data.photographers[i].country;
      citationsPhotographePageAccueil[i].textContent = data.photographers[i].tagline;
      prixPhotographePageAccueil[i].textContent = data.photographers[i].price + " €";
      // Inscription de l'ID et du chemin de navigation
      liensPhotographePageAccueil[i].setAttribute("data-id", data.photographers[i].id);
      liensPhotographePageAccueil[i].setAttribute("href", "photographe.html?phoID=" + photographeId);
      // Création des étiquettes
      for(let t=0; t < data.photographers[i].tags.length; t++) {
      const nouveauLi = document.createElement("li");
      const nouveauA = document.createElement("a");
      listeEtiquettesPageAccueil[i].appendChild(nouveauLi);
      nouveauLi.appendChild(nouveauA);
      nouveauA.innerHTML = "#" + data.photographers[i].tags[t];
      }
    }
    filtreVignettes();
  })
  .catch(function(err) {
  console.log("erreur fetch(fiche-acc):", err);
  });
}

affichePageAccueil();

// Fonction globale filtrant les vignettes selon l'étiquette choisie
const liEtiquettesHeader = document.querySelectorAll(".header__liste li");
let etiquette;
let filtreVignettes = () => {
  for (let li of liEtiquettesHeader) {
    li.addEventListener("click", () => {
      etiquette = li.firstChild.textContent;
      definitVignettes();
      afficheVignettes(); 
    })
  }
}

// Fonction définissant une valeur pour l'attribut "data-correct"
let definitVignettes = () => {
  const vignettes = document.querySelectorAll(".acc-main section div");
  for (let vignette of vignettes) {
    vignette.setAttribute("data-correct", "false");
    const lis = vignette.lastChild.children;
    for (let li of lis) {
      if (li.firstChild.textContent == etiquette) {
        vignette.setAttribute("data-correct", "true");
      } else {
        console.log("L'étiquette choisie ne correspond à aucun photographe");
      }
    }
  }
}

// Fonction affichant les vignettes selon la valeur de l'attribut "data-correct"
let afficheVignettes = () => {
  const vignettes = document.querySelectorAll(".acc-main section div");
  for (let vignette of vignettes) {
    if (vignette.getAttribute("data-correct") == "false") {
      vignette.style.display = "none";
    } else {
      vignette.style.display = "block";
    }
  }
}