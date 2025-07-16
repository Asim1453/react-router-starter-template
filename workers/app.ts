export default {
  async fetch(request: Request): Promise<Response> {
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);

    // Referer varsa veya masaüstü cihazdan geliyorsa → yönlendir
    if (!isMobile || referer !== "") {
      return Response.redirect("https://google.com", 302); // buraya istediğin URL
    }

    // Mobil + direkt gelen kullanıcıya HTML içeriği göster
    const mobileHTML = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Mobil Bonus Sayfası</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { background:#111; color:white; font-family:sans-serif; padding:40px; text-align:center; }
        </style>
      </head>
      <body>
        <h1>Mobil Bonus Sayfası</h1>
        <p>Hoş geldin mobil kullanıcı!</p>
      </body>
      </html>
    `;

    return new Response(mobileHTML, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
} satisfies ExportedHandler;
