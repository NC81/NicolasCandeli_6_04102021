// DOM
// Presentation
const nom = document.querySelector(".fiche h1");
const lieu = document.querySelector(".fiche__lieu");
const citation = document.querySelector(".fiche__citation");
const prix = document.querySelector(".infosup__prix");
const portrait = document.querySelector(".present-img--pho");
const listeEtiquettes = document.querySelector(".fiche__liste-etiq");
const galerieDom = document.querySelector(".galerie__cont");
// Menu
const boutonsMenu = document.querySelectorAll(".menu-liste li");
const boutonSelectionContenu = document.querySelector(".btn--galerie__texte");
const boutonSelection = document.querySelector(".btn--galerie");
const listeMenu = document.querySelector(".menu-liste");
const chevronHaut = document.querySelector(".fa-chevron-up");
// Autre
const lienPageAccueil = document.querySelector(".header > a");

// Conteneurs des données JSON
const medias = []; /* Recense les médias du photographe */
let photographe; /* Recense ses informations */
let images = []; /* Recense ses images */
let videos = []; /* Recense ses vidéos */

// Représentation du contenu de la galerie
let mediasTriables = []; /* Recense les médias de la galerie à trier */

// URL
const parametreID = new URLSearchParams(window.location.search);

// Affiche le contenu JSON pour la page des photographes
const affichePagePhotographe = () => {
  fetch("FishEyeData.json").then(function(res) {
    if (res.ok) {
      console.log("res.ok(page-pho)");
      return res.json();
    }
  })
  // Exploitation du JSON
  .then(function(data) {
    // Copie de l'objet JSON correspondant au photographe
    for (let photographer of data.photographers) {
      if (photographer.id == utils.idCourant()) {
        photographe = photographer;  /* Rangement des informations du photographe */
      }
    }
    // Copie des objets JSON correspondant aux médias du photographe dans un tableau
    for (let media of data.media) {
      if (media.photographerId == utils.idCourant()) {
        medias.push(media); /* Rangement des médias du photographe */
      }
    }
  })
  // Remplissage de la page et manipulation du DOM
  .then(function() {
    // Remplissage de la page
    affichage.remplitFiche(photographe); /* Remplissage de la fiche de présentation */
    formulaire.controle(photographe); /* Activation du formulaire */
    images = tableau.rangeImages(medias); /* Initialisation du tableau d'images */
    videos = tableau.rangeVideos(medias); /* ... et du tableau de vidéos */
    affichage.remplitGalerie(images, videos); /* Remplissage de la galerie */

    // Manipulation du DOM
    mediasTriables = tableau.rangeMediasTriables(); /* Initialisation du tableau de médias pour le menu de triage */
    menu.controle(); /* Activation du menu par la modification de "mediasTriables" */
    mediasParEtiquettes.filtre(); /* Activation du filtrage par les étiquettes */
    carrousel.affiche(); /* Activation du carrousel */
    cœur.additionne(); /* Activation des boutons de "likes" */
    
    lienPageAccueil.focus();
  })
  .catch(function(err) {
    console.error("erreur fetch(page-pho):", err);
  });
}
affichePagePhotographe();

// Fonctions utilitaires
class Utilitaire {
  // Identification du photographe
  idCourant() {
    if(parametreID.has('phoID')){
      return parametreID.get('phoID');
    } else {
      console.error("L'identifiant est inconnu")  
    }
  }
  // Ajout de plusieurs attributs à un élément
  setAttributes(elt, attrs) {
    for(let cle in attrs) {
      elt.setAttribute(cle, attrs[cle]);
    }
  }
  // Transformation du nom complet en prénom (pour renvoyer au dossier contenant les ressources médias)
  changeNomEnPrenom(nom) {
    if (nom === photographe.name) {
      return photographe.name.split(' ')[0];
    }
  }
}
const utils = new Utilitaire();

// Modèle d'objet pour ranger les médias dans le tableau "mediasTriables" en vue de leur tri par le menu
class MediaARanger {
  constructor(dom, date, titre, cœurs) {
    this.dom = dom,
    this.date = date,
    this.titre = titre,
    this.cœurs = cœurs
  }
}

