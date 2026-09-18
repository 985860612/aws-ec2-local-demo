server {
    listen 80;
    listen [::]:80;
    server_name aws.100c.fun;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/acme;
        default_type text/plain;
        try_files $uri =404;
    }

    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name aws.100c.fun;

    ssl_certificate /etc/letsencrypt/live/aws.100c.fun/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aws.100c.fun/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # API remains on FastAPI; the React build is served independently.
    location ^~ /api/ {
        proxy_pass http://100.112.98.4:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;
        proxy_buffering off;
    }

    location / {
        proxy_pass http://100.112.98.4:5173;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_buffering off;
    }
}
