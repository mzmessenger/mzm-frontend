#!/usr/bin/env node

/**
 * ./deploy.js -h host -u username
 */

/* eslint-disable no-console */

const path = require('path')
const rmtcmd = require('rmtcmd')

async function deploy({ config, remote, local }) {
  await local('npm run test', { cwd: __dirname })

  const target = '/var/www/mzm-frontend'
  const tmpDir = '/tmp/mzm-frontend'
  const src = path.join(__dirname, 'dist')

  await remote(`sudo mkdir -p ${target}`)
  await remote(`sudo mkdir -p ${tmpDir}`)
  await remote(`sudo chown -R ${config.username} ${tmpDir}`)

  await local('rm -rf dist/', { cwd: __dirname })
  await local('npm run build:prod', {
    cwd: __dirname,
    timeout: 60 * 1000
  })

  await local(
    [
      `rsync -av`,
      `--exclude='node_modules'`,
      `-e 'ssh -i ${config.privateKeyPath}'`,
      `${src}/`,
      `${config.username}@${config.host}:${tmpDir}/`
    ].join(' '),
    {
      cwd: __dirname
    }
  )

  await remote(`sudo cp -R ${tmpDir}/* ${target}/`)
  await remote(`sudo rm -rf ${tmpDir}`)
  await remote(`sudo systemctl reload nginx`)
}

;(async () => {
  const args = await rmtcmd.cli.getArgs()
  await rmtcmd.connect({ ...args, task: deploy })
})().catch(console.error)
