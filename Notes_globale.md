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
Un compteur numérique `00 → 100` en grand format (police monospace ou Cormorant)
avec le nom de l'artiste en dessous. Quand le compteur atteint 100, un wipe vertical
tranche l'écran via `clip-path` et révèle la page d'un seul mouvement.

**Déroulé**
1. Fond noir — compteur `00` + nom apparaissent (0.4s)
2. Compteur monte de 0 à 100 en ~1.5s (animation CSS ou `useEffect` + `setInterval`)
3. À 100 — bref flash ou pause (0.2s)
4. Clip-path `inset(0 0 100% 0)` → `inset(0 0 0% 0)` : wipe du haut vers le bas (0.7s)
5. Site révélé

**Ambiance**
Dynamique, moderne, très "agence créative 2025". Beaucoup utilisé sur Awwwards.
Le compteur donne une sensation de précision et de contrôle.

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

## Option retenue

> À compléter — noter ici l'option choisie et la date de décision.

  3. Le Clip-path iris
  Un masque géométrique qui s'agrandit depuis le centre de l'écran, comme l'ouverture d'un objectif photo. Très graphique, parfait
  pour les artistes visuels.
