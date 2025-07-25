docker build -f "Netbird-Dockerfile" --force-rm -t actiondelayapiworker:latest-netbird  --build-arg "BUILD_CONFIGURATION=Release" "../" 
docker tag actiondelayapiworker:latest-netbird tylerobrien/actiondelayapiworker:latest-netbird
docker push tylerobrien/actiondelayapiworker:latest-netbird

docker build -f "Tailscale-Dockerfile" --force-rm -t actiondelayapiworker:latest-tailscale  --build-arg "BUILD_CONFIGURATION=Release" "../" 
docker tag actiondelayapiworker:latest-tailscale tylerobrien/actiondelayapiworker:latest-tailscale
docker push tylerobrien/actiondelayapiworker:latest-tailscale

docker build -f "Normal-Dockerfile" --force-rm -t actiondelayapiworker:latest  --build-arg "BUILD_CONFIGURATION=Release" "../" 
docker tag actiondelayapiworker:latest tylerobrien/actiondelayapiworker:latest
docker push tylerobrien/actiondelayapiworker:latest

docker tag actiondelayapiworker:latest tylerobrien/actiondelayapiworker:latest-plain
docker push tylerobrien/actiondelayapiworker:latest-plain