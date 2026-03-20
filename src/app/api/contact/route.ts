import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
        }

        if (process.env.RESEND_API_KEY.startsWith('re_123')) {
            console.log('Dummy Resend API key detected. Skipping real email send for testing.');
            return NextResponse.json({ success: true, dummy: true });
        }

        const { name, email, message, subject } = body;

        const { data, error } = await resend.emails.send({
            from: 'Fusion Contact <order@officialfusionshroombars.com>', 
            to: ['order@officialfusionshroombars.com'], 
            subject: subject || `New Contact Form Submission from ${name}`,
            replyTo: email,
            html: `
                <div style="background-color: #0c0c0c; color: #ffffff; font-family: 'Inter', Arial, sans-serif; padding: 40px; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; border: 1px solid #333; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                        <div style="background: linear-gradient(135deg, #a855f7 0%, #6b21a8 100%); padding: 30px; text-align: center;">
                            <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 3px; font-weight: 800; color: #ffffff;">NEW INQUIRY</h1>
                        </div>
                        <div style="padding: 30px; background-color: #141414;">
                            <div style="margin-bottom: 25px; border-bottom: 1px solid #222; padding-bottom: 15px;">
                                <label style="display: block; color: #a855f7; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 8px;">Sender Details</label>
                                <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 600;">${name}</p>
                                <p style="margin: 5px 0 0; color: #a855f7; font-size: 14px;">${email}</p>
                            </div>
                            <div style="margin-bottom: 25px;">
                                <label style="display: block; color: #a855f7; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 8px;">Subject</label>
                                <p style="margin: 0; font-size: 16px; color: #ffffff;">${subject || 'General Inquiry'}</p>
                            </div>
                            <div style="margin-bottom: 30px;">
                                <label style="display: block; color: #a855f7; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 8px;">Message Content</label>
                                <div style="background: #0c0c0c; padding: 25px; border-radius: 10px; border: 1px solid #222; color: #cccccc; white-space: pre-wrap; font-size: 15px; line-height: 1.8;">
                                    ${message}
                                </div>
                            </div>
                            <div style="text-align: center;">
                                <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(to right, #a855f7, #6b21a8); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 50px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);">Reply to Customer</a>
                            </div>
                        </div>
                        <div style="padding: 20px; text-align: center; background-color: #0c0c0c; color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
                            Official Fusion Shroom Bar • Admin Portal
                        </div>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: (error as any).message || 'Failed to send email' }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Contact form catch error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
