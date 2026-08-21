#!/bin/bash
cd /Users/nishantkumar/Project/HDFC_Managecard/backend
exec mvn -q -pl "$1" spring-boot:run -DskipTests > "$2" 2>&1