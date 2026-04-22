# Branda.IA — Guide de demarrage

## Structure des fichiers

```
branda-ia/
├── index.html        ← Interface utilisateur
├── style.css         ← Design & mise en forme
├── script.js         ← Logique frontend (fetch, rendu)
├── app.py            ← Backend Python (serveur Flask + IA simulee)
├── requirements.txt  ← Dependances Python
└── README.md
```

## Demarrage en 3 etapes

### 1. Installer les dependances Python

```bash
pip install -r requirements.txt
```

### 2. Lancer le backend

```bash
python app.py
```

Le serveur demarre sur http://localhost:5000

### 3. Ouvrir l'interface

Ouvrez `index.html` directement dans votre navigateur (double-clic ou glisser-deposer).

---

## Fonctionnement

- Le frontend envoie le nom de la marque et la demande au backend via `fetch`
- Le backend detecte le secteur d'activite et simule une analyse complete
- La reponse JSON est rendue dynamiquement dans l'interface

## Secteurs detectes automatiquement

| Mots-cles              | Secteur                    |
|------------------------|----------------------------|
| wig, hair, beauty...   | Beaute & Bien-etre         |
| fashion, mode, robe... | Mode & Accessoires         |
| food, restaurant...    | Restauration & Gastronomie |
| tech, digital, app...  | Technologie & Digital      |
| sante, fitness, spa... | Sante & Bien-etre          |
| formation, cours...    | Formation & Education      |
| immobilier, maison...  | Immobilier                 |
| (autres)               | Commerce General           |

## Notes

- Aucune API externe requise
- Fonctionne entierement en local
- Aucune donnee transmise a des tiers
