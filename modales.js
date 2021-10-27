// DOM
const blocPage = document.querySelector(".bloc-page");

// Boutons
const boutonOuvreForm = document.querySelector(".btn--pho");
const boutonFermeForm = document.querySelector(".btn-ferme--form");
const boutonFermeCarrousel = document.querySelector(".btn-ferme--carrou");
const boutonsMenu = document.querySelectorAll(".menu-liste li");
const boutonSelection = document.querySelector(".btn--galerie");
const listeMenu = document.querySelector(".menu-liste");
// Modales
const formModale = document.querySelector(".modale-contact");
const titreForm = document.querySelector("#titre-form");
const carrouselModale = document.querySelector(".modale-carrous");
const figureCarrousel = document.querySelector(".modale-carrous figure");
// Création d'éléments
const nouveauImg = document.createElement("img");
const nouveauVideo = document.createElement("video");
const nouveauFigcaption = document.createElement("figcaption");

// FORMULAIRE
// Ouverture et fermeture du formulaire 
let ouvreForm = () => {
  formModale.style.display = "block";
  formModale.setAttribute("aria-hidden", "false"); 
  blocPage.setAttribute("aria-hidden", "true"); 
  boutonFermeForm.focus();
  titreForm.innerHTML = "Contactez-moi <br />" + photographe[0].name; 
}

let fermeForm = () => {
  formModale.style.display = "none";
  formModale.setAttribute("aria-hidden", "true"); 
  blocPage.setAttribute("aria-hidden", "false"); 
}

boutonOuvreForm.addEventListener("click", ouvreForm);
boutonFermeForm.addEventListener("click", fermeForm);

// CARROUSEL
// Ouverture et fermeture du carrousel 
let ouvreCarrousel = () => {
  carrouselModale.style.display = "flex";
  carrouselModale.setAttribute("aria-hidden", "false");
  blocPage.setAttribute("aria-hidden", "true"); 
  boutonFermeCarrousel.focus();
}

// Fermeture du carrousel
let fermeCarrousel = () => {
  boutonFermeCarrousel.addEventListener("click", () => {
    carrouselModale.style.display = "none";
    figureCarrousel.innerHTML = "";
    carrouselModale.setAttribute("aria-hidden", "true");
    blocPage.setAttribute("aria-hidden", "false"); 
  });
}

fermeCarrousel();
const chevronDroit = document.querySelector(".btn-chvr--dro");
const chevronGauche = document.querySelector(".btn-chvr--gau");

// Fonction globale affichant le carrousel
let indexCourant;
let tableauLiensGalerie;
let afficheCarrousel = () => { 
  const liensOuvrantCarrousel = document.querySelectorAll(".galerie figure a");
  tableauLiensGalerie = Array.from(liensOuvrantCarrousel);
  for(let lien of tableauLiensGalerie) {
    lien.addEventListener("click", () => { 
      indexCourant = tableauLiensGalerie.indexOf(lien);
      
      const baliseParentMediaActuelle = tableauLiensGalerie[indexCourant].parentElement.innerHTML;
      figureCarrousel.innerHTML = baliseParentMediaActuelle;

      const figcaptionCarrousel = document.querySelector(".modale-carrous figcaption");
      figcaptionCarrousel.setAttribute("class", "modale-carrous__descr");
      
      const titre = lien.nextElementSibling.firstChild;
      figcaptionCarrousel.firstChild.textContent = titre.textContent;
      
      ouvreCarrousel();
      ajoutCœurs();
    });
  }
  changeCarrousel();
}

// Fonction permettant de naviguer dans le carrousel
let changeCarrousel = () => {
  const boutonAvant = new navigationCarrousel(chevronGauche);
  const boutonApres = new navigationCarrousel(chevronDroit);  

  boutonAvant.clicCarrousel();
  boutonApres.clicCarrousel();

  carrouselModale.addEventListener("keyup", (evt) => {
    if ((evt.keyCode === 37) || (evt.keyCode === 40)) {
      evt.preventDefault();
      chevronGauche.click();
    }
    if ((evt.keyCode === 39) || (evt.keyCode === 38)) {
      evt.preventDefault();
      chevronDroit.click();
    } 
  });
}

