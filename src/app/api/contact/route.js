
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ContactMessage from "@/models/ContactMessage";

export async function POST(request) {
  const body = await request.json();

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json(
      { success: false, error: "الاسم والبريد والرسالة مطلوبة." },
      { status: 400 }
    );
  }

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  try {
    const newMessage = new ContactMessage(body);
    await newMessage.save();
    return NextResponse.json(
      { success: true, message: "تم إرسال الرسالة بنجاح!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
