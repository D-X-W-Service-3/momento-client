import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['icons/favicon-32.png', 'icons/favicon-16.png'],
  manifest: {
    name: 'Momento',
    short_name: 'Momento',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    description: 'Momento',
    // TODO: 디자인 확정 후 public/icons 에 실제 아이콘을 넣고 경로를 맞춰주세요.
    icons: [
      { src: '/icons/192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'images',
          expiration: { maxEntries: 100 },
        },
      },
    ],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
  },
  // 개발 중에는 SW 비활성화 (캐시로 인한 혼란 방지)
  devOptions: { enabled: false },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // `import Logo from './logo.svg?react'` 형태로 SVG를 컴포넌트로 사용
    svgr({
      svgrOptions: {
        replaceAttrValues: {
          '#000': 'currentColor',
          '#000000': 'currentColor',
          black: 'currentColor',
        },
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                  convertColors: { currentColor: /^#000(000)?$/i },
                },
              },
            },
            'removeDimensions',
          ],
        },
      },
      include: '**/*.svg?react',
    }),
    VitePWA(pwaOptions),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // 로컬 개발 시 백엔드로 프록시. 배포는 vercel.json 의 rewrites 를 사용.
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //   },
    // },
  },
});
