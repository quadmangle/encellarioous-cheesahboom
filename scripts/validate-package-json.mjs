#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { exit } from 'node:process';

const requiredScripts = ['build', 'typecheck', 'test', 'test:package'];
const requiredDependencies = ['react', 'react-dom'];
const requiredDevDependencies = ['typescript', 'esbuild', '@types/node'];

function ensure(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

async function loadPackageJson() {
  const pkgUrl = new URL('../package.json', import.meta.url);
  try {
    const raw = await readFile(pkgUrl, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Unable to load package.json:', error instanceof Error ? error.message : error);
    exit(1);
  }
}

function validatePackageJson(pkg) {
  const errors = [];

  ensure(typeof pkg === 'object' && pkg !== null, 'package.json must export an object.', errors);
  ensure(typeof pkg.name === 'string' && pkg.name.trim().length > 0, 'Missing package name.', errors);
  ensure(/^[a-z0-9@\-\/]+$/i.test(pkg.name), 'Package name contains invalid characters.', errors);

  ensure(typeof pkg.version === 'string' && pkg.version.trim().length > 0, 'Missing package version.', errors);
  ensure(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:[-+].+)?$/.test(pkg.version), 'Package version must be valid semver.', errors);

  ensure(pkg.private === true, 'package.json must be marked as private to avoid accidental publishing.', errors);
  ensure(pkg.type === 'module', 'package.json must set "type" to "module".', errors);

  ensure(typeof pkg.scripts === 'object' && pkg.scripts !== null, 'package.json must expose an npm scripts block.', errors);
  if (pkg.scripts) {
    for (const scriptName of requiredScripts) {
      ensure(
        typeof pkg.scripts[scriptName] === 'string' && pkg.scripts[scriptName].trim().length > 0,
        `Missing npm script: "${scriptName}".`,
        errors,
      );
    }
  }

  ensure(typeof pkg.dependencies === 'object' && pkg.dependencies !== null, 'Dependencies block is required.', errors);
  if (pkg.dependencies) {
    for (const dep of requiredDependencies) {
      ensure(typeof pkg.dependencies[dep] === 'string', `Dependency "${dep}" must be declared.`, errors);
    }
  }

  ensure(typeof pkg.devDependencies === 'object' && pkg.devDependencies !== null, 'Dev dependencies block is required.', errors);
  if (pkg.devDependencies) {
    for (const dep of requiredDevDependencies) {
      ensure(typeof pkg.devDependencies[dep] === 'string', `Dev dependency "${dep}" must be declared.`, errors);
    }
  }

  return errors;
}

async function main() {
  const pkg = await loadPackageJson();
  const errors = validatePackageJson(pkg);

  if (errors.length > 0) {
    console.error('package.json validation failed:');
    for (const message of errors) {
      console.error(` - ${message}`);
    }
    exit(1);
  }

  console.log('package.json validation passed.');
}

await main();
