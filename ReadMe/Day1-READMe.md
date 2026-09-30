# 🚀 DAY 1 — BOOTSTRAP DU PI4 ET DU REPO

> **Bootcamp DevOps × Odoo — Day 1**
> Objectif : poser l'environnement de travail sur lequel tout le projet `odoo-platform` va reposer.

---

## 📊 Progression

```text
DAY 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] 1. État des lieux du Pi
[ ] 2. Mise à jour et vérification 64 bits
[ ] 3. SSH par clé depuis Ubuntu
[ ] 4. Durcissement SSH minimal
[ ] 5. IP fixe
[ ] 6. Git + GitHub (clé dédiée)
[ ] 7. Repo odoo-platform + structure
[ ] 8. README + premier commit
[ ] 9. Documentation
```

---

## 🎯 Objectifs

À la fin de la journée, tu dois être capable de :

* piloter le Pi entièrement à distance depuis ton PC Ubuntu
* te connecter en SSH **sans mot de passe** (clé uniquement)
* expliquer pourquoi une IP fixe est nécessaire pour un serveur
* expliquer clé publique / clé privée et où chacune vit
* pousser du code sur GitHub en SSH
* justifier la structure de ton repo

---

## 🏗️ Situation de départ

```text
PC Ubuntu (poste de travail)
        │
        │ SSH
        ▼
Raspberry Pi 4 (8 Go)
Raspberry Pi OS Lite
```

Le Pi est déjà installé. Ce chapitre ne consiste donc **pas** à flasher une carte SD, mais à transformer un OS "frais" en serveur exploitable.

---

## 📋 Spécifications

### 1. État des lieux

Avant de toucher à quoi que ce soit, tu documentes le Pi.

**À relever :**

```text
Hostname
Version de l'OS (Debian / Raspberry Pi OS)
Architecture (32 ou 64 bits ?)
Version du noyau
RAM / disque disponibles
Interface réseau utilisée (Ethernet ou Wi-Fi) + IP actuelle
Utilisateur courant
```

**Question bloquante :** l'OS est-il en **64 bits** ? Les images Docker arm64 (Odoo, PostgreSQL) et k3s en dépendent. Si c'est du 32 bits, il faudra réinstaller. Mieux vaut le savoir maintenant.

**Piste de recherche :** `uname`, `/etc/os-release`, `hostnamectl`, `lsblk`, `free`.

---

### 2. Mise à jour du système

**Exigences :**

