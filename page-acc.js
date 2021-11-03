const photographes = [];

// Affiche le contenu JSON pour la page d'accueil
let affichePageAccueil = () => {
  fetch("FishEyeData.json").then(function(res) {
    if (res.ok) {
      console.log("res.ok(page-acc)");
      return res.json();
    }
  })
  .then(function(data) {
    for (let i=0; i < data.photographers.length; i++) {
      photographes.push(data.photographers[i]);  
    }

    accueil.affichage();
    vignettes.filtre();
  })
  .catch(function(err) {
  console.log("erreur fetch(page-acc)", err);
  });
}
affichePageAccueil();

// Méthodes affichant la page
class affichageAccueil {
  // Construction du DOM
  structure() {
    // eslint-disable-next-line no-unused-vars
    for(let _pho of photographes) {
      // Création de la structure HTML
      const sectionPageAccueil = document.querySelector(".acc-main section");
      const nouveauDiv = document.createElement("div");
      sectionPageAccueil.appendChild(nouveauDiv);
      nouveauDiv.innerHTML = "<a><img><h2></h2></a><p></p><p></p><p></p><ul></ul>";
      // Désignation des sélecteurs
      nouveauDiv.setAttribute("class", "vignette");
      nouveauDiv.firstChild.setAttribute("class", "vignette__lien");
      nouveauDiv.firstChild.firstChild.setAttribute("class", "img-fiche");
      nouveauDiv.lastChild.setAttribute("class", "vignette__liste");
    }
  }
  // Remplissage à partir des données JSON
  affichage() {
    this.structure();
    // Génération de fiche pour chaque photographe
    // DOM
    const nomsPhotographePageAccueil = document.querySelectorAll(".vignette__lien h2");
    const portraitsPageAccueil = document.querySelectorAll(".img-fiche"); 
    const lieuxPhotographePageAccueil = document.querySelectorAll(".vignette p:nth-of-type(1)");
    const liensPhotographePageAccueil = document.querySelectorAll(".vignette__lien");
    const citationsPhotographePageAccueil = document.querySelectorAll(".vignette p:nth-of-type(2)");
    const prixPhotographePageAccueil = document.querySelectorAll(".vignette p:nth-of-type(3)"); 
    const listeetiquetteContenusPageAccueil = document.querySelectorAll(".vignette__liste");
    // Exploitation du contenu JSON pour chaque photographe
    for(let p=0; p < photographes.length; p++) {
      let photographeId = photographes[p].id;
      // Remplissage des fiches (nom, portrait, lieu, citation, prix) 
      nomsPhotographePageAccueil[p].textContent = photographes[p].name;
      portraitsPageAccueil[p].src = "./images/id_photos/" + photographes[p].portrait;
      lieuxPhotographePageAccueil[p].textContent = photographes[p].city + ", " + photographes[p].country;
      citationsPhotographePageAccueil[p].textContent = photographes[p].tagline;
      prixPhotographePageAccueil[p].textContent = photographes[p].price + " €";
      // Inscription de l'ID et du chemin de navigation
      liensPhotographePageAccueil[p].setAttribute("data-id", photographes[p].id);
      liensPhotographePageAccueil[p].setAttribute("href", "photographe.html?phoID=" + photographeId);
      // Création des étiquettes
      for(let t=0; t < photographes[p].tags.length; t++) {
      const nouveauLi = document.createElement("li");
      const nouveauA = document.createElement("a");
      listeetiquetteContenusPageAccueil[p].appendChild(nouveauLi);
      nouveauLi.appendChild(nouveauA);
      nouveauA.innerHTML = "#" + photographes[p].tags[t];
      }
    }
  }
}
const accueil= new affichageAccueil();

// Méthodes triant selon l'étiquette
let etiquetteContenu;
class FiltrageVignettes {
  // Inscription d'attribut aux vignettes à filtrer
  definit() {
    const vignettes = document.querySelectorAll(".acc-main section div");
    for (let vignette of vignettes) {
      vignette.setAttribute("data-correct", "false");
      const lis = vignette.lastChild.children;
      for (let li of lis) {
        if (li.firstChild.textContent == etiquetteContenu) {
          vignette.setAttribute("data-correct", "true");
        }
      }
    }
  }
  // Affichage du DOM selon l'etiquette
  affiche() {
    const vignettes = document.querySelectorAll(".acc-main section div");
    for (let vignette of vignettes) {
      if (vignette.getAttribute("data-correct") == "false") {
        vignette.style.display = "none";
      } else {
        vignette.style.display = "block";
      }
    }
  }
  // Filtrage final
  filtre() {
    const lietiquetteContenusHeader = document.querySelectorAll(".header__liste li");
    for (let li of lietiquetteContenusHeader) {
      li.addEventListener("click", () => {
        etiquetteContenu = li.firstChild.textContent.toLowerCase();
        this.definit();
        this.affiche(); 
      })
    }
  }
}
const vignettes = new FiltrageVignettes();