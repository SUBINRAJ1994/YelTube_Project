#!/bin/bash
# YelTube Media Backup Script

# Configurations
MEDIA_DIR="/home/ubuntu/Yeltube_project/backend/media"
BACKUP_DIR="/home/ubuntu/Yeltube_project/backups/media"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/yeltube_media_${TIMESTAMP}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "Starting Media Directory Backup..."
# Tar and compress media directory
tar -czf "${BACKUP_FILE}" -C "${MEDIA_DIR}" .

if [ $? -eq 0 ]; then
  echo "Media backup successfully created at ${BACKUP_FILE}"
  
  # Keep only the last 7 days of media backups (since media can be large)
  find "${BACKUP_DIR}" -type f -name "*.tar.gz" -mtime +7 -delete
  echo "Purged media backups older than 7 days."
else
  echo "Error: Media backup failed!" >&2
  exit 1
fi
