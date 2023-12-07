/* eslint-disable no-console */

// Get the version from package.json
const version = process.env.npm_package_version

console.log(`Bumping version to '${version}'...\n`)

const exec = require('child_process').execSync

// Run git commands to commit and tag the new version
exec('git add package.json')
exec(`git commit -m "Bump version to ${version}"`)
exec(`git tag v${version}`)

// Push the commit and the tag
exec('git push && git push --tags')

console.log(`\n✅ Tagged and pushed 'v${version}'`)
