// DOM
// Boutons
const btnOuvreForm = document.querySelector(".btn--pho");
const btnFermeForm = document.querySelector(".btn-ferme--form");
const btnFermeCarrousel = document.querySelector(".btn-ferme--carous");
// Modales
const formModale = document.querySelector(".modale-contact");
const carrouselModale = document.querySelector(".modale-carrous");
// Liens
const lienOuvreCarrousel = document.querySelectorAll(".galerie-fig a");

// MODALES
// Ouverture et fermeture du formulaire 
function ouvreForm() {
  formModale.style.display = "block";
}

function fermeForm() {
  formModale.style.display = "none";
}

btnOuvreForm.addEventListener("click", ouvreForm); 
btnFermeForm.addEventListener("click", fermeForm); 

// Ouverture et fermeture du carrousel 
function ouvreCarrousel() {
  carrouselModale.style.display = "flex";
}

function fermeCarrousel() {
  carrouselModale.style.display = "none";
}

lienOuvreCarrousel.forEach((lien) => lien.addEventListener("click", ouvreCarrousel)); 
btnFermeCarrousel.addEventListener("click", fermeCarrousel);