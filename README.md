# Bot WhatsApp - Déploiement Public 🚀

Bot WhatsApp pour envoyer des codes depuis une interface web avec Node.js + Express.

## Déploiement rapide

### Option 1 : Render (Recommandé) ⭐

1. Allez sur https://render.com
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre GitHub et sélectionnez ce repo
4. Configurez :
   - **Name** : whatsapp-code-bot
   - **Environment** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
5. Ajoutez les variables d'environnement :
   ```
   PORT=3000
   API_KEY=49bd13bd
   API_SECRET=DliY4fiDOrvBBCDo
   ```
6. Cliquez "Create Web Service"

Votre site sera accessible à : `https://whatsapp-code-bot.onrender.com`

### Option 2 : Railway

```bash
npm install -g @railway/cli
railway login
cd whatsapp-code-bot
railway init
railway up
```

### Option 3 : Heroku

```bash
npm install -g heroku
heroku login
heroku create whatsapp-code-bot
git push heroku main
```

## Utilisation

1. Ouvrez le lien du site déployé
2. Entrez le mot de passe : `Barry-MD`
3. Scannez le QR code WhatsApp
4. Ajoutez des codes
5. Envoyez-les à un numéro WhatsApp

## API Keys

- API Key : `49bd13bd`
- API Secret : `DliY4fiDOrvBBCDo`
- Mot de passe site : `Barry-MD`

## Fonctionnalités

✅ Interface web rouge moderne
✅ Authentification par mot de passe
✅ Base de données SQLite
✅ Envoi de codes via WhatsApp
✅ Historique des envois
✅ QR Code WhatsApp Web
✅ API sécurisée

## Commandes Locales

```bash
git clone https://github.com/moncionmood6-debug/whatsapp-code-bot.git
cd whatsapp-code-bot
npm install
npm start
```

Puis ouvrez : `http://localhost:3000`

## Support

Pour des questions ou bugs, créez une issue sur GitHub.

## Licence

MIT
