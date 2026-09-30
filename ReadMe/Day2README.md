# 🚀 PART 2 — DOCKER DE A À Z

> **Bootcamp DevOps × Odoo — Part 2**
> Objectif : comprendre Docker en profondeur, pas seulement savoir taper des commandes.

---

## 📊 Progression

```text
PART 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] 1. Docker installé sur le Pi
[ ] 2. Premier conteneur, compris en profondeur
[ ] 3. Dockerfile pour une app maison
[ ] 4. Dockerfile multi-stage
[ ] 5. Réseaux Docker
[ ] 6. Volumes vs bind mounts
[ ] 7. Variables d'environnement et secrets
[ ] 8. Healthcheck
[ ] 9. Docker Compose
[ ] 10. Logs et debug
[ ] 11. docs/docker-notes.md rédigé
```

---

## 🎯 Objectifs

À la fin de cette partie, tu dois être capable de :

* expliquer la différence entre une image et un conteneur sans hésiter
* écrire un Dockerfile optimisé (cache, multi-stage) pour une app que tu as toi-même écrite
* expliquer ce qui se passe réseau-wise entre deux conteneurs
* expliquer pourquoi un volume survit à `docker compose down` et un conteneur non
* déboguer un conteneur qui ne démarre pas ou qui redémarre en boucle
* lire et interpréter les logs Docker

---

## 🏗️ Contexte

Ce chapitre ne construit pas encore Odoo — c'est volontaire. Tu vas d'abord conteneuriser **une app simple que tu maîtrises déjà** (ton profil web dev est un atout ici : une petite API + une base de données, dans le langage de ton choix). L'objectif est de comprendre Docker sans avoir en même temps la complexité d'Odoo sur le dos. Odoo arrive à la Part 3 et sera conteneurisé à la Part 4, une fois ces bases posées.

