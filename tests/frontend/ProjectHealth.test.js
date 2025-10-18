import { execSync } from 'child_process';

describe('Project Health', () => {
  it('should pass the linting checks', () => {
    try {
      execSync('npm run lint');
    } catch (error) {
      throw new Error(`Linting failed:\n${error.stdout.toString()}`);
    }
  });

  it('should not have any security vulnerabilities', () => {
    try {
      execSync('npm run audit');
    } catch (error) {
      throw new Error(`NPM audit failed:\n${error.stdout.toString()}`);
    }
  });
});
