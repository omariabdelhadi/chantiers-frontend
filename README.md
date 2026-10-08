# Gestion des chantiers : Frontend

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


### Liste des chantiers

<img width="1919" height="891" alt="image" src="https://github.com/user-attachments/assets/c35839ae-4d13-445b-83a2-ebecf1d21d33" />


### Détail d'un chantier

<img width="1915" height="759" alt="image" src="https://github.com/user-attachments/assets/703db681-f0a3-45c1-8c72-b91cabb9395b" />


### Authentification

<img width="1398" height="768" alt="image" src="https://github.com/user-attachments/assets/9d53b969-7758-48b0-8d22-4d5a751f3a3d" />


### Profile

<img width="1919" height="888" alt="image" src="https://github.com/user-attachments/assets/c087f40f-c047-43fc-8455-c88d385caae4" />


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
