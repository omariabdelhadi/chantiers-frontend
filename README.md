<img width="1919" height="662" alt="image" src="https://github.com/user-attachments/assets/9e009c0c-c34a-4a35-ad69-16985201cbde" /># Gestion des chantiers : Frontend

Interface web d'une application de gestion de chantiers développée pour **SSMTM** (société de génie civil) lors de mon stage de développeur full stack (juillet – août 2026).

> **Dépôt backend (API REST Spring Boot) :** [chantiers-backend](https://github.com/omariabdelhadi/chantiers-backend)

## Objectif

Permettre à une société de génie civil de piloter son activité depuis une seule application :

- suivre l'avancement des chantiers ;
- gérer les équipes et les ressources ;
- visualiser l'état global sur un tableau de bord de suivi en temps réel.

## Technologies

| Couche | Technologies |
|---|---|
| Frontend (ce dépôt) | Angular 21, TypeScript |
| Backend | Spring Boot, API REST ([dépôt séparé](https://github.com/omariabdelhadi/chantiers-backend)) |
| Base de données | [à compléter : MySQL, PostgreSQL…] |

## Aperçu

### Tableau de bord

<img width="1919" height="662" alt="image" src="https://github.com/user-attachments/assets/7ba7ffbb-1bb4-4c83-a5a7-5c7ea37a0ee9" />


| Liste des chantiers | Détail d'un chantier |
|---|---|
| ![Liste des chantiers](docs/screenshots/02-chantiers.png) | ![Détail d'un chantier](docs/screenshots/03-detail-chantier.png) |

| Gestion des équipes | Gestion des ressources |
|---|---|
| ![Gestion des équipes](docs/screenshots/04-equipes.png) | ![Gestion des ressources](docs/screenshots/05-ressources.png) |

## Lancer le projet

### Prérequis

- Node.js et npm
- Angular CLI : `npm install -g @angular/cli`
- Le backend démarré (voir le [README du backend](https://github.com/omariabdelhadi/chantiers-backend#readme))

### Installation et démarrage

```bash
git clone https://github.com/omariabdelhadi/chantiers-frontend.git
cd chantiers-frontend
npm install
ng serve
```

Ouvrir ensuite `http://localhost:4200/`. L'application se recharge automatiquement à chaque modification.

L'adresse de l'API est configurée dans src/environments/

### Build de production

```bash
ng build
```

Les fichiers générés se trouvent dans le dossier `dist/`.
