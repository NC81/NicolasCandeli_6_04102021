// DOM
// Presentation
const nom = document.querySelector(".fiche h1");
const lieu = document.querySelector(".fiche__lieu");
const citation = document.querySelector(".fiche__citation");
const prix = document.querySelector(".infosup__prix");
const portrait = document.querySelector(".img-fiche--pho");
const listeEtiquettes = document.querySelector(".fiche__liste");
const galerieDom = document.querySelector(".galerie-cont");
// Menu
const boutonsMenu = document.querySelectorAll(".menu-liste li");
const boutonSelectionContenu = document.querySelector(".btn--galerie span");
const boutonSelection = document.querySelector(".btn--galerie");
const listeMenu = document.querySelector(".menu-liste");

// Conteneurs des données JSON
const medias = []; /* Recense toutes les informations concernant ses créations (JSON: liste "media") */
let photographe; /* Recense toutes les informations concernant le photographe (JSON: liste "photographers") */
let images = []; /* Recense toutes ses images */
let videos = []; /* Recense toutes ses vidéos */
let mediasTriables = []; /* Recense tous les médias de la galerie à trier */

// URL
const parametreID = new URLSearchParams(window.location.search);

// Affiche le contenu JSON pour la page des photographes
let affichePagePhotographe = () => {
  fetch("FishEyeData.json").then(function(res) {
    if (res.ok) {
      console.log("res.ok(page-pho)");
      return res.json();
    }
  })
  .then(function(data) {
    // Exploitation du contenu JSON du photographe
    console.log("id courant:", idCourant())
    // Copie du tableau JSON "photographers"  
    for (let pho of data.photographers) {
      if (pho.id == idCourant()) {
        photographe = pho;  /* Rangement des informations personnelles du photographe */
      }
    }
    // Copie du tableau JSON "media"  
    for (let med of data.media) {
      if (med.photographerId == idCourant()) {
        medias.push(med); /* Rangement des ressources médias du photographe */
      }
    }
    // Initialisation des tableaux d'images et de vidéos 
    images = tableau.rangeImages(); 
    videos = tableau.rangeVideos();

    // Appel des fonctions affichant les différents types de contenu
    remplitFiche();
    galerie.remplit();
    mediasParEtiquettes.filtre();
    
    // Initialisation du tableau rangeant les médias pour le menu de filtrage
    mediasTriables = tableau.rangeMediasTriables(); 

    // Appel des fonctions permettant de filtrer les médias à partir du menu
    menu.ouverture();
    menu.choisitTri();
    menu.filtre();

    // Appel du carrousel et du formulaire
    carrousel.affiche();
    formulaire.ouvre();

    // Appel de la fonction permettant d'ajouter un "like" à l'image et au compteur global
    cœur.additionne();
  })
  .catch(function(err) {
    console.log("erreur fetch(page-pho):", err);
  });
}
affichePagePhotographe();

// Permet d'ajouter plusieurs attributs en une fois
let setAttributes = (el, attrs) => {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

// Renvoie l'identifiant du photographe
let idCourant = () => {
  if(parametreID.has('phoID')){
    return parametreID.get('phoID');
  } else {
    console.error("L'identifiant est inconnu")  
  }
}

// Remplit la fiche de présentation du photographe
let remplitFiche = () => {
  // Inscription des informations (nom, lieu, citation, prix, portrait)
  nom.textContent = photographe.name;
  lieu.textContent = photographe.city + ", " + photographe.country;
  citation.textContent = photographe.tagline;
  prix.textContent = photographe.price;
  portrait.src= "./images/id_photos/" + photographe.portrait;
  portrait.alt= "" + photographe.name;
  // Création des étiquettes
  for (let tag of photographe.tags) {
    const nouveauLi = document.createElement("li");
    const nouveauA = document.createElement("a");
    listeEtiquettes.appendChild(nouveauLi);
    nouveauLi.appendChild(nouveauA);
    nouveauA.setAttribute("href", "#galerie");
    nouveauA.innerHTML = "#" + tag;
  }
}

// Modèle d'objet permettant de ranger les médias dans le tableau "mediasTriables"
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
  rangeImages() {
    for (let med of medias) {   
      if ("image" in med) {
        images.push(med); /* Enregistrement des images du photographe */
      }
    }
    return images;
  }
  rangeVideos() {
    for (let med of medias) {   
      if ("video" in med) {
        videos.push(med); /* Enregistrement des vidéos du photographe */
      }
    }
    return videos;
  }
  // Remplissage du tableau de médias pour le menu de filtrage
  rangeMediasTriables() { /* exported creeTableauMediasTriables */
    for (let fig of galerieDom.children) {
      let dom = fig;
      let date = Date.parse(fig.getAttribute("data-date"));
      let titre = fig.lastChild.firstChild.textContent;
      let cœurs = fig.lastChild.lastChild.firstChild.textContent;
      let mediaPret = new MediaARanger(dom, date, titre, cœurs); 
      mediasTriables.push(mediaPret); 
    }
    return mediasTriables;
  }
}
const tableau = new CreationTableaux();

