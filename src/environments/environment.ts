declare const require: any;

export const environment = {
  production: false,
  groqApiKey: '',
};

try {
  const localEnv = require('./environment.local');
  if (localEnv?.environment) {
    Object.assign(environment, localEnv.environment);
  }
} catch {
  // Local environment file not present. Use defaults.
}
