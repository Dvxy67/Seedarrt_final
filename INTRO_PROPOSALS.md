# Propositions — Animation d'intro

Trois options pour l'animation de chargement du site. Une seule sera implémentée.
L'intro se joue **une seule fois** au premier chargement, puis disparaît définitivement.
Durée cible : **1.5s à 3s maximum**.

---

## Option A — Rideau + nom

**Concept**
Fond noir plein écran. Le nom de l'artiste fade-in au centre en Cormorant Garamond.
Puis deux panneaux noirs s'écartent (haut / bas) pour révéler le Hero 3D derrière.

**Déroulé**
1. Écran noir — le nom apparaît en opacity 0 → 1 (0.8s)
2. Pause courte (0.4s)
3. Panneau haut monte, panneau bas descend simultanément (0.9s, ease exponentiel)
4. Le Hero 3D est révélé — l'intro est détruite

**Ambiance**
Élégant, théâtral, sobre. Référence : ouverture de rideau de galerie d'art.
Très cohérent avec la palette sombre et la typographie Cormorant.

**Complexité** : Faible — deux `div` + Framer Motion `AnimatePresence`

---

## Option B — Compteur + wipe

**Concept**
Un compteur numérique `00 → 100` en grand format avec le nom de l'artiste en dessous.
Quand le compteur atteint 100, un wipe vertical tranche l'écran via `clip-path`
et révèle la page d'un seul mouvement.

**Déroulé**
1. Fond noir — compteur `00` + nom apparaissent (0.4s)
2. Compteur monte de 0 à 100 en ~1.5s
3. À 100 — bref pause (0.2s)
4. Clip-path `inset(0 0 100% 0)` → `inset(0 0 0% 0)` : wipe du haut vers le bas (0.7s)
5. Site révélé

**Ambiance**
Dynamique, moderne, très "agence créative 2025". Beaucoup utilisé sur Awwwards.
Le compteur donne une sensation de précision et de maîtrise technique.

**Complexité** : Moyenne — compteur JS + clip-path Framer Motion

---

## Option C — Nom lettre par lettre, puis disparition

**Concept**
Le nom de l'artiste s'écrit lettre par lettre (stagger) sur fond noir,
reste affiché une seconde, puis disparaît avec un scale + opacity rapide.
Le plus minimaliste des trois.

**Déroulé**
1. Fond noir — chaque lettre du nom apparaît avec un stagger de 0.06s (total ~0.8s)
2. Pause (0.6s)
3. L'ensemble scale(1) → scale(1.08) + opacity 1 → 0 très rapidement (0.35s)
4. Site révélé

**Ambiance**
Minimaliste, confiant, signature. Proche de la philosophie "moins mais mieux" du projet.
Pas de mécanisme de chargement — juste une intro de marque pure.

**Complexité** : Faible — stagger Framer Motion sur les caractères

---

## Option D — Iris / diaphragme (clip-path circulaire)

**Concept**
Un masque circulaire noir recouvre tout le site. Le cercle s'agrandit depuis le centre
de l'écran jusqu'à disparaître complètement, révélant la scène 3D en dessous —
comme l'ouverture d'un diaphragme photographique ou d'un objectif.

**Pourquoi ça a du sens pour ce projet**
L'artiste est aussi graphiste : l'objectif, le diaphragme, le cadrage sont des références
directes à son univers visuel. L'iris renforce l'identité pluridisciplinaire du portfolio.
La scène Three.js déjà en mouvement derrière le masque rend la révélation particulièrement
forte — on "entre" dans un monde en train de vivre.

**Déroulé**
1. Fond noir — le nom de l'artiste apparaît au centre (0.5s)
2. Pause (0.4s)
3. Le cercle s'ouvre : `clip-path: circle(0% at 50% 50%)` → `circle(150% at 50% 50%)` (1s)
4. Le panneau noir disparaît — la scène 3D est révélée dans son intégralité

**Variante possible**
Décentrer le point d'ouverture (ex: `circle(150% at 30% 60%)`) pour un effet
plus asymétrique et graphique, moins prévisible.

**Ambiance**
Graphique, précis, référence à la photographie et au design. Rare sur les portfolios
d'artistes peintres, très cohérent sur un portfolio graphiste/pluridisciplinaire.
Effet "coup de poing" au premier chargement.

**Complexité** : Faible — un seul `div` + clip-path Framer Motion

---

## Option retenue

> À compléter — noter ici l'option choisie et la date de décision.
