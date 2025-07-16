import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

// Basit mobil tespiti
function isMobile(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

// Google içerik basma örnekleri
const mobileContent = `
  <!DOCTYPE html>
  <html>
    <head><title>Mobil Bonus</title></head>
    <body><h1>Mobil kullanıcıya özel bonus sayfası</h1></body>
  </html>
`;

const desktopContent = `
  <!DOCTYPE html>
  <html>
    <head><title>Desktop Bonus</title></head>
    <body><h1>Masaüstü kullanıcıya özel bonus sayfası</h1></body>
  </html>
`;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const referer = request.headers.get('referer') || '';
    const userAgent = request.headers.get('user-agent') || '';

    const fromGoogle = referer.includes('google.');
    const mobile = isMobile(userAgent);

    // Google'dan gelen kullanıcıya özel içerik
    if (fromGoogle && mobile) {
      return new Response(mobileContent, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (fromGoogle && !mobile) {
      return new Response(desktopContent, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Diğer herkese React Router app'ini çalıştır
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  }
} satisfies ExportedHandler<Env>;
