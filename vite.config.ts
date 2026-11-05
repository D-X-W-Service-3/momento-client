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
  includeAssets: [
    'icons/favicon-16.png',
    'icons/favicon-32.png',
    'icons/apple-touch-icon.png',
  ],
  manifest: {
    id: '/',
    name: 'Momento',
    short_name: 'Momento',
    description: '소중한 순간을 타임캡슐에 담아두는 모멘토',
    lang: 'ko',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    // index.html 의 theme-color 메타와 맞춘다 (앱 기본 배경 surface-white)
    background_color: '#ffffff',
    theme_color: '#ffffff',
    // 임시 아이콘: 마스코트(login-character.png) 기반. 앱 아이콘 확정 시 교체
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
    // 앱 셸만 프리캐시. 이미지(수 MB)는 아래 런타임 캐시로 처음 볼 때 저장
    globPatterns: ['**/*.{js,css,html,ico,woff2}', 'icons/*.png'],
    // SPA 라우팅: 오프라인/재방문 시 모든 내비게이션을 index.html 로
    navigateFallback: '/index.html',
    // 개발 프록시 경로(/api)는 SPA 폴백 대상에서 제외
    navigateFallbackDenylist: [/^\/api\//],
    cleanupOutdatedCaches: true,
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
    // 로컬 개발은 동일 출처의 /api 를 HTTPS 백엔드로 전달한다.
    proxy: {
      '/api': {
        target: 'https://api.getmomento.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'));
        },
      },
    },
  },
});
