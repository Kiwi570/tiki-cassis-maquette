// Données réelles du site tikicassis.fr (relevé du 27/10/2026). Un seul fichier à mettre à jour.

export const CONTACT = {
  tel: '+33668263345',
  telAffiche: '+33 (0)6 68 26 33 45',
  email: 'calanques@tikicassis.fr',
  whatsapp: 'https://wa.me/33668263345',
  instagram: 'https://www.instagram.com/tiki_cassis/',
  instagramNom: '@tiki_cassis',
  groupement: 'https://www.visite-calanques-cassis.com/fr/3-circuits',
  itineraire: 'https://www.google.com/maps/search/?api=1&query=Quai%20Saint-Pierre%2013260%20Cassis',
  adresse: 'Quai Saint-Pierre, Port de Cassis (13260)',
  bateau: 'n°5',
  siret: '984 159 111 00017'
};

export const BATEAU = { annee: 1958, longueur: 12, largeur: 3, passagersMax: 12 };

// Privatisation en journée, prix pour le bateau (12 passagers max.)
export const TARIFS = {
  haute: { 1: 350, 2: 500, 3: 700, 4: 1000, 5: 1300, 6: 1600, 7: 1900, 8: 2200 },
  basse: { 1: 300, 2: 400, 3: 600, 4: 900, 5: 1200, 6: 1500, 7: 1800, 8: 2100 },
  soireePrivee: { 2: 400, 3: 600 },
  soireePartagee: { heures: 2, parPersonne: 50, minPersonnes: 8 },
  barbecue: 50
};

// Temps de navigation aller-retour depuis le port, sans arrêt (source : article du capitaine)
export const PALIERS = [
  { minutes: 60, n: 3, ajout: ['Port-Miou', 'Port-Pin', 'En-Vau'] },
  { minutes: 80, n: 5, ajout: ['L’Oule', 'Devenson'] },
  { minutes: 130, n: 8, ajout: ['l’Œil de Verre', 'Sugiton', 'Morgiou'] },
  { minutes: 180, n: 9, ajout: ['Sormiou'] }
];

// Événements : jour et mois fixes ; l'année est calculée à l'affichage
export const EVENEMENTS = [
  { id: 'fete-nationale', jour: 14, mois: 7, fr: 'Feu d’artifice du 14 juillet', en: 'Bastille Day fireworks (14 July)' },
  { id: 'assomption', jour: 15, mois: 8, fr: 'Feu d’artifice du 15 août', en: '15 August fireworks' }
];

export const HEURES_DEPART = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
