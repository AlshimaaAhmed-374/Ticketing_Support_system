param(
  [ValidateSet("dev", "test", "prod", "all")]
  [string]$Environment = "dev"
)

if ($Environment -eq "all") {
  kubectl apply -f ../dev/
  kubectl apply -f ../test/
  kubectl apply -f ../prod/
} else {
  kubectl apply -f "../$Environment/"
}
