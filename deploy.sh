#!/bin/bash

# Estetik Dashboard VPS Deployment Script
# VPS IP: 15.235.141.2

echo "🚀 Starting Estetik Dashboard deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
echo "📦 Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
echo "📦 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/estetikdashboard
sudo chown $USER:$USER /var/www/estetikdashboard

# Copy application files (assuming files are uploaded to /tmp/estetikdashboard)
echo "📁 Copying application files..."
sudo cp -r /tmp/estetikdashboard/* /var/www/estetikdashboard/

# Install dependencies
echo "📦 Installing dependencies..."
cd /var/www/estetikdashboard
npm run install-all

# Build application
echo "🔨 Building application..."
npm run build

# Configure Nginx
echo "⚙️ Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/estetikdashboard
sudo ln -sf /etc/nginx/sites-available/estetikdashboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Start application with PM2
echo "🚀 Starting application with PM2..."
cd /var/www/estetikdashboard
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ Deployment completed successfully!"
echo "🌐 Application URL: http://15.235.141.2"
echo "📊 PM2 Status: pm2 status"
echo "📝 Nginx Logs: sudo tail -f /var/log/nginx/access.log"
echo "🔧 Backend Logs: pm2 logs estetik-dashboard-backend" 