// Configuração do PM2 para Borracha de Roupa
// Execute: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'borracha-backend',
      script: './backend/server.js',
      cwd: '/var/www/borracha-de-roupa',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        JWT_SECRET: 'seu_jwt_secret_super_seguro_aqui',
        NITRO_API_TOKEN: 'pPWKFgks1X57ACaNYwwPevsH74aFub8UkzeLnrCK88tNZwqoCukdRXDoCqg0',
        FRONTEND_URL: 'https://borracharoupa.fun',
        FASHN_API_KEY: 'sua_fashn_api_key_aqui'
      },
      error_file: '/var/log/pm2/borracha-backend-error.log',
      out_file: '/var/log/pm2/borracha-backend-out.log',
      log_file: '/var/log/pm2/borracha-backend.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ],

  deploy: {
    production: {
      user: 'borracha-app',
      host: '31.97.162.251',
      ref: 'origin/main',
      repo: 'https://github.com/SEU_USUARIO/borracha-de-roupa.git',
      path: '/var/www/borracha-de-roupa',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};


