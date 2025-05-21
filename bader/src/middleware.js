import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// 📌 Rate Limiting Map (in-memory)
const rateLimitMap = new Map();

function handleRateLimit(req) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();

  const userData = rateLimitMap.get(ip) || { count: 0, timestamp: now };

  if (now - userData.timestamp < 60000) {
    if (userData.count >= 5) {
      const retryAfter = Math.ceil((60000 - (now - userData.timestamp)) / 1000);
      return new NextResponse(
        JSON.stringify({
          message: `عدد كبير من المحاولات، حاول بعد ${retryAfter} ثانية.`,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    } else {
      userData.count += 1;
    }
  } else {
    userData.count = 1;
    userData.timestamp = now;
  }

  rateLimitMap.set(ip, userData);
  return null;
}

// ✅ JWT verify function using 'jose'
async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("❌ Failed to verify token:", err.message);
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  console.log("✅ Middleware triggered for:", pathname);

  // ✅ Rate limiting للحماية من الهجمات
  if (
    pathname.startsWith("/api/auth/forgot-password") ||
    pathname.startsWith("/api/auth/verify-reset-otp") ||
    pathname.startsWith("/api/auth/reset-password")
  ) {
    const rateResponse = handleRateLimit(req);
    if (rateResponse) return rateResponse;
  }

  // ✅ حماية صفحة /dashboard بالكامل: فقط للأدمن
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("token")?.value;
    console.log("📦 Received token:", token);

    if (!token) {
      console.log("🚫 لا يوجد توكن");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    const decoded = await verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      console.log("🚫 المستخدم ليس أدمن");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    console.log("🎯 تم التحقق من الصلاحية، الدور:", decoded.role);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/auth/forgot-password",
    "/api/auth/verify-reset-otp",
    "/api/auth/reset-password",
  ],
};