// Classe établissant un modèle de navigation
class navigationCarrousel {
  constructor(bouton) {
    this.bouton = bouton;
  }
  clicCarrousel() {
    this.bouton.addEventListener("click", () => {
      let indexNouveau;

      let indexSuivant = () => {
        if (indexCourant === (tableauLiensGalerie.length - 1)) {
          indexCourant = -1;
        } 
        return (indexCourant + 1);
      }
    
      let indexPrecedent = () => {
        if (indexCourant === 0) {
          indexCourant = tableauLiensGalerie.length;
        } 
        return (indexCourant - 1);
      }

      if (this.bouton == chevronGauche) {
        indexNouveau = indexPrecedent();
      }
      if (this.bouton == chevronDroit) {
        indexNouveau = indexSuivant();
      }

      const baliseMediaParentSuivante = tableauLiensGalerie[indexNouveau].parentElement.innerHTML;
      figureCarrousel.innerHTML = baliseMediaParentSuivante;
      
      const figcaptionCarrousel = document.querySelector(".modale-carrous figcaption");
      figcaptionCarrousel.setAttribute("class", "modale-carrous__descr");

      if (this.bouton == chevronGauche) {
        indexCourant--;
      }
      if (this.bouton == chevronDroit) {
        indexCourant++;
      }

      carrouselModale.focus();
    });
  }
}

// Classe établissant les modèles de filtrage
class FiltrageParMenu {
  constructor() {}
  triParDate() {
    mediasTriables.sort(function (a, b) {
      return a.date - b.date;
    });
  }
  
  triParcœurs() {
    mediasTriables.sort(function (a, b) {
      return a.cœurs - b.cœurs;
    });
  }
  
  triParTitre() {
    mediasTriables.sort(function (a, b) {
      return a.titre > b.titre ? 1 : -1;
    });
  }
  
  afficheMedias() { 
    if (boutonType == "Popularité") {
      this.triParcœurs();
    }
    if (boutonType == "Date") {
      this.triParDate();
    }
    if (boutonType == "Titre") {
      this.triParTitre();
    }
    console.log("sort", mediasTriables);
    for (let i=0; i < mediasTriables.length; i++) {
      galerie.appendChild(mediasTriables[i].dom); 
    }
  }
}

// Ouverture du menu de filtrage
boutonSelection.addEventListener("click", () => {
  listeMenu.style.display = "block";  
  boutonSelection.setAttribute("aria-expanded", "true");
});

// Fonction globale automatisant le filtrage par type (popularité, date, cœurs)
let boutonType;
const bouton = new FiltrageParMenu();
let filtreParMenu = (type) => { 
  for (let btn of boutonsMenu) {
    btn.addEventListener("click", () => {
      type = btn.textContent;
      boutonType = type;
      console.log("btn", boutonType);
      boutonSelection.textContent = type; 
      listeMenu.style.display = "none"; 
      boutonSelection.setAttribute("aria-expanded", "false");
      bouton.afficheMedias();
    }); 
  }
}

// Fonction rangeant les médias pour les filtrer
let rangeMedias = () => { 
  for (let fig of galerie.children) {
    let dom = fig;
    let date = Date.parse(fig.getAttribute("data-date"));
    let titre = fig.lastChild.firstChild.textContent;
    let cœurs = fig.lastChild.lastChild.firstChild.textContent;
    let mediaPret = new MediaARanger(dom, date, titre, cœurs);
    mediasTriables.push(mediaPret);
    console.log(mediasTriables);
  }  
}

/* global photographe galerie ajoutCœurs MediaARanger mediasTriables */
/* exported afficheCarrousel rangeMedias filtreParMenu nouveauImg nouveauVideo nouveauFigcaption */