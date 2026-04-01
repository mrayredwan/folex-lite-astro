import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import remarkParseContent from "./src/lib/utils/remarkParseContent.ts";
import fontsJson from "./src/config/fonts.json";
import { generateAstroFontsConfig } from "./src/lib/utils/AstroFont.ts";
import { enabledLanguages } from "./src/lib/utils/i18nUtils.ts";
import { fileURLToPath } from "node:url";

const fonts = generateAstroFontsConfig(fontsJson);
const generatedDir = fileURLToPath(new URL("./.generated", import.meta.url));

// إعدادات ثابتة (Production safe)
const sitemapEnabled = true;
const showDefaultLangInUrl = true;
const defaultLanguage = "en";

// https://astro.build/config
export default defineConfig({
  site: "https://fintosoft.com",
  trailingSlash: "always",

  image: {
    layout: "constrained",
  },

  fonts,

  i18n: {
    locales: enabledLanguages,
    defaultLocale: defaultLanguage,
    routing: {
      prefixDefaultLocale: showDefaultLangInUrl,
    },
  },

  integrations: [
    mdx(),
    ...(sitemapEnabled ? [sitemap()] : [])
  ],

  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      ],
    ],
    remarkPlugins: [remarkParseContent],

    shikiConfig: {
      theme: "light-plus",
      wrap: false,
    },

    extendDefaultPlugins: true,
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@generated": generatedDir,
      },
    },
  },
});
