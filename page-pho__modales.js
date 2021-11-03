// DOM
// Base
const blocPage = document.querySelector(".bloc-page");
// Boutons
const boutonOuvreForm = document.querySelector(".btn--pho");
const boutonFermeForm = document.querySelector(".btn-ferme--form");
const boutonEnvoiForm = document.querySelector(".btn-envoi");
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
  ouvre() {
    boutonOuvreForm.addEventListener("click", () => {
      formModale.style.display = "block";
      formModale.setAttribute("aria-hidden", "false"); 
      blocPage.setAttribute("aria-hidden", "true"); 
      boutonFermeForm.focus();
      titreForm.innerHTML = "Contactez-moi <br />" + photographe.name; 
      this.envoie();
      this.fermeClic();
      this.fermeTouche();
    });
  }
  // Fermeture du formulaire par un cliquage sur le bouton de fermeture
  fermeClic() {
    boutonFermeForm.addEventListener("click", (evt) => {
      evt.preventDefault();
      formModale.style.display = "none";
      formModale.setAttribute("aria-hidden", "true"); 
      blocPage.setAttribute("aria-hidden", "false"); 
    });
  }
  // Fermeture du formulaire par la pression de la touche "Échap"
  fermeTouche() {
    formModale.addEventListener("keydown", (evt) => {
      if (evt.key === "Escape") {
        evt.preventDefault();
        boutonFermeForm.click();
      }  
    });  
  }
  // Envoie du formulaire
  envoie() {
    boutonEnvoiForm.addEventListener("click", (evt) => {
      evt.preventDefault();
      console.log("Prénom:", formInputs[0].value,
                  "Nom:", formInputs[1].value,
                  "Email:", formInputs[2].value,
                  "Message:", formTextarea.value)
    });
  }
}
const formulaire = new AffichageFormulaire();

// CARROUSEL
let indexCourant;
let tableauLiensGalerie;
let baliseLienGalerie;
const chevronDroit = document.querySelector(".btn-chvr--dro");
const chevronGauche = document.querySelector(".btn-chvr--gau");
// Méthodes d'affichage du carrousel
class AffichageCarrousel {
  // Ouverture du carrousel
  ouvre() {
    carrouselModale.style.display = "flex";
    carrouselModale.setAttribute("aria-hidden", "false");
    blocPage.setAttribute("aria-hidden", "true"); 
    boutonFermeCarrousel.focus();  
  }
  // Fermeture du carrousel
  ferme() {
    boutonFermeCarrousel.addEventListener("click", () => {
      console.log("ferme", figcaptionCarrousel.previousSibling);
      figcaptionCarrousel.previousSibling.remove();
      carrouselModale.style.display = "none";
      carrouselModale.setAttribute("aria-hidden", "true");
      blocPage.setAttribute("aria-hidden", "false"); 
    });
  }
  // Affichage du carrousel 
  affiche() { 
    let liensOuvrantCarrousel = document.querySelectorAll(".galerie figure a");
    tableauLiensGalerie = Array.from(liensOuvrantCarrousel);
    for (let i=0; i < tableauLiensGalerie.length; i++) {
      tableauLiensGalerie[i].addEventListener("click", () => { 
        indexCourant = tableauLiensGalerie.indexOf(tableauLiensGalerie[i]);
        
        baliseLienGalerie = tableauLiensGalerie[i].firstChild.tagName;
        const nouveauMedia = document.createElement(baliseLienGalerie);

        figureCarrousel.prepend(nouveauMedia);
        nouveauMedia.setAttribute("alt", tableauLiensGalerie[i].firstChild.getAttribute("alt"));
        if (baliseLienGalerie === "VIDEO") {
          nouveauMedia.innerHTML = "<source></source>";
          setAttributes(nouveauMedia, {"controls": "", "autoplay": "false"});
          setAttributes(nouveauMedia.firstChild, {"src": tableauLiensGalerie[i].firstChild.src.replace("S_", ""), "type": "video/mp4"});         
        }

        const titre = tableauLiensGalerie[i].nextElementSibling.firstChild;
        figureCarrousel.firstChild.src = tableauLiensGalerie[i].firstChild.src.replace("S_", "");
        figcaptionCarrousel.textContent = titre.textContent;
        
        // Ouvre le carrousel seulement si celui-ci est fermé
        let carrouselStyles = window.getComputedStyle(carrouselModale);
        if (carrouselStyles.getPropertyValue("display") === "none") {
          this.ouvre();
        }
      });
    }
    // Ouverture du carrousel par le clavier
    for (let i=0; i < tableauLiensGalerie.length; i++) {
      tableauLiensGalerie[i].addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
          evt.preventDefault();
          tableauLiensGalerie[i].click();
        }
      });
    }
    this.ferme();
    navigation.transforme();
  }
}
const carrousel= new AffichageCarrousel();

// Modèle de navigation dans le carrousel
class NavigationCarrousel {
  constructor(bouton) {
    this.bouton = bouton;
  }
  // Fonction définissant l'évènement de cliquage des boutons de navigation
  cliqueBouton() {
    this.bouton.addEventListener("click", () => {
      let indexNouveau;
      // Fonctions modifiant l'index suivant/précédent associé aux boutons 
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
      // Modification de l'index courant après le changement du carrousel
      if (this.bouton == chevronGauche) {
        indexNouveau = indexPrecedent();
        indexCourant--;
      }
      if (this.bouton == chevronDroit) {
        indexNouveau = indexSuivant();
        indexCourant++;
      }
      // Remplissage du carrousel par le contenu correspondant de la galerie
      figureCarrousel.firstChild.remove();
      tableauLiensGalerie[indexNouveau].click();
      carrouselModale.focus();
    });
  }
  // Transformation du carrousel lors de la navigation
  transforme() {
    const boutonAvant = new NavigationCarrousel(chevronGauche);
    const boutonApres = new NavigationCarrousel(chevronDroit);  
  
    boutonAvant.cliqueBouton();
    boutonApres.cliqueBouton();
  // Association des flèches du clavier au cliquage des boutons
    carrouselModale.addEventListener("keyup", (evt) => {
      console.log(evt.key);
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
const navigation = new NavigationCarrousel();

/* global photographe setAttributes */
/* exported carrousel formulaire */