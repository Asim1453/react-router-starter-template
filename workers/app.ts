import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

// Daha sıkı mobil tespiti
function isMobile(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return ua.includes("iphone") || ua.includes("android") || ua.includes("ipad") || ua.includes("mobile");
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const referer = request.headers.get("referer") || "";
    const userAgent = request.headers.get("user-agent") || "";

    const fromGoogle = referer.includes("google.");
    const mobile = isMobile(userAgent);

    const modifiedRequest = new Request(request, {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        "x-show-bonus": fromGoogle && mobile ? "true" : "false",
      }),
    });

    return createRequestHandler(
      () => import("virtual:react-router/server-build"),
      import.meta.env.MODE
    )(modifiedRequest, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
