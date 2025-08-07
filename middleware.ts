import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const { pathname } = req.nextUrl;
      // ✅ Allow public routes without auth
      if (
        pathname === "/" ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname.startsWith("/api/video")  // ✅ Public API allowed (you handle auth inside route.ts)
      ) {
        return true;
      }
      // ✅ Require login for dashboard & upload
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard", "/upload", "/api/video"],
};



