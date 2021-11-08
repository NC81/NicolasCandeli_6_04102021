const photographes = [];
const pageBlock = document.querySelector(".bloc-page");

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
      // Nommage du DOM
      nouveauDiv.setAttribute("class", "vignette");
      nouveauDiv.firstChild.setAttribute("class", "vignette__lien");
      nouveauDiv.firstChild.firstChild.setAttribute("class", "present-img");
      nouveauDiv.lastChild.setAttribute("class", "vignette__liste");
    }
  }
  // Remplissage à partir des données JSON
  affichage() {
    this.structure();
    // Génération de fiche pour chaque photographe
    // DOM
    const nomsPhotographePageAccueil = document.querySelectorAll(".vignette__lien h2");
    const portraitsPageAccueil = document.querySelectorAll(".present-img"); 
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
      listeetiquetteContenusPageAccueil[p].appendChild(nouveauLi);
      nouveauLi.innerHTML= "<span>#" + photographes[p].tags[t] + "</span>" + "<span>Filtrer les photographes par " + photographes[p].tags[t] + "</span>"
      setAttributes(nouveauLi, {"role": "switch", "aria-checked": "false", "aria-labelledby": "acc-" + photographes[p].tags[t], "tabindex": "0"});
      setAttributes(nouveauLi.firstChild, {"class": "etiq-cont", "data-checked": "false"});
      setAttributes(nouveauLi.lastChild, {"id": "acc-" + photographes[p].tags[t], "class": "lect-ecran"});    
      }
    }
  }
}
const accueil= new affichageAccueil();

// Permet d'ajouter plusieurs attributs en une ligne
let setAttributes = (el, attrs) => {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

// Méthodes triant selon l'étiquette
let etiquettesTableau = [];
class FiltrageVignettes {
// Définit les vignettes à afficher et à effacer
  definit() {
    const etiquettesDom = document.querySelectorAll(".etiq-cont");
    const vignettes = document.querySelectorAll(".vignette");
    // Ajout du nom de l'étiquette sélectionnée à la classe des vignettes correspondantes
    for (let etqTab of etiquettesTableau) {
       for (let etq of etiquettesDom) {
        if ((etqTab === etq.textContent) && (!etq.parentElement.parentElement.parentElement.classList.contains("" + etqTab))) {
        etq.parentElement.parentElement.parentElement.className += " " + etqTab;
        }
      }
    }
    // Vérification des classes de chaque vignette pour définir l'attribut "data-correct"
    for (let vig of vignettes) {
      let listeDeClasses = vig.className.split(' '); 
      if ((listeDeClasses.length - 1) === etiquettesTableau.length) {
        vig.setAttribute("data-correct", "true");
      } else {
        vig.setAttribute("data-correct", "false");
      }
    }
  }
  // Affichage du DOM selon la valeur de l'attribut "data-correct"
  affiche() {
    const vignettes = document.querySelectorAll(".vignette");
    for (let v of vignettes) {
      if (v.dataset.correct === "true") {
        v.style.display = "block";
      } else {
        v.style.display = "none";
      }
    }
  }
  // Filtrage complet composé de l'évènement de cliquage
  filtre() {
    const vignettes = document.querySelectorAll(".vignette");
    const etiquettesDom = document.querySelectorAll(".etiq-cont");
    pageBlock.addEventListener("click", (evt) => {
      if ((evt.target.dataset.checked === "true") && (evt.target.className === "etiq-cont")) {
        let etiquetteContenu = evt.target.textContent.toLowerCase();
        // Assignation des attributs
        evt.target.dataset.checked = false;
        evt.target.parentElement.setAttribute("aria-checked", "false");
        for (let etq of etiquettesDom) { 
          if (etq.textContent.toLowerCase() == evt.target.textContent.toLowerCase()) {
            etq.setAttribute("data-checked", "false");
          }
        }
        // Modification du tableau d'étiquettes
        const index = etiquettesTableau.indexOf(etiquetteContenu);
        etiquettesTableau.splice(index, 1);
        console.log("tableau d'étiquettes", etiquettesTableau);
        for (let vig of vignettes) {
          if (vig.classList.contains("" + etiquetteContenu))  {
            vig.classList.remove("" + etiquetteContenu);
          }
        }
      } else if ((evt.target.dataset.checked === "false" ) && (evt.target.className === "etiq-cont")) {
        evt.target.parentElement.setAttribute("aria-checked", "true");
        for (let etq of etiquettesDom) {
          if (etq.textContent.toLowerCase() == evt.target.textContent.toLowerCase()) {
            etq.dataset.checked = true;
          }
        }
        let etiquetteCiblee = evt.target.textContent.toLowerCase();
        etiquettesTableau.push(etiquetteCiblee);
        console.log("tableau d'étiquettes", etiquettesTableau);
      }
      this.definit();
      this.affiche(); 
    });
    // Sélection de l'étiquette par le clavier
    pageBlock.addEventListener("keydown", (evt) => {
      if ((evt.target.tagName === "LI") && (evt.key === "Enter")) {
        evt.target.children[0].click();
      }
    });
  }
}
const vignettes = new FiltrageVignettes();