module.exports = {
  apps: [
    {
      name: 'backend-gazeta',
      script: './dist/apps/backend-gazeta/main.js',
      cwd: '/home/gazetadopara.com/public_html/site-gazeta',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        BASE_URL: 'https://gazetadopara.com'
      },
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/backend-err.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
};
