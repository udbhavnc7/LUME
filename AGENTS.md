# Operational Rules for AI Agents

## Port and Network Configuration
- **NEVER** run or configure the application on port 3000 under any circumstances.
- **ALWAYS** use port **8000** for development, preview servers, and automated browser tasks (`http://localhost:8000/`).
- Package scripts and Vite configuration are locked to `--port=8000 --host=0.0.0.0`.
