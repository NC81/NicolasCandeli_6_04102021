// DOM
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
const figurecarrousel = document.querySelector(".modale-carrous figure");
// Création d'éléments
const nouveauImg = document.createElement("img");
const nouveauVideo = document.createElement("video");
const nouveauFigcaption = document.createElement("figcaption");

// FORMULAIRE
// Ouverture et fermeture du formulaire 
let ouvreForm = () => {
  formModale.style.display = "block";
  titreForm.innerHTML = "Contactez-moi <br />" + photographe[0].name; /* global photographe */
}

let fermeForm = () => {
  formModale.style.display = "none";
}

boutonOuvreForm.addEventListener("click", ouvreForm); 
boutonFermeForm.addEventListener("click", fermeForm); 

// carrousel
// Ouverture et fermeture du carrousel 
let ouvreCarrousel = () => {
  carrouselModale.style.display = "flex";
}

// Fermeture du carrousel
let femetureCarrousel = () => {
  boutonFermeCarrousel.addEventListener("click", () => {
    carrouselModale.style.display = "none";
    figurecarrousel.innerHTML = "";
  });
}

// Fonction de remplissage du carrousel
let remplitcarrousel = () => { /* exported remplitcarrousel */
  const liensMediaOuvreCarrousel = document.querySelectorAll(".galerie figure a");
  for(let lien of liensMediaOuvreCarrousel) {
    lien.addEventListener("click", () => { 
      if (lien.firstChild.tagName === "IMG") {
        figurecarrousel.appendChild(nouveauImg);
      }
      if (lien.firstChild.tagName === "VIDEO") {
        figurecarrousel.appendChild(nouveauVideo);
      }
      figurecarrousel.appendChild(nouveauFigcaption);

      const mediacarrousel = document.querySelector(".modale-carrous figure :first-child");
      const figcaptioncarrousel = document.querySelector(".modale-carrous figcaption");
      const mediaGalerie = lien.firstChild;
      const titre = lien.nextElementSibling.firstChild;

      sessionStorage.setItem("img-src", mediaGalerie.getAttribute("src"));
      sessionStorage.setItem("h2-cont", titre.textContent);
      mediacarrousel.setAttribute("src", sessionStorage.getItem("img-src"));
      figcaptioncarrousel.textContent = sessionStorage.getItem("h2-cont");
      figcaptioncarrousel.textContent = sessionStorage.getItem("h2-cont");

      ouvreCarrousel();  
      femetureCarrousel();
    });
  }
}    
  
// MENU DE FILTRAGE
let mediasTriables = [];
// Classe regroupant les fonctions de filtrage (rangement des médias, triage et affichage)
class FiltrageParMenu {
  constructor() {}
  rangeMedias() {
    for (let fig of galerie.children) {
      let dom = fig;
      let date = Date.parse(fig.getAttribute("data-date"));
      let titre = fig.lastChild.firstChild.textContent;
      let cœurs = fig.lastChild.lastChild.firstChild.textContent;
      let mediaPret = new MediaARanger(dom, date, titre, cœurs);
      mediasTriables.push(mediaPret);
    }  
  }
  
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
    this.rangeMedias();
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
      galerie.appendChild(mediasTriables[i].dom); /* global galerie */
    }
  }
}

// Classe permettant de ranger les medias à filtrer
class MediaARanger {
  constructor(dom, date, titre, cœurs) {
    this.dom = dom,
    this.date = date,
    this.titre = titre,
    this.cœurs = cœurs
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
let filtreParMenu = (type) => { /* exported filtreParMenu */
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