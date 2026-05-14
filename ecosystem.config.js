module.exports = {
  apps: [{
    name: 'gtm-swarm',
    script: 'node_modules/.bin/next',
    args: 'start -p 4000',
    cwd: __dirname,
    env: {
      NODE_ENV: 'production',
      PORT: '4000',
      NODE_EXTRA_CA_CERTS: '/etc/ssl/certs/ca-certificates.crt',
    },
  }],
}
