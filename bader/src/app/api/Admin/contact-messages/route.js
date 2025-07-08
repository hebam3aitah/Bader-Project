
import { NextResponse } from "next/server";
import ContactMessage from "@/models/ContactMessage";
import connectDB from "@/lib/db";
import { sendReplyEmail } from "@/lib/email";

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactMessage.countDocuments()
    ]);

    return NextResponse.json({
      messages,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const newMessage = new ContactMessage(body);
    await newMessage.save();
    return NextResponse.json({ success: true, message: "Message saved!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { replied, replyText } = await req.json();

    const message = await ContactMessage.findById(params.id);
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    message.replied = replied ?? true;
    message.read = true;
    await message.save();

    if (replyText) {
      await sendReplyEmail({
        to: message.email,
        subject: 'رد على رسالتك',
        html: `<p>مرحبًا ${message.name}،</p><p>${replyText}</p><p>مع تحياتنا، فريق بادر.</p>`,
        text: `مرحبًا ${message.name},\n\n${replyText}\n\nمع تحياتنا، فريق بادر.`,
      });
      
    }


    return NextResponse.json({ success: true, message: 'Updated and replied if provided.' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