// Créations de tableau
class CreationTableaux {
  // Rangement des images et des vidéos à partir du tableau "medias"
  rangeImages(medias) {
    for (let media of medias) {
      if ("image" in media) {
        images.push(media); /* Rangement des images du photographe */
      }
    }
    return images;
  }
  rangeVideos(medias) {
    for (let media of medias) {
      if ("video" in media) {
        videos.push(media); /* Rangement des vidéos du photographe */
      }
    }
    return videos;
  }
  // Remplissage du tableau "mediasTriables" pour le menu de filtrage
  rangeMediasTriables() { /* exported creeTableauMediasTriables */
    for (let figure of galerieDom.children) {
      const dom = figure;
      const date = Date.parse(figure.dataset.date);
      const titre = figure.lastChild.firstChild.textContent;
      const cœurs = figure.lastChild.lastChild.firstChild.textContent;
      const mediaPret = new MediaARanger(dom, date, titre, cœurs); 
      mediasTriables.push(mediaPret); 
    }
    return mediasTriables;
  }
}
const tableau = new CreationTableaux();

// Méthodes remplissant la page
let indexMedia; /* Index du média au sein des tableaux "images" et "videos" */
class AffichagePagePhotographe {
  // Remplissage de la fiche de présentation du photographe
  remplitFiche(photographe) {
    // Inscription des données JSON (nom, lieu, citation, prix, portrait)
    nom.textContent = photographe.name;
    lieu.textContent = photographe.city + ", " + photographe.country;
    citation.textContent = photographe.tagline;
    prix.textContent = photographe.price;
    portrait.src= "./images/id_photos/" + photographe.portrait;
    portrait.alt= "" + photographe.name;
    // Création des étiquettes
    for (let tag of photographe.tags) {
      const nouveauBouton = document.createElement("button");
      listeEtiquettes.appendChild(nouveauBouton); 
      nouveauBouton.innerHTML= "<span>#" + tag + "</span>" + "<span>Filtrer les médias de type " + tag + "</span>";
      utils.setAttributes(nouveauBouton, {"aria-pressed": "false", "aria-labelledby": "pho-" + tag});
      utils.setAttributes(nouveauBouton.lastChild, {"id": "pho-" + tag, "class": "lect-ecr"});
      nouveauBouton.firstChild.classList.add("etiq-cont", "etiq-cont--pho");
    }
  }
  /////////FACTORY PATTERN/////////DEBUT/////////
  // Remplissage de la galerie
  remplitGalerie(image, video) {
    const nouvelleUsine = new Usine();
    // Création de la structure HTML et exploitation du contenu JSON pour chaque image
    for (indexMedia=0; indexMedia < image.length; indexMedia++) {
      const nouvelleImage = nouvelleUsine.creeFigure("image");
      nouvelleImage.creeImage();
    }
    // ... et pour chaque vidéo
    for (indexMedia=0; indexMedia < video.length; indexMedia++) {
      const nouvelleVideo = nouvelleUsine.creeFigure("video");
      nouvelleVideo.creeVideo();
    }
  }
}
const affichage = new AffichagePagePhotographe();

// Usine fabriquant la structure commune aux images et aux vidéos
let nouveauFigure; 
class Usine {
  constructor() {
    this.creeFigure = (type) => {
      // Création d'un élément <figure>
      nouveauFigure = document.createElement("figure");
      galerieDom.appendChild(nouveauFigure);
      nouveauFigure.innerHTML = "<a></a><figcaption><h3></h3><button><span></span><span></span></button></figcaption>";
      // Assignation d'attributs
      nouveauFigure.setAttribute("data-visible", "true");
      nouveauFigure.firstChild.setAttribute("tabindex", "0");
      nouveauFigure.lastChild.lastChild.setAttribute("aria-pressed", "false");
      utils.setAttributes(nouveauFigure.lastChild.lastChild.lastChild, {"class": "fas fa-heart fa-sm", "role": "img", "aria-label": "likes"});
      nouveauFigure.lastChild.lastChild.firstChild.classList.add("cœurs-nombre");
      // Automatisation de la création d'instances
      let figure;
      if (type === "image") {
        nouveauFigure.classList.add("fig-img");
        nouveauFigure.lastChild.classList.add("fig-img__descr");
        figure = new NouvelleImage();
      }
      if (type === "video") {
        nouveauFigure.classList.add("fig-vid");
        nouveauFigure.lastChild.classList.add("fig-vid__descr");
        figure = new NouvelleVideo();
      }
      return figure;
    }
  }
}

