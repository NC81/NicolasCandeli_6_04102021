// DOM
const nom = document.querySelector(".fiche-pho h1");
const lieu = document.querySelector(".fiche-pho__lieu");
const citation = document.querySelector(".fiche-pho__citation");
const prix = document.querySelector(".infosup__prix");
const portrait = document.querySelector(".img-fiche--pho");
const etiquettes = document.querySelector(".fiche-pho__liste");
const galerie = document.querySelector(".galerie-cont");

// Tableaux 
const photographe = []; /* Recense toutes les informations concernant le photographe (JSON: liste "photographers") */
const medias = []; /* Recense toutes les informations concernant ses créations (JSON: liste "media") */
const images = []; /* Recense toutes ses images */
const videos = []; /* Recense toutes ses vidéos */

// Affiche le contenu JSON pour la page des photographes
let affichePagePhotographe = () => {
  fetch("FishEyeData.json").then(function(res) {
    if (res.ok) {
      console.log("ça marche PHO");
      return res.json();
    }
  })
  .then(function(data) {
    // Exploitation du contenu JSON du photographe
    for (let i=0; i < data.photographers.length; i++) {
      // console.log("ID(page-pho)", sessionStorage.getItem("id"));
      if (data.photographers[i].id == sessionStorage.getItem("id")) {
        photographe.push(data.photographers[i]);  /* Enregistrement des informations dédiées à la fiche du photographe */
        sessionStorage.setItem("nom", data.photographers[i].name); 
      }
    }
    for (let i=0; i < data.media.length; i++) {
      if (data.media[i].photographerId == sessionStorage.getItem("id")) {
        medias.push(data.media[i]); /* Enregistrement des ressources médias du photographe */
      }
    }
    for (let i=0; i < medias.length; i++) {   
      if (trouveImages("" + medias[i].image)) {
        images.push(medias[i]); /* Enregistrement des images du photographe */
      }
      if (trouveVideos("" + medias[i].video)) {
        videos.push(medias[i]); /* Enregistrement des vidéos du photographe */
      }
    }
    // Appel des fonctions affichant les différents types de contenu
    remplitFiche();
    remplitGalerie();
    remplitCaroussel();
  })
  .catch(function(err) {
    console.log("erreur fetch(fiche-pho)");
  });
}

affichePagePhotographe();

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
let remplitGalerie = async () => {
  const nouvelleUsine = new usine();
  // Création de la structure HTML et exploitation du contenu JSON pour chaque image
  for (i=0; i< images.length; i++) {
    const nouvelleImage = nouvelleUsine.creeFigure("image");
    nouvelleImage.creeImage();
  }
  // ... et pour chaque vidéo
  for (i=0; i< videos.length; i++) {
    const nouvelleVideo = nouvelleUsine.creeFigure("video");
    nouvelleVideo.creeVideo();
  }
}

// Usine fabriquant une base commune pour les images et des vidéos
class usine {
  constructor() {
    this.creeFigure = function(type) {
      const nouveauFigure = document.createElement("figure");
      galerie.appendChild(nouveauFigure);
      nouveauFigure.innerHTML = "<a></a><figcaption><h2></h2><p><span></span><i></i></p></figcaption>"
      const iListe = document.querySelectorAll(".galerie-cont i");
      iListe.forEach(i => i.setAttribute("class", "fas fa-heart"));
     
      let figure;
      if (type === "image") {
        nouveauFigure.setAttribute("class", "fig-img");
        figure = new image();
      }
      if (type === "video") {
        nouveauFigure.setAttribute("class", "fig-vid");
        figure = new video();
      }
      
      return figure;
    }    
  }
}

// Instructions suppléméntaires pour l'affichage des images
class image {
  constructor() {
    this.creeImage = function() {
      const image = document.createElement("img");
      const liens = document.querySelectorAll(".fig-img a");
      const titre = document.querySelectorAll(".fig-img h2");
      const aime = document.querySelectorAll(".fig-img p span");
      liens.forEach(lien => lien.appendChild(image));
      const imageGalerie = document.querySelectorAll(".fig-img img");

      titre[i].textContent = images[i].title;
      aime[i].textContent = images[i].likes + " ";
      imageGalerie[i].src = "./images/galeries/" + changeNomEnPrenom(photographe[0].name) + "/" + images[i].image;
    }
  }
}

// Instructions suppléméntaires pour l'affichage des vidéos
class video {
  constructor() {
    this.creeVideo = function() {
      const video = document.createElement("video");
      const liens = document.querySelectorAll(".fig-vid a");
      const titre = document.querySelectorAll(".fig-vid h2");
      const aime = document.querySelectorAll(".fig-vid p span");
      liens.forEach(lien => lien.appendChild(video));
      const videoGalerie = document.querySelectorAll(".fig-vid video");

      titre[i].textContent = videos[i].title;
      aime[i].textContent = videos[i].likes + " ";
      videoGalerie[i].src = "./images/galeries/" + changeNomEnPrenom(photographe[0].name) + "/" + videos[i].video;
    }
  }
}