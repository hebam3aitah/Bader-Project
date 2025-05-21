// app/api/logout/route.js

export async function GET() {
  return new Response(JSON.stringify({ message: 'تم تسجيل الخروج' }), {
    status: 200,
    headers: {
      'Set-Cookie': 'token=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict',
      'Content-Type': 'application/json',
    },
  });
}