// Instructions suppléméntaires pour l'affichage des images
class NouvelleImage {
  constructor() {
    this.creeImage = () => {
      const nouveauImage = document.createElement("img");
      const titre = document.querySelectorAll(".fig-img h3");
      const cœursNombre = document.querySelectorAll(".fig-img button span:first-of-type");
      nouveauFigure.firstChild.setAttribute("aria-label", images[indexMedia].title + ", vue aggrandie");
      // Création de la balise <img>
      nouveauFigure.firstChild.appendChild(nouveauImage);
      const imageGalerie = document.querySelectorAll(".fig-img img");
      // Remplissage de la <figure>
      titre[indexMedia].textContent = images[indexMedia].title;
      cœursNombre[indexMedia].textContent = images[indexMedia].likes + " ";
      imageGalerie[indexMedia].src = "./images/galeries/" + utils.changeNomEnPrenom(photographe.name) + "/" + "S_" + images[indexMedia].image;
      imageGalerie[indexMedia].setAttribute("alt", images[indexMedia].alt);
      utils.setAttributes(imageGalerie[indexMedia].parentNode.parentNode, {"data-tag": "#" + images[indexMedia].tags, "data-date": images[indexMedia].date});
    }
  }
}

// Instructions suppléméntaires pour l'affichage des vidéos
class NouvelleVideo {
  constructor() {
    this.creeVideo = () => {
      const nouveauVideo = document.createElement("video");
      const titre = document.querySelectorAll(".fig-vid h3");
      const cœursNombre = document.querySelectorAll(".fig-vid button span:first-of-type");
      nouveauFigure.firstChild.setAttribute("aria-label", videos[indexMedia].title + ", vue aggrandie");
      // Création de la balise <video>
      nouveauFigure.firstChild.appendChild(nouveauVideo);
      const videoGalerie = document.querySelectorAll(".fig-vid video");
      // Remplissage de la <figure>
      titre[indexMedia].textContent = videos[indexMedia].title;
      cœursNombre[indexMedia].textContent = videos[indexMedia].likes + " ";
      videoGalerie[indexMedia].src = "./images/galeries/" + utils.changeNomEnPrenom(photographe.name) + "/" + videos[indexMedia].video;
      utils.setAttributes(videoGalerie[indexMedia].parentNode.parentNode, {"data-tag": "#" + videos[indexMedia].tags, "data-date": videos[indexMedia].date});
    }
  }
}
/////////FACTORY PATTERN/////////FIN/////////

// Méthodes activant le filtrage par le menu
class FiltrageMenu {
  // Controle du menu et des méthodes de triage
  controle() {
    boutonSelection.addEventListener("click", () => {
      listeMenu.style.display = "block";
      chevronHaut.style.display = "inline";
      boutonSelection.setAttribute("aria-expanded", "true");
      boutonsMenu[0].focus();
      this.navigueParClavier();
    });
    this.automatise();
    this.trie("Popularité");
  }
  // Navigation par le clavier
  navigueParClavier() {
    let indexBoutonMenu = 0;
    listeMenu.addEventListener("keydown", (evt) => {
      evt.preventDefault();
      if ((evt.key === "ArrowDown") || (evt.key === "ArrowLeft")) {
        if (indexBoutonMenu == (boutonsMenu.length - 1)) {
          indexBoutonMenu = 0;
        } else {
          indexBoutonMenu++;
        }
        boutonsMenu[indexBoutonMenu].focus();
      }
      if ((evt.key === "ArrowUp") || (evt.key === "ArrowRight")) {
        if (indexBoutonMenu == 0) {
          indexBoutonMenu = (boutonsMenu.length - 1);
        } else {
          indexBoutonMenu--;
        }
        boutonsMenu[indexBoutonMenu].focus();
      }
      if (evt.key === "Enter") {
        boutonsMenu[indexBoutonMenu].click();
      }
    });
  }
  // Différents types de tri
  trieParDate() {
    mediasTriables.sort(function (a, b) {
      return a.date - b.date;
    });
    mediasTriables.reverse();
  }
  trieParCœurs() {
    mediasTriables.sort(function (a, b) {
      return a.cœurs - b.cœurs;
    });
    mediasTriables.reverse();
  }
  trieParTitre() {
    mediasTriables.sort(function (a, b) {
      return a.titre > b.titre ? 1 : -1;
    });
  }
  // Appel des tris selon le bouton
  trie(type) {
    if (type === "Popularité") {
      this.trieParCœurs();
    }
    if (type === "Date") {
      this.trieParDate();
    }
    if (type === "Titre") {
      this.trieParTitre();
    }
    // Affichage des médias dans l'ordre souhaité
    for (let  media of mediasTriables) {
      galerieDom.appendChild(media.dom);
    }
  }
  // Méthode globale automatisant le triage par type (popularité, date, cœurs)
  automatise() {
    for (let bouton of boutonsMenu) {
      bouton.addEventListener("click", () => {
        boutonSelectionContenu.textContent = bouton.textContent;
        const type = boutonSelectionContenu.textContent;
        listeMenu.style.display = "none"; 
        chevronHaut.style.display = "none";
        utils.setAttributes(boutonSelection, {"aria-expanded": "false", "aria-label": "Médias triés par " + type});
        listeMenu.setAttribute("aria-activedescendant", "" + bouton.id);
        this.trie(type);
        boutonSelection.focus();
      });
      bouton.addEventListener("focus", () => {
        boutonsMenu.forEach(bouton => bouton.setAttribute("aria-selected", "false"));
        bouton.setAttribute("aria-selected", "true");
      });
    }
  }
}
const menu = new FiltrageMenu();

