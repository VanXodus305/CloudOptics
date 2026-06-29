import { connectDB } from "./mongodb";

export async function sendInvitationEmail({ to, role }) {
  const loginUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const brevoApiKey = process.env.BREVO_API_KEY;

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F9F7F7; padding: 40px; color: #111844; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(121, 44, 162, 0.05); border: 1px solid #EAEAEA;">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #111844 0%, #792CA2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">CloudOptics</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.85; font-weight: 500;">Cloud Cost Optimization Vault</p>
        </div>
        
        <!-- Body Content -->
        <div style="padding: 40px; text-align: left;">
          <h2 style="margin-top: 0; color: #111844; font-size: 20px; font-weight: 800; letter-spacing: -0.3px;">You've Been Invited!</h2>
          <p style="color: #6B7280; font-size: 15px; line-height: 1.6; font-weight: 500;">
            You have been granted access to the CloudOptics platform with the role of <strong style="color: #792CA2;">${role}</strong>. 
            You can now sign in using your Google account associated with this email address.
          </p>
          
          <div style="margin: 35px 0; text-align: center;">
            <a href="${loginUrl}" style="background-color: #792CA2; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 14px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px rgba(121, 44, 162, 0.25); transition: all 0.3s ease;">
              Access CloudOptics Vault
            </a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #EAEAEA; margin: 30px 0;" />
          
          <p style="color: #9CA3AF; font-size: 12px; line-height: 1.6; font-weight: 500;">
            If you did not expect this invitation, you can safely ignore this email. 
            This invitation was initiated by an administrator on behalf of the CloudOptics organization.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 24px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #F3F4F6; font-weight: 500;">
          &copy; ${new Date().getFullYear()} CloudOptics. All rights reserved.
        </div>
      </div>
    </div>
  `;

  if (!brevoApiKey || brevoApiKey === "your-brevo-api-key-here" || brevoApiKey.startsWith("your-")) {
    console.log("=== BREVO SMTP: SIMULATED EMAIL INVITATION ===");
    console.log(`To: ${to}`);
    console.log(`Role: ${role}`);
    console.log(`Login URL: ${loginUrl}`);
    console.log("==============================================");
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "CloudOptics",
          email: "shrestharoy140@gmail.com",
        },
        to: [
          {
            email: to,
          },
        ],
        subject: "Invitation to join CloudOptics",
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo API returned error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Invitation email successfully sent via Brevo:", data.messageId || data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    throw error;
  }
}
