import { NextResponse, NextRequest } from 'next/server';

// Các route yêu cầu đã đăng nhập mới được truy cập
const protectedRoutes = ['/dashboard', '/checkout', '/account', '/order-confirmation'];

// Các route dành riêng cho admin
const adminRoutes = ['/admin'];

// Các route dành cho khách (chưa đăng nhập mới vào được)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // 1. Kiểm tra nếu truy cập route admin mà không phải admin
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Kiểm tra nếu truy cập route cần bảo vệ mà chưa đăng nhập
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !userId) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 3. Kiểm tra nếu đã đăng nhập mà cố vào login/register
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && userId) {
    // Nếu là admin thì vào dashboard admin, nếu là user thì vào dashboard user
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Chỉ chạy middleware trên những route nhất định để tối ưu performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
