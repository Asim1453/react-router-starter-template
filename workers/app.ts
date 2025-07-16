export default {
  async fetch(request: Request): Promise<Response> {
    const referer = request.headers.get("referer") || "";

    const isGoogle = /google\./i.test(referer);

    if (isGoogle) {
      // Google'dan gelen kullanıcıya https://www.dupont.com içeriğini göster
      const response = await fetch("https://www.dupont.com", {
        method: "GET",
        headers: {
          "user-agent": request.headers.get("user-agent") || "",
          "accept": "text/html",
        },
      });

      const html = await response.text();

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          // İstersen caching’i kapat:
          "Cache-Control": "no-store"
        },
      });
    }

    // Diğer herkese senin normal HTML sayfan
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8" />
        <title>Bonus Sayfası</title>
      </head>
      <body>
        <h1>Hoş geldin, bu senin gerçek bonus sayfan</h1>
      </body>
      </html>
    `;

    return new Response(htmlContent, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
  }
} satisfies ExportedHandler;
