const photographes = []; /* Recense toutes les informations des photographes */
const lienPageAccueil = document.querySelector(".header > a");

// Affiche le contenu JSON pour la page d'accueil
const affichePageAccueil = () => {
  fetch("FishEyeData.json").then(function(res) {
    if (res.ok) {
      console.log("res.ok(page-acc)");
      return res.json();
    }
  })
  // Exploitation du JSON
  .then(function(data) {
    for (let i=0; i < data.photographers.length; i++) {
      photographes.push(data.photographers[i]);  /* Rangement des informations des photographes */
    }
    return photographes;
  })
  // Remplissage de la page et manipulation du DOM
  .then(function(photographes) {
    affichage.controle(photographes); /* Affichage de la page */
    vignettes.filtre(); /* Activation du filtrage par les étiquettes */

    lienPageAccueil.focus();
  })
  .catch(function(err) {
    console.error("erreur fetch(page-acc)", err);
  });
}
affichePageAccueil();

// Permet d'ajouter plusieurs attributs à un élément
const setAttributes = (elt, attrs) => {
  for(let cle in attrs) {
    elt.setAttribute(cle, attrs[cle]);
  }
}

// Méthodes affichant la page
class affichagePageAccueil {
  // Construction du DOM
  structureVignettes(photographes) {
    // eslint-disable-next-line no-unused-vars
    for(let photographe of photographes) {
      // Création de la structure HTML pour chaque vignette
      const sectionPageAccueil = document.querySelector(".acc-main section");
      const nouveauDiv = document.createElement("div");
      sectionPageAccueil.appendChild(nouveauDiv);
      nouveauDiv.innerHTML = "<a><img><h2></h2></a><p></p><p></p><p></p><div></div>";
      // Nommage du DOM
      nouveauDiv.classList.add("vignette");
      nouveauDiv.firstChild.classList.add("vignette__lien");
      nouveauDiv.firstChild.firstChild.classList.add("present-img");
      setAttributes(nouveauDiv.lastChild, {"class": "vignette__liste-etiq", "role": "list"});
    }
  }
  // Remplissage à partir des données JSON
  remplitVignettes(photographes) {
    // DOM
    const nomsPhotographePageAccueil = document.querySelectorAll(".vignette__lien h2");
    const portraitsPageAccueil = document.querySelectorAll(".present-img"); 
    const lieuxPhotographePageAccueil = document.querySelectorAll(".vignette p:nth-of-type(1)");
    const liensPhotographePageAccueil = document.querySelectorAll(".vignette__lien");
    const citationsPhotographePageAccueil = document.querySelectorAll(".vignette p:nth-of-type(2)");
    const prixPhotographePageAccueil = document.querySelectorAll(".vignette p:nth-of-type(3)"); 
    const listeetiquetteContenusPageAccueil = document.querySelectorAll(".vignette__liste-etiq");
    // Exploitation du contenu JSON pour chaque photographe
    for(let p=0; p < photographes.length; p++) {
      const photographeId = photographes[p].id;
      // Remplissage des vignettes (nom, portrait, lieu, citation, prix)
      nomsPhotographePageAccueil[p].textContent = photographes[p].name;
      setAttributes(portraitsPageAccueil[p], {"src": "./images/id_photos/" + photographes[p].portrait, "alt": ""});
      lieuxPhotographePageAccueil[p].textContent = photographes[p].city + ", " + photographes[p].country;
      citationsPhotographePageAccueil[p].textContent = photographes[p].tagline;
      prixPhotographePageAccueil[p].textContent = photographes[p].price + " €";
      // Inscription de l'ID dans l'URL (page photographe)
      liensPhotographePageAccueil[p].setAttribute("href", "photographe.html?phoID=" + photographeId);
      // Création des étiquettes
      for(let t=0; t < photographes[p].tags.length; t++) {
        const nouveauBouton = document.createElement("button");
        listeetiquetteContenusPageAccueil[p].appendChild(nouveauBouton);
        nouveauBouton.innerHTML= "<span>#" + photographes[p].tags[t] + "</span>";
        setAttributes(nouveauBouton, {"aria-pressed": "false", "aria-labelledby": "acc-" + photographes[p].tags[t], "tabindex": "0"});
        nouveauBouton.firstChild.classList.add("etiq-cont");
      }
    }
  }
  afficheBouton() {
    const aside = document.querySelector("aside");
    window.addEventListener("scroll", () => {
      if(window.scrollY >= 500) {
        aside.dataset.visible = "true";
      } else {
        aside.dataset.visible = "false";
      }
      if(aside.dataset.visible === "true") {
        aside.style.display = "block";
      } else {
        aside.style.display = "none";
      }
    });
  }
  controle(photographes) {
    this.structureVignettes(photographes);
    this.remplitVignettes(photographes);
    this.afficheBouton();
  }
}
const affichage = new affichagePageAccueil();

