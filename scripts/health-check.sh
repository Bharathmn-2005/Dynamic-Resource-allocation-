#!/bin/bash

echo "🏥 Checking service health..."

services=(
    "http://localhost:8080/actuator/health"
    "http://localhost:8082/actuator/health"
    "http://localhost:8083/actuator/health"
    "http://localhost:8081/actuator/health"
)

service_names=("Auth" "Booking" "Payment" "Notification")

failed=0
for i in "${!services[@]}"; do
    echo -n "Checking ${service_names[$i]}... "
    if curl -sf "${services[$i]}" > /dev/null 2>&1; then
        echo "✅ OK"
    else
        echo "❌ FAILED"
        failed=$((failed + 1))
    fi
done

if [ $failed -eq 0 ]; then
    echo ""
    echo "✅ All services are healthy!"
    exit 0
else
    echo ""
    echo "❌ $failed service(s) failed health check"
    exit 1
fi