Tout se passe **sur le Pi**, à distance depuis Ubuntu (tu as posé les bases SSH/Git au Part 1, sers-t'en).

---

## 📋 Spécifications

### 1. Installation de Docker

**Exigences :**

* Docker installé via les paquets officiels (pas les dépôts génériques de distribution, souvent obsolètes)
* ton utilisateur peut lancer `docker` sans `sudo`
* `docker compose` (plugin, pas l'ancien binaire `docker-compose`) disponible

**Question :** pourquoi est-il déconseillé d'exécuter Docker en root permanent pour ton utilisateur, alors que le daemon Docker tourne lui-même en root ?

---

### 2. Premier conteneur : comprendre avant de construire

Avant d'écrire quoi que ce soit, lance une image existante et observe.

**À expérimenter et documenter :**

* la différence entre `run` et un conteneur déjà arrêté qu'on relance
* où vivent les fichiers d'un conteneur, et ce qui se passe si tu le supprimes
* la différence entre l'image (sur disque, en couches) et le conteneur (une instance en cours d'exécution)

**Question :** si tu modifies un fichier à l'intérieur d'un conteneur en cours d'exécution, puis que tu le redémarres (`stop` / `start`, pas `rm`), la modification est-elle toujours là ? Et si tu le recrées depuis l'image ?

---

### 3. Dockerfile pour ton app

**Exigences :**

* une app simple à toi (API + connexion à une base de données), avec son propre Dockerfile
* compréhension du **cache de build** : l'ordre des instructions doit être pensé pour ne pas invalider le cache à chaque changement de code
* `.dockerignore` en place

**Question :** pourquoi copier le fichier de dépendances (`package.json`, `requirements.txt`, etc.) et installer les dépendances *avant* de copier le reste du code ?

---

### 4. Dockerfile multi-stage

**Objectif :** une image finale légère, sans les outils de build.

**Exigences :**

* un stage de build (compilation, installation des dépendances de dev)
* un stage final minimal qui ne contient que le nécessaire pour exécuter l'app
* taille de l'image comparée avant/après (`docker images`)

**Question :** qu'est-ce qui, concrètement, gonfle une image Docker si on ne fait pas de multi-stage ?

---

### 5. Réseaux Docker

**Exigences :**

* ton API et ta base de données dans des conteneurs séparés, sur un **réseau bridge dédié** créé par toi
* les deux conteneurs communiquent par leur **nom**, pas par IP

**À expérimenter :**

* que se passe-t-il si les deux conteneurs ne sont pas sur le même réseau ?
* que se passe-t-il si tu inspectes le réseau et regardes les adresses IP internes attribuées ?

**Question :** comment un conteneur résout-il le nom d'un autre conteneur en IP ? Quel mécanisme est en jeu ?

---

### 6. Volumes vs bind mounts

**Exigences :**

* la base de données utilise un **volume nommé** (pas un bind mount) pour ses données
* test explicite : tu supprimes le conteneur de la base (`rm`, pas juste `stop`), tu le recrées, les données sont toujours là
* comprends la différence avec un bind mount (utile pour monter du code en développement, pas pour des données persistantes en prod)

**Question :** pourquoi un volume nommé est-il généralement préférable à un bind mount pour les données d'une base de données en production ?

---

### 7. Variables d'environnement et secrets

**Exigences :**

* configuration de l'app (URL de connexion à la base, ports, etc.) via variables d'environnement, pas en dur dans le code ou l'image
* un fichier `.env.example` versionné (valeurs factices), un `.env` réel **non versionné**

**Question :** pourquoi ne faut-il jamais mettre un vrai mot de passe dans un `ENV` d'un Dockerfile, même si l'image n'est pas publiée publiquement ?

---

### 8. Healthcheck

**Exigences :**

* un `HEALTHCHECK` défini sur ton API (ou dans le compose), qui vérifie réellement que l'app répond, pas juste que le process tourne
* observation de l'état `healthy` / `unhealthy` avec `docker ps`

**Question :** quelle est la différence entre un conteneur "up" et un conteneur "healthy" ? Donne un exemple concret où un conteneur serait up mais pas healthy.

---

### 9. Docker Compose

**Exigences :**

* un `docker-compose.yml` qui orchestre API + base de données + (si tu veux) un petit reverse proxy Nginx devant
* dépendances entre services exprimées correctement (attention : `depends_on` seul ne garantit pas qu'un service est *prêt*, seulement qu'il a *démarré* — vérifie comment gérer ça proprement, ça rejoint le healthcheck du point 8)
* variables d'environnement injectées depuis `.env`
* volumes et réseaux définis explicitement

**Validé quand :** `docker compose up -d` depuis un clone frais du repo suffit à tout faire fonctionner.

---

### 10. Logs et debug

**À pratiquer volontairement (pas besoin d'un vrai incident) :**

* casse quelque chose sciemment (mauvaise variable d'environnement, mauvais port exposé, image qui n'existe pas) et observe comment Docker te le signale
* apprends à distinguer dans les logs : erreur de build, erreur de démarrage, erreur applicative
* `docker logs`, `docker inspect`, `docker exec` pour aller voir *dans* un conteneur qui tourne

**Question :** un conteneur en `CrashLoopBackOff`-like (qui redémarre en boucle) — quelle est ta méthode pour trouver la cause en moins de 5 commandes ?

---

## 📄 docs/docker-notes.md

Rédige avec **tes propres mots**, pas un copier-coller de la doc :

* Image vs conteneur — la distinction, avec une analogie si ça t'aide à la retenir
* Comment fonctionne le cache de build et comment l'exploiter
* Réseaux : comment deux conteneurs se parlent
* Volumes vs bind mounts : quand utiliser lequel
* Ce que healthcheck t'apporte que `docker ps` seul ne montre pas
* Au moins un piège sur lequel tu es tombé pendant cette partie, et comment tu l'as résolu

---

## 🚨 Incidents

Si quelque chose casse en vrai (pas les tests volontaires du point 10, qui restent des exercices) pendant que tu construis, documente-le dans `docs/incidents/` avec le modèle déjà utilisé au Part 1.

---

## 🏁 Validation Part 2

```text
[ ] Docker installé proprement, utilisable sans sudo
[ ] App perso conteneurisée avec un Dockerfile optimisé (cache pensé)
[ ] Dockerfile multi-stage, taille d'image comparée avant/après
[ ] API et base sur un réseau bridge dédié, communication par nom
[ ] Volume nommé pour les données, persistance testée (rm + recréation)
[ ] Configuration via variables d'environnement, .env non versionné
[ ] Healthcheck fonctionnel et observable
[ ] docker-compose.yml qui démarre tout en une commande depuis un clone frais
[ ] Debug pratiqué sur au moins 2 pannes volontaires
[ ] docs/docker-notes.md rédigé avec tes propres mots
```

---

## 🎤 Questions de fin de partie

1. Différence entre une image et un conteneur ?
2. Pourquoi l'ordre des instructions dans un Dockerfile influence le temps de build ?
3. Qu'apporte le multi-stage build concrètement ?
4. Comment deux conteneurs se trouvent-ils sur un même réseau Docker ?
5. Pourquoi un volume survit à la suppression d'un conteneur, et un bind mount se comporte différemment ?
6. Où stocker un secret pour qu'il n'atterrisse jamais dans l'image ni dans le repo ?
7. Que vérifie un healthcheck que `docker ps` seul ne montre pas ?
8. `depends_on` garantit-il qu'un service est prêt à recevoir des requêtes ? Pourquoi ?
9. Ta méthode de debug face à un conteneur qui plante en boucle ?

---

## 🚀 PART 3

```text
PART 3
Odoo fonctionnel
   +
CRM → Ventes → Achats → Inventaire → Facturation
```

Tout ce que tu viens de comprendre sur Docker sera réutilisé à la Part 4 pour conteneuriser Odoo lui-même — mais la Part 3 se fait sur une instance Odoo de démo, pour se concentrer uniquement sur le métier.