import { Resend } from 'resend';
import { getPortfolioUrl, getLiveEditUrl } from './urls';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendWelcomeEmail(email: string, username: string, portfolioId: string) {
  const publicUrl = getPortfolioUrl(username);
  const editUrl = getLiveEditUrl(portfolioId);

  // If no API key is provided, just simulate the email send
  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY is not set. Simulating welcome email send:');
    console.log(`To: ${email}`);
    console.log(`Public URL: ${publicUrl}`);
    console.log(`Edit URL: ${editUrl}`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      // Use Resend's default testing domain so you can send test emails to yourself immediately
      from: 'CVtoWeb <cvtoweb@uxderrick.com>',
      to: email,
      subject: '🎉 Your Portfolio is Live!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #0f172a;">Your portfolio is officially live! 🚀</h1>
          <p>Hi there,</p>
          <p>Congratulations on publishing your new portfolio! You can view it and share it with the world here:</p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
            <a href="${publicUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View My Portfolio
            </a>
            <p style="margin-top: 15px; font-size: 14px; color: #64748b;">
              Or copy this link: <a href="${publicUrl}">${publicUrl}</a>
            </p>
          </div>

          <h3 style="color: #0f172a;">Need to make changes?</h3>
          <p>You can always come back and update your portfolio at any time using your private edit link. <strong>Keep this link safe!</strong></p>
          <p>
            <a href="${editUrl}" style="background-color: #1e293b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              ✏️ Edit My Portfolio
            </a>
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Sent by CVtoWeb • Powered by AI
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API returned an error:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}
