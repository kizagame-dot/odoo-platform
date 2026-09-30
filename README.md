# odoo-platform

> 🚧 En construction — Part 1/11

Plateforme Odoo self-hosted, construite et industrialisée comme en entreprise : conteneurisation, CI/CD, infrastructure as code, observabilité, et déploiement multi-cible (Raspberry Pi 4 en mini-cloud local, puis AWS).

Projet réalisé dans le cadre d'une remise à niveau technique visant un poste **DevOps**, avec une spécialisation **Odoo**.

## Objectif

Construire, casser et réparer une infrastructure Odoo complète, en documentant chaque décision technique et chaque incident réellement rencontré — pas des tutoriels suivis pas à pas, mais un projet pensé, mis en panne et dépanné comme sur un vrai poste.

## Architecture cible

```text
Client → Nginx (TLS) → Odoo (+ module custom) → PostgreSQL
              ↑
  GitHub Actions · Monitoring · Backups
  Pi4 : Docker Compose puis k3s (mini-cloud)
  AWS : même stack via Terraform
```

## Stack technique

- **Conteneurisation :** Docker, Docker Compose
- **Orchestration :** Kubernetes (k3s)
- **Application :** Odoo (ERP/CRM), module custom, PostgreSQL
- **Reverse proxy :** Nginx (TLS)
- **Infrastructure as Code :** Ansible (Raspberry Pi 4), Terraform (AWS)
- **CI/CD :** GitHub Actions
- **Observabilité :** Prometheus/Grafana ou Uptime Kuma
- **Cibles de déploiement :** Raspberry Pi 4 (8 Go) — mini-cloud local, et AWS

## Structure du repo

```text
odoo-platform/
├── docker/            Dockerfile, compose, config Nginx
├── addons/            Module Odoo custom
├── k8s/               Manifests / Helm
├── infra/
│   ├── ansible/       Provisioning du Pi4
│   └── terraform/     Infrastructure AWS
├── .github/workflows/ Pipelines CI/CD
├── monitoring/        Configuration monitoring
├── scripts/           Backup / restore
└── docs/
    ├── architecture.md    Schéma détaillé et choix techniques
    ├── runbook.md         Procédures d'exploitation
    ├── odoo-notes.md      Notes fonctionnelles et techniques Odoo
    ├── docker-notes.md    Notes Docker
    └── incidents/         Postmortems réels rencontrés pendant le projet
```



## Auteur

Projet personnel réalisé en autonomie — CCNA, AWS Cloud Practitioner, développement web.