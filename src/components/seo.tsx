import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export function SEO({
  title = "Image Tools - Free Online Image Converter, Resizer & Editor",
  description = "Professional-grade image processing tools that run entirely in your browser. Convert, resize, crop, rotate, and enhance images with complete privacy. No uploads, 100% free.",
  keywords = "image converter, image resizer, image editor, online image tools, convert images, resize images, crop images, browser-based image processing, free image tools, privacy-focused image editor",
  ogImage = "https://image-utilities.netlify.app/og-image.png",
  canonicalUrl,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (
      selector: string,
      content: string,
      attribute: "name" | "property" = "name",
    ) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(
          attribute,
          selector.replace(/meta\[.*?=["']|["']\]/g, ""),
        );
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Primary meta tags
    updateMetaTag('meta[name="title"]', title);
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);

    // Open Graph
    updateMetaTag('meta[property="og:title"]', title, "property");
    updateMetaTag('meta[property="og:description"]', description, "property");
    updateMetaTag('meta[property="og:image"]', ogImage, "property");
    if (canonicalUrl) {
      updateMetaTag('meta[property="og:url"]', canonicalUrl, "property");
    }

    // Twitter
    updateMetaTag('meta[property="twitter:title"]', title, "property");
    updateMetaTag(
      'meta[property="twitter:description"]',
      description,
      "property",
    );
    updateMetaTag('meta[property="twitter:image"]', ogImage, "property");
    if (canonicalUrl) {
      updateMetaTag('meta[property="twitter:url"]', canonicalUrl, "property");
    }

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrl);
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, ogImage, canonicalUrl, structuredData]);

  return null;
}

// Predefined structured data schemas
export const createWebApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Image Tools",
  description:
    "Professional-grade image processing tools that run entirely in your browser",
  url: "https://image-utilities.netlify.app",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Image Format Conversion",
    "Image Resizing",
    "Image Cropping",
    "Image Rotation",
    "Image Filters",
    "Browser-based Processing",
    "Privacy-focused",
  ],
  browserRequirements: "Requires JavaScript. Requires HTML5.",
});

export const createSoftwareApplicationSchema = (
  toolName: string,
  description: string,
) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: toolName,
  description: description,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  browserRequirements: "Requires JavaScript. Requires HTML5.",
});

export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
