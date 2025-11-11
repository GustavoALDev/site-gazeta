export interface Category {
  id?: number;
  name: string;
  description: string;
  slug: string;
  color: string; // HEX color format (#RRGGBB)
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Utility type for HEX color validation
export type HexColor = `#${string}`;

// Utility function to validate HEX color
export function isValidHexColor(color: string): color is HexColor {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Utility function to generate random HEX color
export function generateRandomHexColor(): HexColor {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color as HexColor;
}