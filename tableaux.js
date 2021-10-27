// Tableaux 
const photographe = []; /* Recense toutes les informations concernant le photographe (JSON: liste "photographers") */
const medias = []; /* Recense toutes les informations concernant ses créations (JSON: liste "media") */
const mediasTriables = []; /* Recense tous les médias de la galerie à trier */

let creeTableauImages = () => {
  for (let i=0; i < medias.length; i++) {   
    if (trouveImages("" + medias[i].image)) {
      images.push(medias[i]); /* Enregistrement des images du photographe */
    }
  }
  return images;
}

let creeTableauVideos = () => {
  for (let i=0; i < medias.length; i++) {   
    if (trouveVideos("" + medias[i].video)) {
      videos.push(medias[i]); /* Enregistrement des vidéos du photographe */
    }
  }
  return videos;
}

// Remplissage du tableau de médias pour le menu de filtrage
let creeTableauxMediasTriables = () => { /* exported creeTableauxMediasTriables */
for (let fig of galerie.children) {
    let dom = fig;
    let date = Date.parse(fig.getAttribute("data-date"));
    let titre = fig.lastChild.firstChild.textContent;
    let cœurs = fig.lastChild.lastChild.firstChild.textContent;
    let mediaPret = new MediaARanger(dom, date, titre, cœurs); 
    mediasTriables.push(mediaPret); 
  }
}

// Classe établissant un modèle de médias à filtrer
class MediaARanger {
  constructor(dom, date, titre, cœurs) {
    this.dom = dom,
    this.date = date,
    this.titre = titre,
    this.cœurs = cœurs
  }
}

/* global images videos trouveImages trouveVideos galerie */
/* exported photographe creeTableauImages creeTableauVideos */