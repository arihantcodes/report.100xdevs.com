import { NextResponse } from 'next/server';
import { Twilio } from 'twilio';
import { v2 as cloudinary } from 'cloudinary';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = new Twilio(accountSid, authToken);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { fileName, fileContent } = await req.json();

    if (!fileName || !fileContent) {
      return NextResponse.json({ error: 'File name and content are required' }, { status: 400 });
    }

    // Create a promise to handle the file upload stream
    const uploadToCloudinary = new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', public_id: fileName },
        (error, result) => {
          if (error) {
            return reject(new Error(`Cloudinary upload failed: ${error.message}`));
          }
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Failed to get the secure URL from Cloudinary.'));
          }
        }
      );

      // Write the file content to the stream
      uploadStream.end(Buffer.from(fileContent));
    });

    // Wait for the upload to complete and get the file URL
    const fileUrl = await uploadToCloudinary;


    const message = await client.messages.create({
      body: `Here is the approved reports CSV file: ${fileUrl}`,
      from: 'whatsapp:+14155238886',
        to: 'whatsapp:+919516677164' // Replace with your phone number
    });

    console.log('Message sent successfully:', message.sid);

    return NextResponse.json({ success: 'File uploaded and message sent successfully', fileUrl });
  } catch (error) {
    console.error('Error processing request:', error);

    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