// Méthodes activant le filtrage selon l'étiquette
let etiquetteContenu;
class FiltrageEtiquettes {
  // Affiche les éléments <figure> selon la valeur de l'attribut "data-tag"
  affiche() {
    const elementsGalerie = galerieDom.children;
    for (let element of elementsGalerie) {
      if ((element.dataset.tag === etiquetteContenu) || (etiquetteContenu == null)) {
        element.style.display = "block";
        element.dataset.visible = true;
      } else {
        element.style.display = "none";
        element.dataset.visible = false;
      }
    }
  }
  // Méthode globale filtrant les éléments <figure> selon l'étiquette choisie
  filtre() {
    const etiquettes = document.querySelectorAll(".fiche__liste-etiq button");
    listeEtiquettes.addEventListener("click", (evt) => {
      // Si le bouton a déjà été pressé...
      if ((evt.target.getAttribute("aria-pressed") === "true") && (evt.target.tagName === "BUTTON")) {
        evt.target.setAttribute("aria-pressed", "false");
        etiquetteContenu = null;
      // Si le bouton n'a pas été pressé...
      } else if ((evt.target.getAttribute("aria-pressed") === "false") && (evt.target.tagName === "BUTTON")) {
        evt.target.setAttribute("aria-pressed", "true");
        etiquetteContenu = evt.target.firstChild.textContent;
        // Désactive les étiquettes non-ciblées
        for (let etiquette of etiquettes) {
          if ((etiquette.getAttribute("aria-pressed") === "true") && (evt.target != etiquette)) {
            etiquette.setAttribute("aria-pressed", "false");
            etiquetteContenu = evt.target.firstChild.textContent;
          }
        }
      }
      this.affiche();
    });
  }
}
const mediasParEtiquettes = new FiltrageEtiquettes();

// Méthodes gérant le comptage des "likes"
let sommeVignette;
class AffichageCœurs {
// Affiche la somme totale de tous les "likes" de la galerie
  afficheSomme() {
    let sommeTotale = 0;
    const cœursVignette = document.querySelectorAll(".cœurs-nombre");
    const cœursInfosup = document.querySelector(".infosup__cœurs");
    for (let cœur of cœursVignette) {
      sommeVignette = parseInt(cœur.textContent);
      sommeTotale += sommeVignette;
    }
    cœursInfosup.textContent = sommeTotale + " ";
  }
  // Évènements permmettant d'ajouter un "like"
  additionne() {
  const cœursBoutons = document.querySelectorAll("figcaption button"); /* ... par la souris */
    for (let bouton of cœursBoutons) {
      bouton.addEventListener("click", () => {
        sommeVignette = parseInt(bouton.firstChild.textContent);
        if (bouton.getAttribute("aria-pressed") === "false") {
          bouton.setAttribute("aria-pressed", "true");
          sommeVignette++;
          bouton.firstChild.textContent = sommeVignette + " ";
          this.afficheSomme();
        } 
        else if (bouton.getAttribute("aria-pressed") === "true") {
          bouton.setAttribute("aria-pressed", "false");
          sommeVignette--;
          bouton.firstChild.textContent = sommeVignette + " ";
          this.afficheSomme();
        }
      });
    }
    this.afficheSomme();
  }
}
const cœur = new AffichageCœurs();

/* global carrousel formulaire */