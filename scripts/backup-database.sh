#!/bin/bash
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

mkdir -p $BACKUP_DIR

pg_dump -U student_card_system_user -h localhost -d student_card_system -F c -b -v -f $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup successful: $BACKUP_FILE"
    # Garder seulement les 7 derniers backups
    ls -t $BACKUP_DIR/backup_*.sql | tail -n +8 | xargs rm -f
else
    echo "❌ Backup failed"
    exit 1
fi