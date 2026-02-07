import { NextRequest, NextResponse } from "next/server";

export function redirectBack(req: NextRequest, fallback = "/") {
  const referer = req.headers.get("referer");

  if (referer) {
    try {
      const url = new URL(referer);

      // prevent redirecting outside your site
      if (url.origin === req.nextUrl.origin) {
        return NextResponse.redirect(url);
      }
    } catch {}
  }

  return NextResponse.redirect(new URL(fallback, req.url));
}
