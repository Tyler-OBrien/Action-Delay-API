import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import deno from '@deno/astro-adapter';

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
  // Bunny's Edge Scripting runtime (Deno-based) does not provide `node:child_process`,
  // which Astro's default `sharp` image service imports (libvips arch detection via spawnSync).
  // Use the no-op/passthrough image service so sharp is never bundled into the SSR output.
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  vite: {
    ssr: {
      noExternal: ['plotly.js-basic-dist-min', 'plotly.js-geo-dist-min']
    },
    build: {
      noExternal: ['plotly.js-basic-dist-min', 'plotly.js-geo-dist-min']
    }
  }, 
  output: "server",
    adapter: deno(),
});
