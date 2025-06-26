# Estetik Dashboard

Estetik Tarbiya markazi uchun dashboard va veb-sayt.

## 🚀 Production Deployment

### VPS Requirements
- Ubuntu 20.04+ yoki boshqa Linux distribution
- Node.js 18+
- MongoDB 6.0+
- Nginx
- PM2

### Quick Deployment

1. **Fayllarni VPS ga yuklang:**
```bash
# Local kompyuterdan
scp -r estetikdashboard/ user@15.235.141.2:/tmp/
```

2. **VPS ga ulaning:**
```bash
ssh user@15.235.141.2
```

3. **Deployment script ni ishga tushiring:**
```bash
cd /tmp/estetikdashboard
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

1. **System packages ni o'rnating:**
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
```

2. **MongoDB ni o'rnating:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

3. **PM2 ni o'rnating:**
```bash
sudo npm install -g pm2
```

4. **Application ni o'rnating:**
```bash
sudo mkdir -p /var/www/estetikdashboard
sudo chown $USER:$USER /var/www/estetikdashboard
cp -r /tmp/estetikdashboard/* /var/www/estetikdashboard/
cd /var/www/estetikdashboard
npm run install-all
npm run build
```

5. **Nginx ni sozlang:**
```bash
sudo cp nginx.conf /etc/nginx/sites-available/estetikdashboard
sudo ln -sf /etc/nginx/sites-available/estetikdashboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

6. **Application ni ishga tushiring:**
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 📁 Project Structure

```
estetikdashboard/
├── frontend/                 # React frontend
│   ├── dist/                # Built frontend files
│   ├── src/
│   │   ├── components/      # React components
│   │   └── ...
│   └── package.json
├── backend/                  # Node.js backend
│   ├── dist/                # Built backend files
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── ...
│   ├── uploads/             # Uploaded images
│   └── package.json
├── nginx.conf               # Nginx configuration
├── ecosystem.config.js      # PM2 configuration
├── deploy.sh                # Deployment script
└── package.json             # Root package.json
```

## 🔧 Management Commands

### PM2 Commands
```bash
pm2 status                    # Application status
pm2 logs estetik-dashboard-backend  # Backend logs
pm2 restart estetik-dashboard-backend  # Restart backend
pm2 stop estetik-dashboard-backend     # Stop backend
```

### Nginx Commands
```bash
sudo nginx -t                 # Test nginx config
sudo systemctl reload nginx   # Reload nginx
sudo tail -f /var/log/nginx/access.log  # Access logs
sudo tail -f /var/log/nginx/error.log   # Error logs
```

### MongoDB Commands
```bash
sudo systemctl status mongod  # MongoDB status
sudo systemctl restart mongod # Restart MongoDB
mongo                         # MongoDB shell
```

## 🌐 Access URLs

- **Main Site:** http://15.235.141.2
- **Dashboard:** http://15.235.141.2/dashboard
- **API:** http://15.235.141.2/api

## 🔒 Security

- Firewall faol (UFW)
- Nginx security headers
- MongoDB local access only
- PM2 process management

## 📝 Logs

- **Nginx Access:** `/var/log/nginx/access.log`
- **Nginx Error:** `/var/log/nginx/error.log`
- **PM2 Logs:** `pm2 logs estetik-dashboard-backend`
- **MongoDB:** `/var/log/mongodb/mongod.log`

## 🚨 Troubleshooting

### Application not starting
```bash
pm2 logs estetik-dashboard-backend
sudo systemctl status mongod
sudo nginx -t
```

### Port conflicts
```bash
sudo netstat -tlnp | grep :5000
sudo netstat -tlnp | grep :80
```

### Permission issues
```bash
sudo chown -R $USER:$USER /var/www/estetikdashboard
sudo chmod -R 755 /var/www/estetikdashboard
``` 