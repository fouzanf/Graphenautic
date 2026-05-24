import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "uNA15Qc9E9403+RPyj/RmRbEBWpKfyklNTItJA56Ssc=",
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - login
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - landing page (/)
     * - landing
     */
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|$|landing).*)",
  ],
};
