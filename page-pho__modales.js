// DOM
// Base
const blocPage = document.querySelector(".bloc-page");
// Boutons
const boutonOuvreForm = document.querySelector(".btn--pho");
const boutonFermeForm = document.querySelector(".btn-ferme--form");
const boutonEnvoieForm = document.querySelector(".btn-envoi");
const boutonFermeCarrousel = document.querySelector(".btn-ferme--carrou");
// Modales
const formModale = document.querySelector(".modale-contact");
const formInputs = document.querySelectorAll(".modale-contact input");
const formTextarea = document.querySelector(".modale-contact textarea");
const titreForm = document.querySelector("#titre-form");
const carrouselModale = document.querySelector(".modale-carrous");
const figureCarrousel = document.querySelector(".modale-carrous figure");
const figcaptionCarrousel = document.querySelector(".modale-carrous figcaption");

// FORMULAIRE
class AffichageFormulaire {
  // Ouverture du formulaire
  ouvre(photographe) {
    boutonOuvreForm.addEventListener("click", () => {
      formModale.style.display = "block";
      formModale.setAttribute("aria-hidden", "false");
      blocPage.setAttribute("aria-hidden", "true");
      formModale.focus();
      titreForm.innerHTML = "Contactez-moi <br />" + photographe.name;
    });
  }
  // Fermeture du formulaire
  ferme() {
    boutonFermeForm.addEventListener("click", (evt) => { /* ... par la souris */
      evt.preventDefault();
      formModale.style.display = "none";
      formModale.setAttribute("aria-hidden", "true");
      blocPage.setAttribute("aria-hidden", "false");
      boutonOuvreForm.focus();
    });
    formModale.addEventListener("keydown", (evt) => { /* ... par le clavier */
      if (evt.key === "Escape") {
        evt.preventDefault();
        boutonFermeForm.click();
      }
    });
  }
  // Envoie du formulaire
  envoie() {
    boutonEnvoieForm.addEventListener("click", (evt) => {
      evt.preventDefault();
      window.location = ("photographe.html?phoID=" + utils.idCourant());
      console.log("Prénom:", formInputs[0].value,
                  "Nom:", formInputs[1].value,
                  "Email:", formInputs[2].value,
                  "Message:", formTextarea.value)
    });
  }
  // Contrôle le lancement des méthodes du formulaire
  controle(photographe) {
    this.ouvre(photographe);
    this.envoie();
    this.ferme();
  }
}
const formulaire = new AffichageFormulaire();

// CARROUSEL
let tableauLiensGalerie = []; /* Tableau actualisant tous les éléments de la galerie */
let indexCourant; /* Index définissant l'élément affiché de la galerie */
const chevronDroit = document.querySelector(".btn-chvr--dro");
const chevronGauche = document.querySelector(".btn-chvr--gau");

// Méthodes d'affichage du carrousel
class AffichageCarrousel {
  constructor(bouton) {
    this.bouton = bouton;
  }
  // Ouverture du carrousel
  ouvre() {
    carrouselModale.style.display = "flex";
    carrouselModale.setAttribute("aria-hidden", "false");
    blocPage.setAttribute("aria-hidden", "true");
  }
  // Fermeture du carrousel
  ferme() {
    boutonFermeCarrousel.addEventListener("click", () => {
      boutonFermeCarrousel.blur();
      galerieDom.children[indexCourant].firstChild.focus();
      figureCarrousel.firstChild.remove();
      carrouselModale.style.display = "none";
      carrouselModale.setAttribute("aria-hidden", "true");
      blocPage.setAttribute("aria-hidden", "false"); 
    });
  }
  // Affichage du carrousel
  affiche() {
    galerieDom.addEventListener("click", (evt) => { /* par la souris */
      if (evt.target.parentElement.tagName === "A") {
        const liensCarrousel = document.querySelectorAll(".galerie__cont figure[data-visible=true] a");
        tableauLiensGalerie = Array.from(liensCarrousel);
        // Initialisation de l'index courant
        for (let lien of tableauLiensGalerie) {
          if ( lien === evt.target.parentElement) {
            indexCourant = tableauLiensGalerie.indexOf(lien);
          }
        }
        // Création de la structure HTML pour chaque média selon le type
        let baliseLienGalerie = tableauLiensGalerie[indexCourant].firstChild.tagName;
        const nouveauMedia = document.createElement(baliseLienGalerie);
        figureCarrousel.prepend(nouveauMedia);
        if (baliseLienGalerie === "IMG") {
          nouveauMedia.setAttribute("alt", tableauLiensGalerie[indexCourant].firstChild.getAttribute("alt"));
        }
        if (baliseLienGalerie === "VIDEO") {
          nouveauMedia.innerHTML = "<source><track>Il est temps de mettre à jour votre navigateur !";
          utils.setAttributes(nouveauMedia, {"controls": "", "autostart": "0"});
          utils.setAttributes(nouveauMedia.firstChild, {"src": tableauLiensGalerie[indexCourant].firstChild.src.replace("S_", ""), "type": "video/mp4"});
        }
        // Remplissage du carrousel par le titre et la source du média
        const titre = tableauLiensGalerie[indexCourant].nextElementSibling.firstChild;
        figureCarrousel.firstChild.src = tableauLiensGalerie[indexCourant].firstChild.src.replace("S_", "");
        figcaptionCarrousel.textContent = titre.textContent;
        // N'ouvre le carrousel que s'il est préalablement fermé
        const carrouselStyles = window.getComputedStyle(carrouselModale);
        if (carrouselStyles.getPropertyValue("display") === "none") {
          this.ouvre();
          figureCarrousel.focus();
        }
      }
    });
    galerieDom.addEventListener("keydown", (evt) => { /* Affichage du carrousel par le clavier */
      if ((evt.target.tagName === "A") && (evt.key === "Enter")) {
        evt.preventDefault();
        document.activeElement.firstChild.click();
      }
    });
    this.ferme();
    this.navigue();
  }
   // Changement des index au cliquage des boutons de navigation
   changeIndex() {
    this.bouton.addEventListener("click", () => {
      let indexNouveau; /* Index définissant le nouvel élément de la galerie à afficher */
      // Méthodes affectant cet index
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
      // Affectation des index selon le bouton
      if (this.bouton === chevronGauche) {
        indexNouveau = indexPrecedent();
        indexCourant--;
      }
      if (this.bouton === chevronDroit) {
        indexNouveau = indexSuivant();
        indexCourant++;
      }
      // Remplissage du carrousel par le contenu correspondant de la galerie
      figureCarrousel.firstChild.remove();
      tableauLiensGalerie[indexNouveau].firstChild.click();
    });
  }
  // Activation de la navigation
  navigue() {
    const boutonAvant = new AffichageCarrousel(chevronGauche);
    const boutonApres = new AffichageCarrousel(chevronDroit);  
    boutonAvant.changeIndex();
    boutonApres.changeIndex();
    // Navigation par le clavier
    carrouselModale.addEventListener("keydown", (evt) => {
      if ((evt.key === "ArrowLeft") || (evt.key === "ArrowDown")) {
        evt.preventDefault();
        chevronGauche.click();
      }
      if ((evt.key === "ArrowRight") || (evt.key === "ArrowUp")) {
        evt.preventDefault();
        chevronDroit.click();
      }
      if (evt.key === "Escape") {
        evt.preventDefault();
        boutonFermeCarrousel.click();
      }
    });
  }
}
const carrousel = new AffichageCarrousel();

/* global galerieDom utils */
/* exported carrousel formulaire */