param(
  [ValidateSet("dev", "test", "prod", "all")]
  [string]$Environment = "dev"
)

if ($Environment -eq "all") {
  kubectl delete -f ../prod/ --ignore-not-found
  kubectl delete -f ../test/ --ignore-not-found
  kubectl delete -f ../dev/ --ignore-not-found
} else {
  kubectl delete -f "../$Environment/" --ignore-not-found
}
