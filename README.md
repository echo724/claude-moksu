# Claude Moksu

## 1) What it is

Claude Moksu is a web UI for creating and editing Claude Code configuration files.

It provides:
- A settings editor for Claude settings
- JSON import/export
- Real-time validation
- A Skills Builder for `SKILL.md` files

## 2) How to run (Docker + Docker Compose)

### Docker (single production container)

Build image:

```bash
docker build -t claude-moksu .
```

Run container:

```bash
docker run --rm -p 3000:80 --name claude-moksu claude-moksu
```

Open: `http://localhost:3000`

### Docker Compose (recommended)

Run production service:

```bash
docker compose up --build app
```

Open: `http://localhost:3000`

Run development service (Vite with live reload):

```bash
docker compose --profile dev up dev
```

Open: `http://localhost:5173`

Stop services:

```bash
docker compose down
```
