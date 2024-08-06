import { NextRequest, NextResponse } from "next/server";
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json();
   

    if (!to || !message) {
      return NextResponse.json({ success: false, message: 'Missing "to" or "message" field' }, { status: 400 });
    }

    const twilioMessage = await client.messages.create({
      body: message,
      from: process.env.NEXT_PUBLIC_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
    });

    return NextResponse.json({ success: true, data: twilioMessage });
  } catch (error) {
    console.error("Error in backend:", error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
