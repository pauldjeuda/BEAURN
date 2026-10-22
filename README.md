# Beaurn Wellness Studio — site vitrine

Site responsive en français pour Beaurn Wellness Studio à Yaoundé. Le projet utilise React 18, TypeScript strict, Vite, Tailwind CSS 3, React Router 6 et Lucide. Les photos du brief n'ayant pas été fournies séparément, les visuels sont des illustrations CSS temporaires et accessibles, conçues pour garder la palette et les proportions de la maquette.

## Démarrer

Prérequis : Node.js 20 ou une version LTS récente et npm.

```bash
npm install
npm run dev
```

Vite affiche l'adresse locale à ouvrir. Pour compiler et prévisualiser la production :

```bash
npm run build
npm run preview
```

`npm run lint` lance ESLint.

## Pages disponibles

- `/` — accueil et sections philosophie, valeurs, cours, planning, formules, équipe, expérience et contact
- `/planning` — planning hebdomadaire avec filtres coach/cours et URL partageable
- `/equipe` et `/equipe/:slug` — les cinq profils et leur planning
- `/galerie` — galerie avec visionneuse
- `/politique-de-confidentialite` et `/conditions-generales` — gabarits à valider
- toute autre URL — page 404

Les réservations passent par Reservio. Les cartes de séances et les abonnements ouvrent WhatsApp. Le planning est alimenté par un fournisseur mock hebdomadaire, isolé du composant d'affichage pour faciliter son remplacement.

## Structure

```text
src/
  App.tsx       routes, sections et composants de page
  main.tsx      point d'entrée React et polices
  styles.css    design responsive, tokens et illustrations provisoires
public/
  favicon.svg
  robots.txt
  sitemap.xml
```

## Images à remplacer

Les photos « hero », philosophie, cours, fond planning, équipe, galerie et lieu sont des placeholders CSS, identifiés visuellement comme temporaires. Fournir les visuels autorisés par Beaurn, les optimiser en WebP, puis remplacer les composants `Photo` dans `src/App.tsx` par des images dans `public/images/`. `public/og-image.jpg` est un aperçu 1200×630 recadré depuis la maquette jointe, à remplacer par une composition approuvée pour le partage. Prévoir un texte alternatif descriptif et des dimensions fixes ; les photos sous la ligne de flottaison doivent être chargées en différé. Les photos des personnes doivent être validées par les intéressées.

## Données et intégrations

Les coordonnées, URLs et liens sont regroupés dans `SITE` au début de `src/App.tsx`; les coachs, cours et le planning mock sont définis juste après. `VITE_TIKTOK_URL` est réservé au lien social encore manquant. `VITE_EVENTS_SOURCE=mock` est la valeur par défaut documentée pour la future intégration.

Pour connecter Reservio, garder une interface fournisseur stable de type `getWeek(weekStartISO, { coachSlug, courseSlug })`, renvoyant les séances avec leur cours, coach, heure de début/fin, niveau, durée et URL de réservation. Le site Reservio public consulté ne fournit pas d'API d'événements à brancher directement depuis le navigateur. Il faudra un fournisseur d'API autorisé ou un petit backend qui transforme les données, garde les secrets côté serveur et renvoie des événements dans le fuseau `Africa/Douala`. Le planning actuellement affiché est explicitement un exemple récurrent, pas un flux de disponibilité en temps réel.

Les pages légales restent des gabarits et nécessitent une validation avant publication. Le canonical est généré à partir de l'URL courante ; définir le domaine final et renseigner `public/sitemap.xml` avant publication.

## Hypothèses à valider par Beaurn

| Sujet | Hypothèse retenue |
|---|---|
| Devise | Tous les prix sont affichés en FCFA. |
| Séance unitaire | 7 000 FCFA figurent sur la maquette, mais pas sur Reservio ; montant à confirmer. |
| Cartes | Les cartes de 4 séances (25 000 FCFA) et 8 séances (36 000 FCFA) viennent du site actuel. Les séances sont à répartir librement. |
| Abonnement | Contact WhatsApp, ajout au profil client, paiement sur place : procédure reprise du site Reservio. |
| Coach Carla / Coach Cindy | La maquette demande « Coach Carla », tandis que le site actuel liste « Coach Cindy ». Le prototype suit la maquette ; nom à harmoniser. |
| Effectif | Le brief demande cinq coachs (Aïsha, Aurélie, Coach Carla, Coach Hilarion, Ornella), alors que la page Reservio consultée affiche Aurélie, Coach Cindy, Coach Hilarion et Joyce. Les données du prototype suivent la liste et l'orthographe du brief. |
| Rôles | Les rôles d'Aurélie et Coach Hilarion ne sont pas établis ; « Coach Pilates » est utilisé provisoirement. |
| Biographies | Pas de bios personnelles disponibles dans la maquette ; une présentation générique et modifiable est utilisée. |
| Réservation | Pas de réservation native : les liens de réservation redirigent vers Reservio. |
| Planning | Le tableau est alimenté par des créneaux d'exemple répétés chaque semaine selon le brief. Aucune donnée réelle de disponibilité n'a été publiée par cette intégration. Les dates s'affichent relativement à la semaine courante, lundi en premier. |
| TikTok | URL non fournie ; `VITE_TIKTOK_URL` reste facultative. |
| Photos | Aucune photo originale n'est fournie. Les visuels CSS sont des remplacements temporaires, pas des photographies réelles du studio ou de l'équipe. |
| Horaires et coordonnées | Adresse, numéro, horaires, coordonnées de carte et avertissement GPS repris du brief et du site Reservio public. Vérifier le point Google Maps avant publication. |

## Contenu source consulté

Les informations opérationnelles reprises (présentation, tarifs des cartes, équipe listée, adresse, téléphone, horaires et liens légaux) ont été comparées à [la page publique Beaurn Wellness Studio sur Reservio](https://beaurn-pilates.reservio.com/), consultée le 21 octobre 2026. Le contenu du planning affiché ici reste un jeu mock.
