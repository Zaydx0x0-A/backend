#!/bin/bash

echo "📦 Installation des packages manquants..."

# Vérification des outils
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "🔧 Installation des dépendances de production..."

# Installation par catégorie
echo "🔐 Authentification & Sécurité..."
npm install --save @nestjs/jwt @nestjs/passport passport passport-jwt passport-local bcryptjs

echo "🗄️ Base de Données..."
npm install --save @nestjs/typeorm typeorm pg

echo "💾 Cache..."
npm install --save @nestjs/cache-manager cache-manager redis

echo "📚 Documentation..."
npm install --save @nestjs/swagger class-validator class-transformer

echo "📁 Fichiers..."
npm install --save multer sharp

echo "📄 Documents..."
npm install --save pdfkit exceljs qrcode

echo "💳 Paiements..."
npm install --save stripe

echo "🔔 Notifications..."
npm install --save @nestjs-modules/mailer nodemailer handlebars twilio

echo "🌐 Web & Réseau..."
npm install --save @nestjs/websockets socket.io axios

echo "🛡️ Sécurité..."
npm install --save helmet csurf compression @nestjs/throttler

echo "⚙️ Configuration..."
npm install --save @nestjs/config @nestjs/schedule @nestjs/terminus

echo "📊 Logging & Utilitaires..."
npm install --save winston uuid moment

echo "🔧 Dépendances de développement..."
npm install --save-dev @types/passport-jwt @types/passport-local @types/bcryptjs @types/multer @types/sharp @types/compression @types/csurf @types/helmet @types/nodemailer @types/uuid @types/cache-manager @types/redis husky lint-staged

echo "✅ Tous les packages manquants ont été installés!"