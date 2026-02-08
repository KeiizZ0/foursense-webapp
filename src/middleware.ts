import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/helpers/jose";
import { refresh } from "./lib/helpers/auth";

const publicRoute = ["/", "/forgot-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("acctkn")?.value;
  const refresh_token = req.cookies.get("rftkn")?.value;
  var payload = token ? await verifyToken(token) : null;

  if (!payload && refresh_token) {
    const data = await refresh(refresh_token);
    if (data?.data?.accessToken) {
      payload = token ? await verifyToken(data.data.accessToken) : null;
    } else {
      const loginUrl = new URL("/", req.url);
      const response = NextResponse.redirect(loginUrl);

      response.cookies.delete("acctkn");
      return response;
    }
  }

  // --- KONDISI B: Tidak ada token & akses halaman rahasia ---
  if (!payload && !publicRoute.includes(pathname)) {
    const loginUrl = new URL("/", req.url);
    const response = NextResponse.redirect(loginUrl);

    // Hapus cookie agar bersih (Return yang baik adalah yang membersihkan sampah)
    response.cookies.delete("acctkn");
    return response;
  }

  // --- KONDISI C: Sudah login & akses halaman "/" ---
  if (payload && pathname === "/") {
    var target = "";
    if (payload.role === "admin") target = "/admin/dashboard";
    else if (payload.role === "teacher") target = "/teacher/dashboard";
    else if (payload.role === "student") target = "/student/dashboard";
    else target = "/unregister";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // --- KONDISI D: Role tidak cocok ---
  if (
    (payload && pathname.startsWith("/admin") && payload.role !== "admin") ||
    (payload &&
      pathname.startsWith("/teacher") &&
      payload.role !== "teacher") ||
    (payload &&
      pathname.startsWith("/student") &&
      payload.role !== "student") ||
    (payload &&
      pathname.startsWith("/unregister") &&
      payload.role !== "unregistered")
  ) {
    // Kembalikan ke asal atau halaman aman
    return NextResponse.redirect(new URL("/", req.url));
  }

  // --- KONDISI D: Semuanya Oke ---
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
