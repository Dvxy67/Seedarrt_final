# Contributions d'un graphiste au site Seedarrt

## Icônes personnalisées

### SVG inline — le plus puissant pour un portfolio artiste

- Icônes de navigation dessinées à la main (style esquisse, pas les icônes génériques FontAwesome)
- Curseur personnalisé (`cursor: url(cursor.svg), auto`) — très impactant sur un site créatif
- Icônes de filtres Portfolio (pinceau pour Peinture, cube pour 3D, plume pour Graphisme) au lieu de texte brut

### Format SVG en React — simple à intégrer

```jsx
// client/src/components/icons/BrushIcon.jsx
export function BrushIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {/* tracé dessiné par le graphiste dans Illustrator/Figma */}
      <path d="..." stroke="currentColor" fill="none" />
    </svg>
  )
}
```

---

## Autres contributions haute valeur

### Typographie expressive

- Lettrine animée sur le Hero (première lettre du nom en grand, style éditorial)
- Variation d'épaisseur sur les titres avec `font-variation-settings` (si la fonte le supporte)

### Textures et matières

- Une image de grain/noise en overlay CSS (`mix-blend-mode: overlay, opacity: 0.04`) pour casser le flat design — très courant dans les portfolios haut de gamme
- Une signature SVG animée (trait qui se dessine avec `stroke-dashoffset`)

### Loader / splash screen

- Un logo qui se dessine en SVG avant que la page apparaisse (remplace le blanc au chargement)

### Séparateurs de sections

- Des formes SVG organiques entre les sections au lieu de `<hr>` ou de simples espaces

### Favicon + PWA icons

- Favicon custom au format `.ico` + `.svg` (les navigateurs modernes supportent SVG favicon)
- Les icônes Apple Touch Icon pour l'ajout en favoris mobile

---

## Ce qui a le plus d'impact sur ce site précisément

Vu l'esthétique actuelle (fond sombre `#080808`, accent gold `#b8975a`), le plus cohérent serait :

| Priorité | Élément | Effort technique |
|---|---|---|
| 1 | Curseur custom | Faible — SVG + CSS |
| 2 | Signature SVG animée | Moyen — SVG + stroke-dashoffset |
| 3 | Icônes de filtre dessinées | Faible — SVG inline en React |
| 4 | Grain de texture en overlay | Très faible — une image + CSS |

Ces quatre éléments sont techniquement simples à intégrer et font une vraie différence visuelle sur l'identité du site.

---

## Ressources pour le graphiste

- **Figma** → exporter en SVG optimisé (plugin SVGO)
- **Adobe Illustrator** → Fichier > Exporter > SVG, cocher "CSS Properties: Style attributes"
- **SVGOMG** (web) → optimiser le poids des SVG avant intégration
- Cible : chaque icône SVG < 2 KB
