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
  })],
  prefetch: {
    prefetchAll: true
  },
  vite: {
    ssr: {
      noExternal: 'react-apexcharts'
    },
    build: {
      noExternal: 'react-apexcharts'
    }
  }, 
  output: "server",
  adapter: cloudflare()
});
