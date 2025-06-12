const modeRadios = document.querySelectorAll('input[name="mode"]')
const sections = {
  '1': document.getElementById('mode1-section'),
  '2': document.getElementById('mode2-section'),
  '3': document.getElementById('mode3-section')
}

modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    for (let key in sections) {
      sections[key].classList.remove('active')
    }
    sections[radio.value].classList.add('active')
  })
})

// Empêche la saisie de valeurs hors [0, 20]
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('input', () => {
    if (input.value !== '') {
      if (input.value < 0) input.value = 0
      if (input.value > 20) input.value = 20
    }
  })
})

// Affiche le mode 1 par défaut au chargement
window.addEventListener('DOMContentLoaded', () => {
  for (let key in sections) {
    sections[key].classList.remove('active')
  }
  sections['1'].classList.add('active')
})

// Exemple de coefficients (à adapter selon les filières/options)
const COEFFS = {
  history: 3,
  languageA: 3,
  languageB: 3,
  ES: 3,
  EMC: 1,
  speleft: 8, // Spécialité abandonnée
  option: 2,  // Option facultative (bonus)
  frWritten: 5,
  frOral: 5,
  sport: 6,
  spe1: 16,
  spe2: 16,
  philo: 8,
  grandOral: 10
};

// Utilitaires pour récupérer les valeurs d'un fieldset
function getInputsValues(fieldset) {
  return Array.from(fieldset.querySelectorAll('input[type="number"]'))
    .map(input => parseFloat(input.value) || 0);
}