// Méthodes triant selon l'étiquette
const etiquettesTableau = []; /* Actualise toutes les étiquettes activées */
class FiltrageVignettes {
// Définition des vignettes à afficher et à effacer
  definit() {
    const etiquettesDom = document.querySelectorAll(".etiq-cont");
    const vignettes = document.querySelectorAll(".vignette");
    // Ajout du nom de l'étiquette sélectionnée à la classe des vignettes correspondantes
    for (let etiquetteTableau of etiquettesTableau) {
       for (let etiquetteDom of etiquettesDom) {
        if ((etiquetteTableau === etiquetteDom.textContent) && (!etiquetteDom.parentElement.parentElement.parentElement.classList.contains("" + etiquetteTableau))) {
          etiquetteDom.parentElement.parentElement.parentElement.className += " " + etiquetteTableau;
        }
      }
    }
    // Vérification de la longueur des classes de chaque vignette pour définir l'attribut "data-correct"
    for (let vignette of vignettes) {
      const listeDeClasses = vignette.className.split(' ');
      if ((listeDeClasses.length - 1) === etiquettesTableau.length) {
        vignette.setAttribute("data-correct", "true");
      } else {
        vignette.setAttribute("data-correct", "false");
      }
    }
  }
  // Affichage des vignettes selon la valeur de leur attribut "data-correct"
  affiche() {
    const vignettes = document.querySelectorAll(".vignette");
    for (let vignette of vignettes) {
      if (vignette.dataset.correct === "true") {
        vignette.style.display = "block";
      } else {
        vignette.style.display = "none";
      }
    }
  }
  // Méthode globale de filtrage
  filtre() {
    const vignettes = document.querySelectorAll(".vignette");
    const boutonsEtiquette = document.querySelectorAll("button");
    const blocPage = document.querySelector(".bloc-page");
    // Évènement de cliquage du bouton d'étiquette
    blocPage.addEventListener("click", (evt) => {
      // ... si le bouton a déjà été pressé
      if ((evt.target.getAttribute("aria-pressed") === "true") && (evt.target.tagName === "BUTTON")) {
        const etiquetteContenu = evt.target.children[0].textContent.toLowerCase();
        // Assignation de l'attribut "aria-pressed"
        evt.target.setAttribute("aria-pressed", "false");
        for (let bouton of boutonsEtiquette) {
          if (bouton.children[0].textContent.toLowerCase() === evt.target.children[0].textContent.toLowerCase()) {
            bouton.setAttribute("aria-pressed", "false");
          }
        }
        // Modification du tableau d'étiquettes
        const index = etiquettesTableau.indexOf(etiquetteContenu);
        etiquettesTableau.splice(index, 1);
        // console.log("tableau d'étiquettes", etiquettesTableau);
        for (let vignette of vignettes) {
          if (vignette.classList.contains("" + etiquetteContenu))  {
            vignette.classList.remove("" + etiquetteContenu);
          }
        }
      // ... si le bouton n'a pas été pressé
      } else if ((evt.target.getAttribute("aria-pressed") === "false") && (evt.target.tagName === "BUTTON")) {
        evt.target.setAttribute("aria-pressed", "true");
        for (let bouton of boutonsEtiquette) {
          if (bouton.children[0].textContent.toLowerCase() === evt.target.children[0].textContent.toLowerCase()) {
            bouton.setAttribute("aria-pressed", "true");
          }
        }
        const etiquetteCible = evt.target.children[0].textContent.toLowerCase();
        etiquettesTableau.push(etiquetteCible);
        // console.log("tableau d'étiquettes", etiquettesTableau);
      }
      this.definit();
      this.affiche();
    });
  }
}
const vignettes = new FiltrageVignettes();