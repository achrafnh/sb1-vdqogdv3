export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '24h';

export const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fes',
  'Tangier',
  'Agadir'
] as const;

export const SPECIALIZATIONS = [
  'Business Law',
  'Criminal Law',
  'Family Law',
  'Real Estate Law',
  'Labor Law',
  'Immigration Law',
  'Tax Law',
  'Intellectual Property'
] as const;

export const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50
};