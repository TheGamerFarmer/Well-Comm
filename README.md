# WellComm

## Description

WellComm est une application web destinée aux aidants de personnes âgées pour faciliter la communication et la coordination avec les professionnels de santé (médecins, infirmiers, aides-soignantes, aides à domicile).

L'application permet de centraliser la gestion des soins en offrant des outils adaptés : agenda partagé, fils de transmission par catégorie, résumés hebdomadaires, et gestion des assistants avec permissions personnalisables.

## Fonctionnalités principales

- **Gestion des dossiers** : Créer et gérer plusieurs dossiers (un par personne aidée)
- **Agenda partagé** : Planifier et visualiser les événements et rendez-vous
- **Fils de transmission** : Communiquer par catégories (santé, hygiène, alimentation, ménage, maison)
- **Résumés hebdomadaires** : Consulter l'historique des 7 derniers jours
- **Gestion des assistants** : Ajouter des professionnels avec permissions personnalisées
- **Espace médecins** : Accès limité aux informations de santé
- **Application responsive** : Accessible sur ordinateur et mobile

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- PostgreSQL
- Git
- Java (pour le backend Spring Boot)
- Node.js et npm (pour le frontend React)

## Installation

### 1. Configuration de la base de données

Connectez-vous à PostgreSQL en tant qu'utilisateur postgres :

```bash
sudo -u postgres psql
```

Créez ensuite l'utilisateur et la base de données :

```sql
CREATE USER {user de votre choix} WITH PASSWORD '{mot de passe de votre choix}';
CREATE DATABASE {nom de votre choix} OWNER {user de votre choix};
```

Tapez `\q` pour quitter psql.

### 2. Clonage du projet

```bash
git clone https://github.com/TheGamerFarmer/Well-Comm.git
cd Well-Comm/
```

### 3. Configuration du backend

À la racine du projet, modifiez le fichier de configuration :

```bash
nano backend/WellComm/src/main/resources/application.properties
```

Modifiez les variables suivantes avec les identifiants de votre base de données :

```properties
spring.datasource.url=jdbc:postgresql:{url de la bdd}?ssl=true&sslmode=require
spring.datasource.username={user de la bdd}
spring.datasource.password={mot de passe de la bdd}
```

Enregistrez et fermez le fichier (Ctrl+X, puis Y, puis Entrée).

## Lancement de l'application

À la racine du projet, exécutez les commandes suivantes :

```bash
chmod +x lancement.sh
./lancement.sh
```

L'application est maintenant accessible à l'adresse : **http://localhost:3000/**

## Architecture

- **Backend** : Spring Boot (Java)
- **Frontend** : Next.js/Node
- **Base de données** : PostgreSQL

## Dépannage

Si vous rencontrez des problèmes :
- Vérifiez que PostgreSQL est bien démarré
- Assurez-vous que les ports 3000 et 8080 ne sont pas déjà utilisés
- Vérifiez que les identifiants de base de données sont corrects dans `application.properties`
- Regardez les logs du fontend et du backend pour comprendre l'erreur

## Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur le dépôt du projet.
