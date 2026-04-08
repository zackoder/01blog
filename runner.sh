#!/bin/bash

gnome-terminal --title="redis server" \
  --command "/bin/bash -c 'cd ~/Downloads/redis-stable && ./src/redis-server; exec bash'"

gnome-terminal --title="Spring Backend (demo)" \
  --command "/bin/bash -c 'cd demo && ./mvnw spring-boot:run; exec bash'"

gnome-terminal --title="Angular Frontend (ng serve)" \
  --command "/bin/bash -c 'cd zero1blog-frontend && npm run start; exec bash'"

echo "Docker container checked and both terminals launched."
