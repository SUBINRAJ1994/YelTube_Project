#!/bin/bash
# YelTube Database Backup Script

# Configurations
DB_USER="root"
DB_NAME="yeltube_db"
DB_HOST="localhost"
DB_PORT="3307"
BACKUP_DIR="/home/ubuntu/Yeltube_project/backups/database"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/yeltube_db_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "Starting Database Backup..."
# Run mysqldump
mysqldump -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" "${DB_NAME}" > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
  echo "Backup successfully created at ${BACKUP_FILE}"
  # Gzip the backup to save space
  gzip "${BACKUP_FILE}"
  echo "Compressed backup created at ${BACKUP_FILE}.gz"
  
  # Keep only the last 30 days of backups
  find "${BACKUP_DIR}" -type f -name "*.sql.gz" -mtime +30 -delete
  echo "Purged backups older than 30 days."
else
  echo "Error: Database backup failed!" >&2
  exit 1
fi
