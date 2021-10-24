// DOM
// Boutons
const btnOuvreForm = document.querySelector(".btn--pho");
const btnFermeForm = document.querySelector(".btn-ferme--form");
const btnFermeCarrousel = document.querySelector(".btn-ferme--carous");
// Modales
const formModale = document.querySelector(".modale-contact");
const titreForm = document.querySelector("#titre-form");
const carrouselModale = document.querySelector(".modale-carrous");
const figureCaroussel = document.querySelector(".modale-carrous figure");
// Création d'éléments
const nouveauImg = document.createElement("img");
const nouveauVideo = document.createElement("video");
const nouveauFigcaption = document.createElement("figcaption");

// Ouverture et fermeture du formulaire 
let ouvreForm = () => {
  formModale.style.display = "block";
  titreForm.innerHTML = "Contactez-moi <br />" + photographe[0].name; /* global photographe */
}

let fermeForm = () => {
  formModale.style.display = "none";
}

btnOuvreForm.addEventListener("click", ouvreForm); 
btnFermeForm.addEventListener("click", fermeForm); 

// Ouverture et fermeture du carrousel 
let ouvreCarrousel = () => {
  carrouselModale.style.display = "flex";
}

let fermeCarrousel = () => {
  carrouselModale.style.display = "none";
}

// Fonction remplissant le caroussel de l'image ou de la vidéo correspondante 
let remplitCaroussel = () => { /* exported remplitCaroussel */
  const liensImageOuvreCarrousel = document.querySelectorAll(".fig-img a");
  const liensVideoOuvreCarrousel = document.querySelectorAll(".fig-vid a");
  for(let lien of liensImageOuvreCarrousel) {
    lien.addEventListener("click", () => { 
      console.log("carous1");

      figureCaroussel.appendChild(nouveauImg);
      figureCaroussel.appendChild(nouveauFigcaption);

      const imageCaroussel = document.querySelector(".modale-carrous img");
      const figcaptionCaroussel = document.querySelector(".modale-carrous figcaption");
      const image = lien.firstChild;
      const titre = lien.nextElementSibling.firstChild;

      sessionStorage.setItem("img-src", image.getAttribute("src"));
      sessionStorage.setItem("h2-cont", titre.textContent);
      imageCaroussel.setAttribute("src", sessionStorage.getItem("img-src"));
      figcaptionCaroussel.textContent = sessionStorage.getItem("h2-cont");
      figcaptionCaroussel.textContent = sessionStorage.getItem("h2-cont");

      ouvreCarrousel();  
    });

    btnFermeCarrousel.addEventListener("click", () => {
      fermeCarrousel();
      figureCaroussel.innerHTML = "";
    });
  }

  for(let lien of liensVideoOuvreCarrousel) {
    lien.addEventListener("click", () => {
      figureCaroussel.appendChild(nouveauVideo);
      figureCaroussel.appendChild(nouveauFigcaption);
      
      const videoCaroussel = document.querySelector(".modale-carrous video");
      const figcaptionCaroussel = document.querySelector(".modale-carrous figcaption");
      const video = lien.firstChild;
      const titre = lien.nextElementSibling.firstChild;

      sessionStorage.setItem("img-src", video.getAttribute("src"));
      sessionStorage.setItem("h2-cont", titre.textContent);
      videoCaroussel.setAttribute("src", sessionStorage.getItem("img-src"));
      figcaptionCaroussel.textContent = sessionStorage.getItem("h2-cont");

      ouvreCarrousel();
    });

    btnFermeCarrousel.addEventListener("click", () => {
      fermeCarrousel();
      figureCaroussel.innerHTML = "";
    });
  }
}