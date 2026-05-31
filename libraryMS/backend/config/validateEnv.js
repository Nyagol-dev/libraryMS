/**
 * Validates that all required environment variables are present and meet
 * minimum security requirements. Calls process.exit(1) if validation fails.
 */
const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET', 'NODE_ENV', 'CLIENT_URL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[validateEnv] Missing required environment variables: ${missing.join(', ')}`
    );
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.error(
      '[validateEnv] JWT_SECRET must be at least 32 characters long.'
    );
    process.exit(1);
  }
};

module.exports = validateEnv;
