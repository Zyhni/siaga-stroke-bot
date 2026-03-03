module.exports = {
  apps: [
    {
      name: "siagastroke-bot",
      script: "src/app.js",
      instances: 1,
      exec_mode: "fork",

      watch: false,

      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,

      max_memory_restart: "500M",

      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};