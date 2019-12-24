export const required = value => ((value || String(value) === '0') ? undefined : 'This field is required');
