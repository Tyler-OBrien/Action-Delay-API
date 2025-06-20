import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
// https://astro.build/config
export default defineConfig({
  integrations: [preact({
    compat: true
  }), tailwind({
    applyBaseStyles: true,
  }), 
],
  prefetch: {
    prefetchAll: true
  },
  vite: {
    ssr: {
      noExternal: 'plotly.js-basic-dist-min'
    },
    build: {
      noExternal: 'plotly.js-basic-dist-min'
    }
  }, 
  output: "server",
  adapter: cloudflare()
});
