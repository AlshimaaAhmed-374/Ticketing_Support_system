param(
  [ValidateSet("dev", "test", "prod", "all")]
  [string]$Environment = "all"
)

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")

function Build-ServiceImage {
  param(
    [string]$ContextRelative,
    [string]$ImageName,
    [string]$Tag,
    [string]$Mode = ""
  )

  $ContextPath = Join-Path $RepoRoot $ContextRelative

  if (-not (Test-Path $ContextPath)) {
    throw "Docker build context not found: $ContextPath"
  }

  Write-Host ""
  Write-Host "Building ${ImageName}:${Tag}" -ForegroundColor Cyan

  if ($Mode -ne "") {
    docker build --build-arg "MODE=$Mode" -t "${ImageName}:${Tag}" $ContextPath
  }
  else {
    docker build -t "${ImageName}:${Tag}" $ContextPath
  }

  if ($LASTEXITCODE -ne 0) {
    throw "Docker build failed for ${ImageName}:${Tag}"
  }
}

function Build-Environment {
  param([string]$EnvName)

  Write-Host ""
  Write-Host "========================================" -ForegroundColor Yellow
  Write-Host "Building images for $EnvName" -ForegroundColor Yellow
  Write-Host "Repo root: $RepoRoot"
  Write-Host "========================================" -ForegroundColor Yellow

  Build-ServiceImage "auth-service" "ticketing/auth-service" $EnvName
  Build-ServiceImage "ticket-service" "ticketing/ticket-service" $EnvName
  Build-ServiceImage "support-service" "ticketing/support-service" $EnvName
  Build-ServiceImage "notification-service" "ticketing/notification-service" $EnvName
  Build-ServiceImage "reporting-service" "ticketing/reporting-service" $EnvName

  $frontendMode = "k8s-$EnvName"
  Build-ServiceImage "frontend" "ticketing/frontend" $frontendMode $frontendMode
}

function Restart-Deployments {
  Write-Host ""
  Write-Host "Restarting deployments..." -ForegroundColor Green

  kubectl rollout restart deployment/auth-service
  kubectl rollout restart deployment/ticket-service
  kubectl rollout restart deployment/support-service
  kubectl rollout restart deployment/notification-service
  kubectl rollout restart deployment/reporting-service
  kubectl rollout restart deployment/frontend

  Write-Host ""
  Write-Host "Waiting for deployments to be ready..." -ForegroundColor Yellow

  kubectl rollout status deployment/auth-service
  kubectl rollout status deployment/ticket-service
  kubectl rollout status deployment/support-service
  kubectl rollout status deployment/notification-service
  kubectl rollout status deployment/reporting-service
  kubectl rollout status deployment/frontend
}

function Start-PortForwarding {

  Write-Host ""
  Write-Host "Starting port forwarding..." -ForegroundColor Green

  Start-Process powershell -ArgumentList "kubectl port-forward service/auth-service 5001:5001"
  Start-Process powershell -ArgumentList "kubectl port-forward service/ticket-service 5002:5002"
  Start-Process powershell -ArgumentList "kubectl port-forward service/support-service 5003:5003"
  Start-Process powershell -ArgumentList "kubectl port-forward service/notification-service 5004:5004"
  Start-Process powershell -ArgumentList "kubectl port-forward service/reporting-service 5005:5005"
  Start-Process powershell -ArgumentList "kubectl port-forward service/frontend 3000:80"

  Write-Host "Port forwarding started." -ForegroundColor Cyan
}

try {

  if ($Environment -eq "all") {

    Build-Environment "dev"
    Build-Environment "test"
    Build-Environment "prod"

  }
  else {

    Build-Environment $Environment

  }

  Restart-Deployments

  Start-Sleep -Seconds 5

  Start-PortForwarding

  Write-Host ""
  Write-Host "========================================" -ForegroundColor Green
  Write-Host "Everything completed successfully!" -ForegroundColor Green
  Write-Host "Frontend available at: http://localhost:3000" -ForegroundColor Cyan
  Write-Host "========================================" -ForegroundColor Green

}
catch {

  Write-Host ""
  Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red

}