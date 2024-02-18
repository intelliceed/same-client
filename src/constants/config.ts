
const environment = {
  API_URL: import.meta.env.VITE_API_URL,
};

export type EnvProp = keyof typeof environment
export type EnvPropValue = (typeof environment)[EnvProp]

// NOTE get value by prop name or defaults in case environment variable is undefined
export const config = (prop: EnvProp, defaults?: string | number | null): EnvPropValue => typeof environment[prop] === 'undefined' ? defaults : environment[prop];

export default config;
