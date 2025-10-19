/**
 * CMS Utilities Library
 * Comprehensive helper functions for content management system
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ==================== UTILITY FUNCTIONS ====================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== SLUG MANAGEMENT ====================

/**
 * Generate URL-safe slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Validate slug uniqueness
 */
export async function validateSlug(
  slug: string,
  existingSlugs: string[],
): Promise<{ valid: boolean; suggestion?: string }> {
  if (!existingSlugs.includes(slug)) {
    return { valid: true };
  }

  // Generate suggestion
  let counter = 1;
  let suggestion = `${slug}-${counter}`;
  while (existingSlugs.includes(suggestion)) {
    counter++;
    suggestion = `${slug}-${counter}`;
  }

  return { valid: false, suggestion };
}

// ==================== CONTENT PROCESSING ====================

/**
 * Sanitize HTML content
 */
export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization
  // In production, use DOMPurify or similar library
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
}

/**
 * Generate excerpt from HTML content
 */
export function generateExcerpt(
  html: string,
  wordLimit: number = 30,
): string {
  // Strip HTML tags
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  // Split into words
  const words = text.split(" ");

  if (words.length <= wordLimit) {
    return text;
  }

  return words.slice(0, wordLimit).join(" ") + "...";
}

/**
 * Calculate reading time
 */
export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Extract search text from HTML
 */
export function extractSearchText(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

// ==================== IMAGE OPTIMIZATION ====================

/**
 * Generate responsive image srcset
 */
export function generateImageSrcSet(
  imageUrl: string,
  sizes: number[] = [320, 640, 1024, 1920],
): string {
  return sizes.map((size) => `${imageUrl}?w=${size} ${size}w`).join(", ");
}

/**
 * Generate lazy loading attributes
 */
export function getLazyLoadingAttrs() {
  return {
    loading: "lazy" as const,
    decoding: "async" as const,
  };
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  width: number,
  height: number,
  maxWidth: number = 2000,
  maxHeight: number = 2000,
): { valid: boolean; error?: string } {
  if (width > maxWidth) {
    return { valid: false, error: `Width exceeds ${maxWidth}px` };
  }
  if (height > maxHeight) {
    return { valid: false, error: `Height exceeds ${maxHeight}px` };
  }
  return { valid: true };
}

// ==================== SEO HELPERS ====================

/**
 * Generate meta tags
 */
export function generateMetaTags(params: {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  image?: string;
}) {
  return {
    title: params.title,
    description: params.description,
    keywords: params.keywords,
    canonical: params.canonical,
    openGraph: {
      title: params.title,
      description: params.description,
      image: params.image,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: params.title,
      description: params.description,
      image: params.image,
    },
  };
}

/**
 * Generate Open Graph tags
 */
export function generateOGTags(params: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
}) {
  return {
    "og:title": params.title,
    "og:description": params.description,
    "og:image": params.image || "",
    "og:url": params.url || "",
    "og:type": params.type || "website",
    "og:locale": params.locale || "en_US",
  };
}

/**
 * Generate Twitter Card tags
 */
export function generateTwitterCardTags(params: {
  card: "summary" | "summary_large_image" | "app" | "player";
  title: string;
  description: string;
  image?: string;
  creator?: string;
}) {
  return {
    "twitter:card": params.card,
    "twitter:title": params.title,
    "twitter:description": params.description,
    "twitter:image": params.image || "",
    "twitter:creator": params.creator || "",
  };
}

/**
 * Generate JSON-LD schema
 */
export function generateJSONLD(
  type: "Organization" | "Website" | "Article" | "Product",
  data: Record<string, any>,
) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
  };

  return JSON.stringify({ ...baseSchema, ...data });
}

// ==================== CONTENT VALIDATION ====================

/**
 * Validate required fields
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[],
): { valid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter((field) => !data[field]);

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Validate content length
 */
