if('serviceWorker' in navigator) navigator.serviceWorker.register('/rate-calc/dev-sw.js?dev-sw', { scope: '/rate-calc/', type: 'classic' })