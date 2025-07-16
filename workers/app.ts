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

// Daha sıkı mobil tespiti
function isMobile(userAgent: string): boolean {
  return /iPhone|iPad|Android/i.test(userAgent);
}

// Mobil ve desktop içerikleri
const mobileContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Mobil Bonus Sayfası</title>
    </head>
    <body>
      <h1>Google'dan gelen mobil kullanıcı için içerik</h1>
    </body>
  </html>
`;

const desktopContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Desktop Bonus Sayfası</title>
    </head>
    <body>
      <h1>Google'dan gelen masaüstü kullanıcı için içerik</h1>
    </body>
  </html>
`;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const referer = request.headers.get('referer') || '';
    const userAgent = request.headers.get('user-agent') || '';

    const fromGoogle = referer.includes('google.');
    const mobile = isMobile(userAgent);

    // LOG (istersen geçici kullanabilirsin)
    // console.log("Referer:", referer);
    // console.log("User-Agent:", userAgent);
    // console.log("Mobile mi?:", mobile);

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

    // Diğer herkes: normal React Router app
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  }
} satisfies ExportedHandler<Env>;