export function validateContentLength(
  content: string,
  minLength: number = 10,
  maxLength: number = 10000,
): { valid: boolean; error?: string } {
  if (content.length < minLength) {
    return { valid: false, error: `Content too short (min ${minLength} chars)` };
  }
  if (content.length > maxLength) {
    return { valid: false, error: `Content too long (max ${maxLength} chars)` };
  }
  return { valid: true };
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==================== MENU HELPERS ====================

/**
 * Build menu tree from flat array
 */
export function buildMenuTree(items: any[]): any[] {
  const tree: any[] = [];
  const map: Record<string, any> = {};

  // Create map
  items.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  // Build tree
  items.forEach((item) => {
    if (item.parentId) {
      if (map[item.parentId]) {
        map[item.parentId].children.push(map[item.id]);
      }
    } else {
      tree.push(map[item.id]);
    }
  });

  return tree;
}

/**
 * Detect active menu item
 */
export function isActiveMenuItem(
  itemPath: string,
  currentPath: string,
): boolean {
  if (itemPath === currentPath) return true;

  // Check if current path starts with item path (for nested routes)
  if (currentPath.startsWith(itemPath + "/")) return true;

  return false;
}

/**
 * Filter menu items by permission
 */
export function filterMenuByPermission(
  items: any[],
  userPermissions: string[],
): any[] {
  return items.filter((item) => {
    if (!item.requiredPermission) return true;
    return userPermissions.includes(item.requiredPermission);
  });
}

// ==================== BLOCK HELPERS ====================

/**
 * Validate block content
 */
export function validateBlockContent(
  type: string,
  content: any,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (type) {
    case "TEXT":
      if (!content.text) errors.push("Text content is required");
      break;

    case "IMAGE":
      if (!content.url) errors.push("Image URL is required");
      if (!content.alt) errors.push("Image alt text is required");
      break;

    case "HERO":
      if (!content.title) errors.push("Hero title is required");
      break;

    case "VIDEO":
      if (!content.url) errors.push("Video URL is required");
      if (!validateURL(content.url)) errors.push("Invalid video URL");
      break;

    case "CTA":
      if (!content.text) errors.push("CTA text is required");
      if (!content.url) errors.push("CTA URL is required");
      break;

    default:
      break;
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Reorder blocks
 */
export function reorderBlocks(
  blocks: any[],
  fromIndex: number,
  toIndex: number,
): any[] {
  const result = Array.from(blocks);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);

  // Update positions
  return result.map((block, index) => ({
    ...block,
    position: index,
  }));
}

// ==================== THEME HELPERS ====================

/**
 * Generate CSS custom properties from theme config
 */
export function generateCSSProperties(themeConfig: Record<string, any>): string {
  let css = ":root {\n";

  Object.entries(themeConfig).forEach(([key, value]) => {
    if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        css += `  --${key}-${subKey}: ${subValue};\n`;
      });
    } else {
      css += `  --${key}: ${value};\n`;
    }
  });

  css += "}";
  return css;
}

/**
 * Parse theme config from CSS properties
 */
export function parseThemeConfig(css: string): Record<string, any> {
  const config: Record<string, any> = {};
  const regex = /--([^:]+):\s*([^;]+);/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    const [, key, value] = match;
    const parts = key.split("-");

    if (parts.length === 1) {
      config[parts[0]] = value.trim();
    } else {
      const [category, property] = parts;
      if (!config[category]) config[category] = {};
      config[category][property] = value.trim();
    }
  }

  return config;
}

// ==================== EXPORT ALL ====================

export const cmsUtils = {
  generateSlug,
  validateSlug,
  sanitizeHTML,
  generateExcerpt,
  calculateReadingTime,
  extractSearchText,
  generateImageSrcSet,
  getLazyLoadingAttrs,
  validateImageDimensions,
  generateMetaTags,
  generateOGTags,
  generateTwitterCardTags,
  generateJSONLD,
  validateRequiredFields,
  validateContentLength,
  validateURL,
  validateEmail,
  buildMenuTree,
  isActiveMenuItem,
  filterMenuByPermission,
  validateBlockContent,
  reorderBlocks,
  generateCSSProperties,
  parseThemeConfig,
};
