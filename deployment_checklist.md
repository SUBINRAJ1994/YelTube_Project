# YelTube Production Deployment Checklist & Config Templates

This guide details the steps and configuration templates required to deploy YelTube to a production server (Ubuntu, Nginx, Gunicorn, and MySQL/MariaDB).

---

## 1. Django production settings (`settings.py`)

Ensure your environment variables are set correctly in production. Use a `.env` file loaded via `python-dotenv` or system environment variables.

```python
# settings.py configurations for production
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Security
DEBUG = False
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")

# CORS settings
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")
CORS_ALLOW_CREDENTIALS = True

# Secure cookies & headers
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

# Static and Media files
STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_URL = "/static/"

MEDIA_ROOT = BASE_DIR / "media"
MEDIA_URL = "/media/"
```

---

## 2. Systemd Gunicorn Service Configuration

Create a systemd service file at `/etc/systemd/system/gunicorn.service` to daemonize the Django application:

```ini
[Unit]
Description=gunicorn daemon for YelTube Backend
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/Yeltube_project/backend
ExecStart=/home/ubuntu/Yeltube_project/backend/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
```

---

## 3. Nginx Reverse Proxy Configuration

Create an Nginx configuration block at `/etc/nginx/sites-available/yeltube`:

```nginx
server {
    listen 80;
    server_name api.yeltube.com yeltube.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yeltube.com yeltube.com;

    # SSL Certificates (managed via Let's Encrypt Certbot)
    ssl_certificate /etc/letsencrypt/live/yeltube.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yeltube.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Static Assets
    location /static/ {
        alias /home/ubuntu/Yeltube_project/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Uploaded Media Files (videos and thumbnails)
    location /media/ {
        alias /home/ubuntu/Yeltube_project/backend/media/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        client_max_body_size 100M;  # Support large video uploads
    }

    # Proxy connections to Gunicorn
    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 600s;
        proxy_connect_timeout 600s;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/yeltube /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. Frontend Production Build and Serve

Build the React frontend using Vite:

```bash
cd YelTube
npm run build
```

This generates a static `dist/` directory. Serve this directly via Nginx configuration:

```nginx
server {
    listen 80;
    server_name yeltube.com www.yeltube.com;

    root /home/ubuntu/Yeltube_project/YelTube/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 5. Media Processing Optimization (FFmpeg & Celery)

For production loads, move FFmpeg transcoding and AI content moderation from Django inline background threads to a dedicated task queue like **Celery** with **Redis/RabbitMQ**:

1. Install celery and redis:
   ```bash
   pip install celery redis
   ```
2. Define `celery.py` inside `backend/backend/` and run celery worker:
   ```bash
   celery -A backend worker --loglevel=info
   ```
3. Update `videos/views.py` background triggers to call `.delay()` on celery tasks instead of spawning raw Python threads.

---

## 6. Database and Media Backups

To prevent data loss, schedule automatic daily and weekly backups using the scripts inside `backend/scripts/`:

1. Make scripts executable:
   ```bash
   chmod +x /home/ubuntu/Yeltube_project/backend/scripts/backup_database.sh
   chmod +x /home/ubuntu/Yeltube_project/backend/scripts/backup_media.sh
   ```

2. Schedule cron jobs:
   Open the crontab editor:
   ```bash
   crontab -e
   ```

3. Add the following entries to run the database backup daily at midnight and media backup weekly on Sunday:
   ```cron
   0 0 * * * /home/ubuntu/Yeltube_project/backend/scripts/backup_database.sh >> /home/ubuntu/Yeltube_project/backups/db_backup.log 2>&1
   0 2 * * 0 /home/ubuntu/Yeltube_project/backend/scripts/backup_media.sh >> /home/ubuntu/Yeltube_project/backups/media_backup.log 2>&1
   ```

