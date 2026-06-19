import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://thecinderproject.qd.je',
  integrations: [
    starlight({
      title: 'The Cinder Project',
    }),
  ],
});