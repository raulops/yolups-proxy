// // functions/_middleware.js
// export const onRequest = async (context) => {
//   const url = new URL(context.request.url);

//   // Yalnız bu path-ları proxy et
//   if (
//     url.pathname.startsWith('/api') ||
//     url.pathname.startsWith('/weather-proxy') ||
//     url.pathname.startsWith('/media')
//   ) {
//     let targetPath = url.pathname + url.search;

//     if (url.pathname.startsWith('/api') || url.pathname.startsWith('/weather-proxy')) {
//       targetPath = targetPath.replace(/^\/(api|weather-proxy)/, '');
//     }

//     const targetUrl = 'https://yolla.site' + targetPath;

//     const modifiedRequest = new Request(targetUrl, context.request);
//     modifiedRequest.headers.set('Host', 'yolla.site');

//     return fetch(modifiedRequest);
//   }

//   // Digər hallarda normal static faylı qaytar (index.html və s.)
//   return context.next();
// };

// functions/_middleware.js

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // API path-ları proxy et (api/ ilə başlayanlar – rewrite yoxdur, çünki Django-da api/ var)
  if (pathname.startsWith('/api/')) {
    const targetUrl = 'https://yolla.site' + pathname + url.search;

    const modifiedRequest = new Request(targetUrl, context.request);
    modifiedRequest.headers.set('Host', 'yolla.site'); // changeOrigin effekti

    return fetch(modifiedRequest);
  }

  // Weather-proxy üçün xüsusi rewrite (weather-proxy/ → /)
  if (pathname.startsWith('/weather-proxy/')) {
    const rewrittenPath = pathname.replace(/^\/weather-proxy/, '') || '/';
    const targetUrl = 'https://yolla.site' + rewrittenPath + url.search;

    const modifiedRequest = new Request(targetUrl, context.request);
    modifiedRequest.headers.set('Host', 'yolla.site');

    return fetch(modifiedRequest);
  }

  // Media faylları üçün proxy (əgər media/ ilə başlasa – sənin orijinal kodunda var idi)
  if (pathname.startsWith('/media/')) {
    const targetUrl = 'https://yolla.site' + pathname + url.search;

    const modifiedRequest = new Request(targetUrl, context.request);
    modifiedRequest.headers.set('Host', 'yolla.site');

    return fetch(modifiedRequest);
  }

  // Digər hallarda normal static faylı qaytar (index.html və s.)
  return context.next();
}