import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  site: 'https://example.com',
  server: {
    host: '::',
    port: 5100,
  },
  vite: {
    server: {
      allowedHosts: ['ssh.txyyfj.top'],
    },
  },
});
