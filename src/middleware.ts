import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/helpers/jose";
import { refresh } from "./lib/helpers/auth";

const publicRoute = ["/", "/forgot-password"];
const roleAccess: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};
const allowedSubPaths = ["dashboard", "absence"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("acctkn")?.value;
  const refresh_token = req.cookies.get("rftkn")?.value;

  let payload = token ? await verifyToken(token) : null;

  // 1. Logic Refresh Token (Jika access token mati tapi refresh token ada)
  if (!payload && refresh_token) {
    const data = await refresh(refresh_token);
    if (data?.data?.accessToken) {
      payload = await verifyToken(data.data.accessToken);
    }
  }

  // 2. Jika TIDAK LOGIN
  if (!payload) {
    // Biarkan jika akses halaman publik
    if (publicRoute.includes(pathname)) return NextResponse.next();

    // Selain itu, tendang ke login dan bersihkan cookies
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("acctkn");
    response.cookies.delete("rftkn");
    return response;
  }

  // 3. Jika SUDAH LOGIN & mencoba akses halaman login ("/")
  if (publicRoute.includes(pathname)) {
    // Arahkan ke dashboard masing-masing sesuai role
    const dashboard = `${roleAccess[payload.role as string] || ""}/dashboard`;
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  // 4. Validasi Role & Path (Logic "Tendang" kamu)
  const pathParts = pathname.split("/"); // ["", "admin", "dashboard"]
  const currentFolder = `/${pathParts[1]}`;

  // Cari tahu apakah folder ini termasuk folder ber-role (admin/teacher/student)
  const folderRole = Object.keys(roleAccess).find(
    (role) => roleAccess[role] === currentFolder,
  );

  if (folderRole) {
    // A. Cek apakah role user cocok dengan folder yang diakses
    if (payload.role !== folderRole) {
      const targetDashboard = `${roleAccess[payload.role as string]}/dashboard`;
      return NextResponse.redirect(new URL(targetDashboard, req.url));
    }

    // B. Cek sub-path (hanya boleh dashboard atau absence)
    const subPath = pathParts[2];
    if (!allowedSubPaths.includes(subPath)) {
      return NextResponse.redirect(
        new URL(`${currentFolder}/dashboard`, req.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
