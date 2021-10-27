let images = []; /* Recense toutes ses images */
let videos = []; /* Recense toutes ses vidéos */

// DOM
const nom = document.querySelector(".fiche-pho h1");
const lieu = document.querySelector(".fiche-pho__lieu");
const citation = document.querySelector(".fiche-pho__citation");
const prix = document.querySelector(".infosup__prix");
const portrait = document.querySelector(".img-fiche--pho");
const etiquettes = document.querySelector(".fiche-pho__liste");
const galerie = document.querySelector(".galerie-cont");

// URL
const parametreID = new URLSearchParams(window.location.search);

// Affiche le contenu JSON pour la page des photographes
let affichePagePhotographe = () => {
  fetch("FishEyeData.json").then(function(res) {
    if (res.ok) {
      console.log("ça marche PHO (res: ok)");
      return res.json();
    }
  })
  .then(function(data) {
    // Exploitation du contenu JSON du photographe
    console.log("id courant:", idCourant())
    // Copie du tableau JSON "photographers"  
    for (let i=0; i < data.photographers.length; i++) {
      if (data.photographers[i].id == idCourant()) {
        photographe.push(data.photographers[i]);  /* Enregistrement des informations dédiées à la fiche du photographe */
      }
    }
    // Copie du tableau JSON "media"  
    for (let i=0; i < data.media.length; i++) {
      if (data.media[i].photographerId == idCourant()) {
        medias.push(data.media[i]); /* Enregistrement des ressources médias du photographe */
      }
    }
    // Appel des tableaux d'images et de vidéos 
    images = creeTableauImages(); 
    videos = creeTableauVideos();
   
    // Appel des fonctions affichant les différents types de contenu
    remplitFiche();
    remplitGalerie();
    filtreMedias();
    afficheCarrousel();
    
    // Appel d'un tableau de médias pour le menu de filtrage
    creeTableauxMediasTriables(); 
    // Appel de la fonction permettant au menu de filtrer les médias  
    filtreParMenu(); 
    // Appel de la fonction permettant d'ajouter un "like" 
    ajoutCœurs();
  })
  .catch(function(err) {
    console.log("erreur fetch(fiche-pho):", err);
  });
}

affichePagePhotographe();

// Fonction renvoyant l'identifiant du photographe
let idCourant = () => {
  if(parametreID.has('phoID')){
    return parametreID.get('phoID');
  } else {
    console.error("L'identifiant est inconnu")  
  }
} 

// Fonctions permettant de détecter le type de contenu (images et vidéos)
let trouveImages = (fichier) => { 
  if (fichier.split('.').pop() == "jpg") {
    return true;
  }
}

let trouveVideos = (fichier) => {
  if (fichier.split('.').pop() == "mp4") {
    return true;
  }
}

// Fonction transformant le nom complet en prénom (pour renvoyer au dossier contenant les ressources médias)
let changeNomEnPrenom = (nom) => {
  if (nom == photographe[0].name) {
    return photographe[0].name.split(' ')[0];
  }
}

// Fonction remplissant la fiche du photographe
let remplitFiche = () => {
  for (let i = 0; i < photographe.length; i++) {
    // Inscription des informations (nom, lieu, citation, prix, portrait)
    nom.textContent = photographe[i].name;
    lieu.textContent = photographe[i].city + ", " + photographe[i].country;
    citation.textContent = photographe[i].tagline;
    prix.textContent = photographe[i].price;
    portrait.src= "./images/id_photos/" + photographe[i].portrait;
    portrait.alt= "" + photographe[i].name;
    // Création des étiquettes
    for (let t=0; t < photographe[i].tags.length; t++) {
      const nouveauLi = document.createElement("li");
      const nouveauA = document.createElement("a");
      etiquettes.appendChild(nouveauLi);
      nouveauLi.appendChild(nouveauA);
      nouveauA.innerHTML = "#" + photographe[i].tags[t];
    }
  }
}

// Fonction remplissant la galerie du photographe
let m;
let remplitGalerie = () => {
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

// Usine fabriquant une base commune pour les images et des vidéos
let nouveauFigure; 
class Usine {
  constructor() {
    this.creeFigure = (type) => {
      nouveauFigure = document.createElement("figure");
      galerie.appendChild(nouveauFigure);
      nouveauFigure.innerHTML = "<a></a><figcaption><h2></h2><p><span></span><i></i></p></figcaption>";
      nouveauFigure.lastChild.lastChild.lastChild.setAttribute("class", "fas fa-heart");
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
      nouveauFigure.firstChild.appendChild(nouveauImage)
      const imageGalerie = document.querySelectorAll(".fig-img img");

      titre[m].textContent = images[m].title;
      cœursNombre[m].textContent = images[m].likes + " ";
      imageGalerie[m].src = "./images/galeries/" + changeNomEnPrenom(photographe[0].name) + "/" + images[m].image;
      imageGalerie[m].parentNode.parentNode.setAttribute("data-tag", "#" + images[m].tags);
      imageGalerie[m].parentNode.parentNode.setAttribute("data-date", images[m].date);
      imageGalerie[m].parentNode.parentNode.setAttribute("data-id", images[m].id);
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
      videoGalerie[m].src = "./images/galeries/" + changeNomEnPrenom(photographe[0].name) + "/" + videos[m].video;
      videoGalerie[m].parentNode.parentNode.setAttribute("data-tag", "#" + videos[m].tags);
      videoGalerie[m].parentNode.parentNode.setAttribute("data-date", videos[m].date);
      videoGalerie[m].parentNode.parentNode.setAttribute("data-id", videos[m].id);
    }
  }
}

// Fonction globale filtrant les éléments <figure> selon l'étiquette choisie
let etiquette;
let filtreMedias = () => {
  const liEtiquettes = document.querySelectorAll(".fiche-pho__liste li");
  for (let li of liEtiquettes) {
    li.addEventListener("click", () => {
      etiquette = li.firstChild.textContent;
      afficheMedias();
    });
  }
}

// Fonction affichant les éléments <figure> selon la valeur de l'attribut "data-tag"
let afficheMedias = () => {
  const objetsGalerie = galerie.children;
  for (let objet of objetsGalerie) {
      // objet.setAttribute("data-correct", "false");
    if (objet.getAttribute("data-tag") == etiquette) {
      objet.style.display= "block";
    } else {
      objet.style.display= "none";
    }
  }
}

// Fonction affichant la somme des "likes" 
let afficheCœursSommeTotale = () => {
  let somme = 0;
  let cœursCompteNombre;
  const cœursCompte = document.querySelectorAll(".cœurs-nombre");
  const cœursSommeTotale = document.querySelector(".infosup__cœurs");
  for (let c of cœursCompte) {
    cœursCompteNombre = parseInt(c.textContent);
    somme += cœursCompteNombre;
  }
  cœursSommeTotale.textContent = somme + " ";
}

// Fonction permettant d'ajouter un "like"
let ajoutCœurs = () => {
const zonesCœurs = document.querySelectorAll("figcaption p");
let cœursSomme;
  for (let z of zonesCœurs) {
    z.addEventListener("click", () => {
      console.log("ça augmente");
      cœursSomme = parseInt(z.firstChild.textContent);
      cœursSomme++;
      z.firstChild.textContent = cœursSomme + " ";
        afficheCœursSommeTotale();
    });
  }
  afficheCœursSommeTotale();
}

/* global photographe medias creeTableauImages creeTableauVideos afficheCarrousel filtreParMenu creeTableauxMediasTriables */
/* exported trouveImages trouveVideos */