<div align="center">

# FleetPulse

**Real-time fleet management and IoT telemetry platform**

[![Go](https://img.shields.io/badge/Go-1.23-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Overview

FleetPulse is a B2B platform for logistics companies to monitor their vehicle fleet in real-time. It provides live tracking, telemetry monitoring (battery, fuel, speed, temperature), configurable alerts, and analytics dashboards.

<details>
<summary><strong>Screenshots</strong></summary>
<br>

> Dashboard, Fleet view, Vehicle details, Analytics...
> *(Add your screenshots here)*

</details>

---

## Features

- **Live Tracking** — Real-time vehicle positions via WebSocket
- **Telemetry Monitoring** — Battery, fuel, speed, engine temperature
- **Alert System** — Multi-severity alerts with acknowledge/resolve workflow
- **Analytics** — Fleet efficiency, consumption trends, distance reports
- **Driver Management** — Assignments and performance tracking

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Go, Chi, PostgreSQL, Redis, WebSocket |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| DevOps | Docker, Kubernetes, GitHub Actions, Terraform |
| Monitoring | Prometheus, Grafana, Loki |

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Go 1.23+ *(for local dev)*
- Node.js 20+ *(for local dev)*

### Run with Docker

```bash
git clone https://github.com/Sid-Romero/fleetpulse.git
cd fleetpulse
docker compose up -d
```

Access:
- Frontend: http://localhost:5173
- API: http://localhost:8080
- Grafana: http://localhost:3001

### Run locally

```bash
# Backend
cd backend
cp .env.example .env
go run ./cmd/api

# Frontend (new terminal)
cd frontend
npm install && npm run dev

# Simulator (optional)
go run ./cmd/simulator
```

---

## Project Structure

```
fleetpulse/
├── backend/
│   ├── cmd/api/          # API server
│   ├── cmd/simulator/    # IoT vehicle simulator
│   ├── internal/         # Domain, services, handlers
│   └── migrations/       # SQL schema
├── frontend/
│   ├── src/components/   # React components
│   └── src/types/        # TypeScript definitions
└── deployments/          # Docker, K8s, Terraform
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/vehicles` | List vehicles |
| GET | `/api/v1/vehicles/:id` | Vehicle details |
| GET | `/api/v1/vehicles/:id/telemetry` | Vehicle telemetry |
| GET | `/api/v1/alerts` | List alerts |
| POST | `/api/v1/alerts/:id/acknowledge` | Acknowledge alert |
| GET | `/api/v1/analytics/stats` | Fleet statistics |
| WS | `/ws/telemetry` | Real-time updates |

---

## Roadmap

- [x] Core API & WebSocket
- [x] React dashboard
- [x] Docker setup
- [ ] JWT authentication
- [ ] Kubernetes Helm charts
- [ ] Terraform cloud deployment
- [ ] Mobile app (React Native)

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
<sub>Built by <a href="https://github.com/Sid-Romero">Sid Romero</a></sub>
</div>