* paquets à jour
* hostname explicite (ex. `pi-cloud` ou équivalent)
* fuseau horaire et locale cohérents (l'heure compte pour les logs et TLS plus tard)

---

### 3. SSH par clé depuis Ubuntu

**Exigences :**

* une paire de clés générée **sur ton PC Ubuntu**, avec un algorithme moderne et une passphrase
* la clé publique installée sur le Pi
* un alias dans `~/.ssh/config` pour te connecter avec une commande courte
* connexion testée sans mot de passe

**Questions à te poser (et à noter dans tes docs) :**

1. Quelle clé ne doit **jamais** quitter ton PC ?
2. Que contient `authorized_keys` ?
3. Que vérifie `known_hosts` et de quoi te protège-t-il ?
4. Pourquoi une passphrase, si la clé est déjà secrète ?

---

### 4. Durcissement SSH minimal

⚠️ **Ordre impératif :** ne désactive l'authentification par mot de passe **qu'après** avoir validé la connexion par clé, et garde une session ouverte pendant que tu testes dans une deuxième. Sinon tu te bloques dehors.

**Exigences :**

* authentification par mot de passe désactivée
* connexion root par SSH désactivée
* configuration validée **avant** rechargement du service

**Piste de recherche :** `sshd_config`, `PasswordAuthentication`, `PermitRootLogin`, test de syntaxe de sshd.

Le durcissement complet (firewall, fail2ban, etc.) viendra au J6 avec Ansible.

---

### 5. IP fixe

**Objectif :** que le Pi soit toujours joignable à la même adresse.

**Deux approches possibles, à toi de choisir et de justifier :**

```text
A. Configuration statique sur le Pi
B. Réservation DHCP sur ta box/routeur
```

**Points d'attention :**

* selon la version de Raspberry Pi OS, la gestion réseau passe par **NetworkManager** ou par **dhcpcd** : identifie d'abord ce que ton Pi utilise
* l'IP choisie doit être **hors de la plage DHCP** de ton routeur (sinon conflit possible)
* ton CCNA sert ici : masque, passerelle, DNS

**Validé quand :** après un reboot, le Pi reprend la même IP et tu te reconnectes en SSH.

---

### 6. Git et GitHub

**Exigences :**

* Git installé sur le PC **et** sur le Pi
* identité Git configurée (nom, email)
* une clé SSH dédiée à GitHub (distincte de celle du Pi), enregistrée sur ton compte
* connexion à GitHub testée en SSH

**Question :** pourquoi utiliser une clé différente pour GitHub et pour le Pi ?

---

### 7. Le repo `odoo-platform`

**Exigences :**

* repo créé sur GitHub, cloné sur ton PC (tu développes sur Ubuntu, le Pi sert de cible)
* structure de dossiers en place (avec un fichier placeholder par dossier vide, car Git ne suit pas les dossiers vides)
* `.gitignore` soigné : aucun secret, aucun `.env`, aucun fichier de données

```text
odoo-platform/
├── README.md
├── docker/
├── addons/
├── k8s/
├── infra/
│   ├── ansible/
│   └── terraform/
├── .github/workflows/
├── monitoring/
├── scripts/
└── docs/
    ├── architecture.md
    ├── runbook.md
    ├── odoo-notes.md
    └── incidents/
```

---

### 8. README initial

Le README est la vitrine. Pour J1, il doit contenir au minimum :

* le nom et l'objectif du projet en 2-3 phrases
* le schéma d'architecture cible (celui de la roadmap)
* la liste des technologies prévues
* un statut : "🚧 en construction — Day 1/11"

Il sera réécrit au J11. Ce qui compte maintenant : qu'il existe et qu'il soit propre.

---

### 9. Premier commit

**Exigences :**

* commits **atomiques** (un commit = une idée)
* messages clairs et cohérents. Adopte dès maintenant une convention (ex. Conventional Commits : `feat:`, `docs:`, `chore:`) et garde-la tout le projet
* push effectué, historique visible sur GitHub

---

### 10. Documentation

Dans `docs/architecture.md`, écris une première section **"Environnement"** :

```text
- Poste de travail : Ubuntu (version)
- Cible : Raspberry Pi 4, 8 Go, OS + version, architecture
- Accès : SSH par clé, alias, IP fixe
- Choix effectués (IP statique ou réservation DHCP ?) et pourquoi
```

---

## 🚨 Incidents

Tu risques de rencontrer quelque chose (clé refusée, `Permission denied`, IP en conflit, lockout SSH...). **Ne les provoque pas, mais documente-les s'ils arrivent.**

Modèle à copier dans `docs/incidents/YYYY-MM-DD-titre.md` :

```markdown
# Incident — <titre>

## Symptôme
Ce que tu as observé.

## Impact
Ce qui ne fonctionnait plus.

## Investigation
Commandes lancées + résultats, dans l'ordre.

## Root cause
La vraie cause.

## Correction
Ce que tu as changé.

## Validation
Comment tu as prouvé que c'est réparé.

## Leçons
Ce que tu feras différemment.
```

---

## 🏁 Validation Day 1

Day 1 est validé lorsque :

```text
[ ] Le Pi est en 64 bits (ou réinstallé s'il ne l'était pas)
[ ] Le système est à jour, hostname défini
[ ] Connexion SSH par clé depuis Ubuntu, avec alias
[ ] Authentification par mot de passe désactivée (testée sans te bloquer)
[ ] Connexion root SSH désactivée
[ ] IP fixe stable après reboot
[ ] Git configuré sur PC et Pi
[ ] Connexion GitHub en SSH fonctionnelle
[ ] Repo odoo-platform créé avec sa structure
[ ] .gitignore en place, aucun secret commité
[ ] README initial publié
[ ] Au moins 3 commits propres poussés
[ ] docs/architecture.md : section Environnement rédigée
```

---

## 🎤 Questions de fin de journée

Réponds sans regarder tes notes, puis envoie-les-moi pour revue :

1. Explique le déroulé d'une connexion SSH par clé : qui prouve quoi à qui ?
2. Pourquoi désactiver l'authentification par mot de passe ?
3. Pourquoi un serveur doit-il avoir une IP fixe ?
4. Statique sur le Pi ou réservation DHCP : avantages et risques de chacune ?
5. Pourquoi le 64 bits est-il important pour la suite du projet ?
6. Qu'est-ce qui ne doit jamais être commité dans un repo ?
7. Que se passe-t-il si tu commits un secret par erreur ? Suffit-il de le supprimer dans le commit suivant ?
8. Qu'est-ce qu'un commit atomique, et pourquoi c'est important en équipe ?

---

## 🚀 DAY 2

```text
DAY 2
Docker de A à Z
   +
Dockerfile multi-stage
   +
Réseaux / Volumes / Compose
```

Le Pi devient alors ta machine Docker. Tout ce que tu prépares aujourd'hui (SSH, IP fixe, repo) sera utilisé en continu jusqu'au J11.