// Moyenne simple d'un tableau
function moyenne(arr) {
  const valid = arr.filter(v => !isNaN(v));
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

// Calcul pour chaque mode
function calculerMode1() {
  // Mode 1 : Moyenne des trimestres de 1re et Term
  let total = 0, totalCoeff = 0;
  ['history', 'languageA', 'languageB', 'ES', 'EMC'].forEach(matiere => {
    const fs = document.querySelector(`#mode1-section fieldset.${matiere}`);
    const notes = getInputsValues(fs);
    const moy = moyenne(notes);
    total += moy * COEFFS[matiere];
    totalCoeff += COEFFS[matiere];
  });
  // Spécialité abandonnée (1re uniquement)
  const speleft = document.querySelector(`#mode1-section fieldset.speleft`);
  if (speleft) {
    const notes = getInputsValues(speleft);
    const moy = moyenne(notes);
    total += moy * COEFFS.speleft;
    totalCoeff += COEFFS.speleft;
  }
  // Option (bonus)
  const option = document.querySelector(`#mode1-section fieldset.option`);
  if (option) {
    const notes = getInputsValues(option);
    const moy = moyenne(notes);
    total += moy * COEFFS.option;
    // Option = bonus, ne pas ajouter au totalCoeff
  }
  return total / totalCoeff;
}

function calculerMode2() {
  // Mode 2 : Moyenne 1re + trimestres Term
  let total = 0, totalCoeff = 0;
  ['history', 'languageA', 'languageB', 'ES', 'EMC'].forEach(matiere => {
    const fs = document.querySelector(`#mode2-section fieldset.${matiere}`);
    const notes = getInputsValues(fs);
    // notes[0] = Moyenne 1re, notes[1-3] = Term T1, T2, T3
    const moy = moyenne(notes);
    total += moy * COEFFS[matiere];
    totalCoeff += COEFFS[matiere];
  });
  // Spécialité abandonnée
  const speleft = document.querySelector(`#mode2-section fieldset.speleft`);
  if (speleft) {
    const notes = getInputsValues(speleft);
    const moy = moyenne(notes);
    total += moy * COEFFS.speleft;
    totalCoeff += COEFFS.speleft;
  }
  // Option (bonus)
  const option = document.querySelector(`#mode2-section fieldset.option`);
  if (option) {
    const notes = getInputsValues(option);
    const moy = moyenne(notes);
    total += moy * COEFFS.option;
  }
  return total / totalCoeff;
}

function calculerMode3() {
  // Mode 3 : Moyenne globale 1re et Term
  let total = 0, totalCoeff = 0;
  ['history', 'languageA', 'languageB', 'ES', 'EMC', 'option'].forEach(matiere => {
    const fs = document.querySelector(`#mode3-section fieldset.${matiere}`);
    const notes = getInputsValues(fs);
    // notes[0] = Moyenne 1re, notes[1] = Moyenne Term
    const moy = moyenne(notes);
    total += moy * COEFFS[matiere];
    totalCoeff += COEFFS[matiere];
  });
  // Spécialité abandonnée
  const speleft = document.querySelector(`#mode3-section fieldset.speleft`);
  if (speleft) {
    const notes = getInputsValues(speleft);
    const moy = moyenne(notes);
    total += moy * COEFFS.speleft;
    totalCoeff += COEFFS.speleft;
  }
  // Option (bonus)
  const option = document.querySelector(`#mode3-section fieldset.option`);
  if (option) {
    const notes = getInputsValues(option);
    const moy = moyenne(notes);
    total += moy * COEFFS.option;
  }
  return total / totalCoeff;
}

// Calcul des épreuves anticipées et finales
function calculerEpreuves() {
  let total = 0, totalCoeff = 0;
  // Français écrit
  const frWritten = document.querySelector(`fieldset.fr-written input`);
  if (frWritten) {
    total += (parseFloat(frWritten.value) || 0) * COEFFS.frWritten;
    totalCoeff += COEFFS.frWritten;
  }
  // Français oral
  const frOral = document.querySelector(`fieldset.fr-oral input`);
  if (frOral) {
    total += (parseFloat(frOral.value) || 0) * COEFFS.frOral;
    totalCoeff += COEFFS.frOral;
  }
  // Sport
  const sport = document.querySelector(`fieldset.sport input`);
  if (sport) {
    total += (parseFloat(sport.value) || 0) * COEFFS.sport;
    totalCoeff += COEFFS.sport;
  }
  // Spécialités
  const spe1 = document.querySelector(`fieldset.spe1 input`);
  if (spe1) {
    total += (parseFloat(spe1.value) || 0) * COEFFS.spe1;
    totalCoeff += COEFFS.spe1;
  }
  const spe2 = document.querySelector(`fieldset.spe2 input`);
  if (spe2) {
    total += (parseFloat(spe2.value) || 0) * COEFFS.spe2;
    totalCoeff += COEFFS.spe2;
  }
  // Philosophie
  const philo = document.querySelector(`fieldset.philo input`);
  if (philo) {
    total += (parseFloat(philo.value) || 0) * COEFFS.philo;
    totalCoeff += COEFFS.philo;
  }
  // Grand oral
  const grandOral = document.querySelector(`fieldset.grand-oral input`);
  if (grandOral) {
    total += (parseFloat(grandOral.value) || 0) * COEFFS.grandOral;
    totalCoeff += COEFFS.grandOral;
  }
  return { total, totalCoeff };
}

// Gestion du bouton
document.getElementById('calculateBtn').addEventListener('click', function () {
  // Détecte le mode sélectionné
  let mode = 1;
  if (document.getElementById('mode2').checked) mode = 2;
  if (document.getElementById('mode3').checked) mode = 3;

  let moyenneControle = 0;
  if (mode === 1) moyenneControle = calculerMode1();
  if (mode === 2) moyenneControle = calculerMode2();
  if (mode === 3) moyenneControle = calculerMode3();

  // Les épreuves anticipées et finales
  const epreuves = calculerEpreuves();

  // Pondération globale (coeffs à ajuster selon la réforme)
  // Exemple : contrôle continu = 40%, épreuves finales = 60%
  const totalCoeff = 40 + 60;
  const noteFinale = ((moyenneControle * 40) + (epreuves.total / epreuves.totalCoeff * 60)) / totalCoeff;

  document.getElementById('resultText').textContent =
    `Votre moyenne estimée au Bac est : ${noteFinale.toFixed(2)} / 20`;
});
