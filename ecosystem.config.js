module.exports = {
  apps: [{
    name: 'gtm-swarm',
    script: 'node_modules/.bin/next',
    args: 'start -p 4000',
    cwd: process.env.DEPLOY_DIR || '/dashboard',
    env: {
      NODE_ENV: 'production',
      PORT: '4000',
    },
  }],
}
