## Kubernetes Deployment Guide

This Kubernetes setup mirrors the existing Docker Compose architecture for `development`, `test`, and `production` while keeping all environments isolated.

### Folder Structure

```text
k8s/
├── dev/
├── test/
├── prod/
├── shared/
├── ingress/
├── monitoring/
└── scripts/
```

Each environment folder contains:
- `namespace.yaml`
- `stack.yaml` (ConfigMaps, Secrets, Deployments, Services, PVCs, Ingress)
- `kustomization.yaml`

### Architecture Highlights

- Separate namespaces:
  - `ticketing-dev`
  - `ticketing-test`
  - `ticketing-prod`
- Independent Deployments for:
  - `frontend`
  - `auth-service`
  - `ticket-service`
  - `support-service`
  - `notification-service`
  - `reporting-service`
  - `mongo-auth`, `mongo-ticket`, `mongo-support`
- Database persistence with PVC per Mongo deployment.
- Internal service discovery via Kubernetes DNS (for example `http://ticket-service:5002` in dev).
- Health checks:
  - Backends: `/health`
  - Frontend: `/`
  - MongoDB: TCP probe on `27017`

### Prerequisites

1. A Kubernetes cluster (Minikube recommended for local).
2. NGINX Ingress controller installed.
3. Docker daemon available for image builds.

### Build Images (reuse existing Dockerfiles)

From `k8s/scripts`:

```powershell
# Optional for Minikube local image loading
minikube -p minikube docker-env --shell powershell | Invoke-Expression

./build-images.ps1 -Environment dev
./build-images.ps1 -Environment test
./build-images.ps1 -Environment prod
# or
./build-images.ps1 -Environment all
```

### Deploy Commands

```powershell
kubectl apply -f k8s/dev/
kubectl apply -f k8s/test/
kubectl apply -f k8s/prod/
```

Deploy all at once:

```powershell
kubectl apply -f k8s/dev/; kubectl apply -f k8s/test/; kubectl apply -f k8s/prod/
```

### Access and Host Mapping

The Ingress uses **one hostname per environment** and path-based routing to each microservice (for example `/api/auth` → `auth-service`, `/api/tickets` → `ticket-service`) so the SPA and APIs share the same origin and avoid clashing with React routes like `/tickets` and `/notifications`.

Map each hostname to your ingress controller endpoint. For Docker Desktop / many local clusters, `127.0.0.1` works once port 80 is published; otherwise use the address from `kubectl get svc -n ingress-nginx` (or your ingress namespace).

```text
127.0.0.1 dev.ticketing.local
127.0.0.1 test.ticketing.local
127.0.0.1 prod.ticketing.local
```

Open the UI (APIs use the **same** host — do not rely on port-forwarding only the frontend pod):

- `http://dev.ticketing.local`
- `http://test.ticketing.local`
- `http://prod.ticketing.local`

### Apply configuration changes (images + Ingress)

After changing backend routes or the frontend env, rebuild images with the correct Vite mode and redeploy:

```powershell
cd k8s/scripts
./build-images.ps1 -Environment dev
kubectl apply -f ../dev/
kubectl rollout restart deployment/auth-service deployment/ticket-service deployment/notification-service deployment/frontend -n ticketing-dev
```

Rebuild the frontend image whenever you change `frontend/.env.k8s-*` or service URLs — Vite embeds those at build time.

### Verification Commands

```powershell
kubectl get namespaces
kubectl get pods -n ticketing-dev
kubectl get pods -n ticketing-test
kubectl get pods -n ticketing-prod
kubectl get services -n ticketing-dev
kubectl get services -n ticketing-test
kubectl get services -n ticketing-prod
kubectl get ingress -n ticketing-dev
kubectl get ingress -n ticketing-test
kubectl get ingress -n ticketing-prod
kubectl logs <pod-name> -n ticketing-dev
kubectl describe pod <pod-name> -n ticketing-dev
```

### Cleanup Commands

```powershell
kubectl delete -f k8s/dev/
kubectl delete -f k8s/test/
kubectl delete -f k8s/prod/
```

### Troubleshooting Commands

```powershell
kubectl get events -n ticketing-dev --sort-by=.metadata.creationTimestamp
kubectl describe deployment auth-service -n ticketing-dev
kubectl describe service ticket-service -n ticketing-dev
kubectl logs deployment/support-service -n ticketing-dev --tail=200
kubectl exec -it deployment/support-service -n ticketing-dev -- printenv
kubectl port-forward svc/frontend 8080:80 -n ticketing-dev
```

### Notes on Issues Fixed for Kubernetes

- Browser calls must target the **Ingress hostname** (baked into the image via `frontend/.env.k8s-*`), not `localhost` service ports.
- Backends expose extra paths under `/api/...` for Ingress (`/api/auth`, `/api/tickets`, `/api/...` notifications) while keeping existing paths for Docker Compose and in-cluster `http://service-name:port` callers.
- Build the frontend with `--mode k8s-dev` (via `build-images.ps1`); `k8s/scripts/build-images.ps1` resolves paths from the repository root on Windows and macOS.