// Méthodes remplissant la galerie 
let m;
class RemplissageGalerie {
  // Fonction transformant le nom complet en prénom (pour renvoyer au dossier contenant les ressources médias)
  changeNomEnPrenom(nom) {
    if (nom === photographe.name) {
      return photographe.name.split(' ')[0];
    }
  }
  // Fonction remplissant la galerie du photographe grâce au FACTORY PATTERN
  remplit() {
    const nouvelleUsine = new Usine();
    // Création de la structure HTML et exploitation du contenu JSON pour chaque image  
    for (m=0; m < images.length; m++) {
      const nouvelleImage = nouvelleUsine.creeFigure("image");
      nouvelleImage.creeImage();
    }
    // ... et pour chaque vidéo
    for (m=0; m < videos.length; m++) {
      const nouvelleVideo = nouvelleUsine.creeFigure("video");
      nouvelleVideo.creeVideo();
    }
  }
}
const galerie = new RemplissageGalerie();

/////////FACTORY PATTERN/////////DEBUT/////////
// Usine fabriquant la structure commune aux images et aux vidéos
let nouveauFigure; 
class Usine {
  constructor() {
    this.creeFigure = (type) => {
      nouveauFigure = document.createElement("figure");
      galerieDom.appendChild(nouveauFigure);
      nouveauFigure.innerHTML = "<a></a><figcaption><h2></h2><p><span></span><i></i></p></figcaption>";
      nouveauFigure.firstChild.setAttribute("tabindex", "0");
      nouveauFigure.lastChild.lastChild.setAttribute("tabindex", "0");
      setAttributes(nouveauFigure.lastChild.lastChild.lastChild, {"class": "fas fa-heart", "aria-label": "likes"});
      nouveauFigure.lastChild.lastChild.firstChild.setAttribute("class", "cœurs-nombre");
      let figure;
      if (type === "image") {
        nouveauFigure.setAttribute("class", "fig-img");
        figure = new NouvelleImage();
      }
      if (type === "video") {
        nouveauFigure.setAttribute("class", "fig-vid");
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
      const titre = document.querySelectorAll(".fig-img h2");
      const cœursNombre = document.querySelectorAll(".fig-img p span");

      nouveauFigure.firstChild.appendChild(nouveauImage);
      const imageGalerie = document.querySelectorAll(".fig-img img");
      
      titre[m].textContent = images[m].title;
      cœursNombre[m].textContent = images[m].likes + " ";
      imageGalerie[m].src = "./images/galeries/" + galerie.changeNomEnPrenom(photographe.name) + "/" + "S_" + images[m].image;
      imageGalerie[m].setAttribute("alt", images[m].alt);
      setAttributes(imageGalerie[m].parentNode.parentNode, {"data-tag": "#" + images[m].tags, "data-date": images[m].date});
    }
  }
}
// Instructions suppléméntaires pour l'affichage des vidéos
class NouvelleVideo {
  constructor() {
    this.creeVideo = () => {
      const nouveauVideo = document.createElement("video");
      const titre = document.querySelectorAll(".fig-vid h2");
      const cœursNombre = document.querySelectorAll(".fig-vid p span");
      
      nouveauFigure.firstChild.appendChild(nouveauVideo);
      const videoGalerie = document.querySelectorAll(".fig-vid video");

      titre[m].textContent = videos[m].title;
      cœursNombre[m].textContent = videos[m].likes + " ";
      videoGalerie[m].src = "./images/galeries/" + galerie.changeNomEnPrenom(photographe.name) + "/" + videos[m].video;
      videoGalerie[m].setAttribute("alt", videos[m].alt);
      setAttributes(videoGalerie[m].parentNode.parentNode, {"data-tag": "#" + videos[m].tags, "data-date": videos[m].date});
    }
  }
}
/////////FACTORY PATTERN/////////FIN/////////

// Méthodes permettant de filtrer grâce au menu
class FiltrageMenu {
  // Ouverture du menu 
  ouverture() {
    boutonSelection.addEventListener("click", () => {
      listeMenu.style.display = "block";
      console.log("liste", boutonsMenu[0]);
      boutonSelection.setAttribute("aria-expanded", "true");
      boutonsMenu[0].focus();
      this.navigueParClavier();
    });
  }
  // Navigation par le clavier
  navigueParClavier() {
    let i = 0;
    listeMenu.addEventListener("keydown", (evt) => {
      evt.preventDefault();
      if ((evt.key === "ArrowDown") || (evt.key === "ArrowLeft")) {
        if (i == (boutonsMenu.length - 1)) {
          i = 0;
        } else {
          i++;
        }
        console.log("ok");
        boutonsMenu[i].focus();
      }
      if ((evt.key === "ArrowUp") || (evt.key === "ArrowRight")) {
        if (i == 0) {
          i = (boutonsMenu.length - 1);
        } else {
          i--;
        }
        boutonsMenu[i].focus();
      }
      if (evt.key === "Enter") {
        boutonsMenu[i].click();
      }
    });
  }
  // Différents types de tri
  triParDate() {
    mediasTriables.sort(function (a, b) {
      return a.date - b.date;
    });
    mediasTriables.reverse();
  }
  triParCœurs() {
    mediasTriables.sort(function (a, b) {
      return a.cœurs - b.cœurs;
    });
    mediasTriables.reverse();
  }
  triParTitre() {
    mediasTriables.sort(function (a, b) {
      return a.titre > b.titre ? 1 : -1;
    });
  }
  // Appel des tris selon le type selectionné
  choisitTri(type) { 
    if (type === "Popularité") {
      this.triParCœurs();
    }  
    if (type === "Date") {
      this.triParDate();
    } 
    if (type === "Titre") {
      this.triParTitre();
    }
    
    for (let med of mediasTriables) {
      galerieDom.appendChild(med.dom);
    }
  }
  // Méthode globale automatisant le filtrage par type (popularité, date, cœurs) lors d'un clic dans le menu
  filtre() {
    for (let btn of boutonsMenu) {
      btn.addEventListener("click", () => {
        boutonSelectionContenu.textContent = btn.textContent;
        let type = boutonSelectionContenu.textContent;
        console.log(type);
        listeMenu.style.display = "none"; 
        boutonSelection.setAttribute("aria-expanded", "false");
        this.choisitTri(type);
     });
    }
  }
}
const menu = new FiltrageMenu();
let liensOuvrantCarrousel;

// Méthodes filtrant les vidéos selon les étiquettes
class FiltrageEtiquettes {
  // Affiche les éléments <figure> selon la valeur de l'attribut "data-tag"
  affiche() {
    const objetsGalerie = galerieDom.children;
    for (let objet of objetsGalerie) {
      if (objet.getAttribute("data-tag") === etiquetteContenu) {
        objet.style.display= "block";
        // objet.setAttribute("data-block", "true");
      } else {
        objet.style.display= "none";
      }
    }
  }
  // Méthode globale filtrant les éléments <figure> selon l'étiquette choisie
  filtre() {
    const liEtiquettes = document.querySelectorAll(".fiche__liste li");
    for (let li of liEtiquettes) {
      li.addEventListener("click", () => {
        etiquetteContenu = li.firstChild.textContent;
        this.affiche();     
      });
    }
  }
}
const mediasParEtiquettes = new FiltrageEtiquettes();
let etiquetteContenu;

// Méthodes gérant le comptage de "likes"
class AffichageCœurs {
// Affiche la somme des "likes" 
  afficheSomme() {
    let somme = 0;
    let cœursCompteNombre;
    const cœursCompte = document.querySelectorAll(".cœurs-nombre");
    const cœursSommeTotale = document.querySelector(".infosup__cœurs");
    for (let cœur of cœursCompte) {
      cœursCompteNombre = parseInt(cœur.textContent);
      somme += cœursCompteNombre;
    }
    cœursSommeTotale.textContent = somme + " ";
  }
  // Ajoute un "like"
  additionne() {
  const zonesCœurs = document.querySelectorAll("figcaption p");
  let cœursSomme;
    for (let zone of zonesCœurs) {
      zone.addEventListener("click", () => {
        cœursSomme = parseInt(zone.firstChild.textContent);
        cœursSomme++;
        zone.firstChild.textContent = cœursSomme + " ";
          this.afficheSomme();
      });
    }
    for (let zone of zonesCœurs) {
      zone.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
          zone.click();
        }
      });
    }
    this.afficheSomme();
  }
}
const cœur = new AffichageCœurs();

/* global carrousel formulaire */
/* exported liensOuvrantCarrousel */