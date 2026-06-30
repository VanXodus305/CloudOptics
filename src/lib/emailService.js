import { connectDB } from "./mongodb";

export async function sendInvitationEmail({ to, role }) {
  const loginUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const brevoApiKey = process.env.BREVO_API_KEY;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media only screen and (max-width: 600px) {
            .outer-wrapper {
              padding: 20px 10px !important;
            }
            .email-container {
              border-radius: 20px !important;
            }
            .header-banner {
              padding: 45px 20px !important;
            }
            .header-title {
              font-size: 26px !important;
            }
            .body-content {
              padding: 30px 20px !important;
            }
            .cta-button {
              padding: 14px 28px !important;
              font-size: 14px !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FFFFFF; -webkit-text-size-adjust: 100%;">
        <div class="outer-wrapper" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFFFFF; padding: 50px 20px; color: #1F2937; margin: 0;">
          <div class="email-container" style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 28px; overflow: hidden; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05); border: 1px solid #E5E7EB;">
            
            <!-- Header Banner -->
            <div class="header-banner" style="background-color: #FFFFFF; padding: 45px 40px; text-align: center; color: #1F2937; border-bottom: 1px solid #ECE9F9;">
              <h1 class="header-title" style="margin: 0; font-size: 32px; font-weight: 850; letter-spacing: -1px; color: #792CA2;">CloudOptics</h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.9; font-weight: 650; text-transform: uppercase; letter-spacing: 2px; color: #9A4DCC;">Cloud Intelligence Vault</p>
            </div>
            
            <!-- Body Content -->
            <div class="body-content" style="padding: 45px; text-align: center;">
              <h2 style="margin-top: 0; color: #111827; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3; margin-bottom: 20px;">Your Cloud Portal is Ready</h2>
              
              <p style="color: #4B5563; font-size: 15px; line-height: 1.6; font-weight: 500; margin-bottom: 30px; text-align: center; max-width: 440px; margin-left: auto; margin-right: auto;">
                You have been granted access to the CloudOptics cost optimization platform. Explore metrics, track idle resources, and trigger mitigation playbooks.
              </p>
              
              <!-- Role Badge -->
              <div style="margin-bottom: 35px;">
                <p style="color: #6B7280; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Assigned Identity Privilege</p>
                <span style="background-color: #F3E8FF; color: #7E22CE; padding: 8px 18px; border-radius: 99px; font-weight: 700; font-size: 13px; border: 1px solid #E9D5FF; display: inline-block; letter-spacing: 0.5px;">
                  🛡️ ${role}
                </span>
              </div>
              
              <!-- CTA Button -->
              <div style="margin: 40px 0;">
                <a href="${loginUrl}" class="cta-button" style="background-color: #792CA2; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 16px; font-weight: 750; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px rgba(121, 44, 162, 0.25); border: 1px solid #792CA2; transition: all 0.25s ease-out; letter-spacing: 0.5px;">
                  Access CloudOptics Vault ➔
                </a>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 35px 0;" />
              
              <p style="color: #6B7280; font-size: 11px; line-height: 1.6; font-weight: 500; text-align: left; max-width: 460px; margin: 0 auto;">
                <strong>Security notice:</strong> This invitation is bound to this email address. If you did not request access, you may safely ignore this message. Powered by CloudOptics automated user provisioning.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #F9FAFB; padding: 28px; text-align: center; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E5E7EB; font-weight: 600; letter-spacing: 0.5px;">
              &copy; ${new Date().getFullYear()} CLOUDOPTICS SYSTEMS &bull; SECURE CONTAINER SCAN
            </div>
          </div>
        </div>
      </body>
    </html>
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

export async function sendOtpEmail({ to, otp }) {
  const brevoApiKey = process.env.BREVO_API_KEY;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media only screen and (max-width: 600px) {
            .outer-wrapper {
              padding: 20px 10px !important;
            }
            .email-container {
              border-radius: 20px !important;
            }
            .header-banner {
              padding: 45px 20px !important;
            }
            .header-title {
              font-size: 26px !important;
            }
            .body-content {
              padding: 30px 20px !important;
            }
            .otp-box {
              padding: 16px 20px !important;
            }
            .otp-code {
              font-size: 28px !important;
              letter-spacing: 6px !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FFFFFF; -webkit-text-size-adjust: 100%;">
        <div class="outer-wrapper" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFFFFF; padding: 50px 20px; color: #1F2937; margin: 0;">
          <div class="email-container" style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 28px; overflow: hidden; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05); border: 1px solid #E5E7EB;">
            
            <!-- Header Banner -->
            <div class="header-banner" style="background-color: #FFFFFF; padding: 45px 40px; text-align: center; color: #1F2937; border-bottom: 1px solid #ECE9F9;">
              <h1 class="header-title" style="margin: 0; font-size: 32px; font-weight: 850; letter-spacing: -1px; color: #792CA2;">CloudOptics</h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.9; font-weight: 650; text-transform: uppercase; letter-spacing: 2px; color: #9A4DCC;">Security Verification Module</p>
            </div>
            
            <!-- Body Content -->
            <div class="body-content" style="padding: 45px; text-align: center;">
              <h2 style="margin-top: 0; color: #111827; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3; margin-bottom: 20px;">Email Verification Required</h2>
              
              <p style="color: #4B5563; font-size: 15px; line-height: 1.6; font-weight: 500; margin-bottom: 30px; text-align: center; max-width: 440px; margin-left: auto; margin-right: auto;">
                Please input the following One-Time Password (OTP) to authorize your verification request. This code will expire in 10 minutes.
              </p>
              
              <!-- OTP Box -->
              <div class="otp-box" style="margin: 35px 0; background-color: #FFFFFF; padding: 20px 40px; border-radius: 16px; border: 2px solid #E5E7EB; display: inline-block;">
                <span class="otp-code" style="font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #111827; display: inline-block;">${otp}</span>
              </div>
    
              <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 35px 0;" />
              
              <p style="color: #6B7280; font-size: 11px; line-height: 1.6; font-weight: 500; text-align: center; max-width: 400px; margin: 0 auto;">
                This transmission is protected by End-to-End Secure Tunnel. If you did not prompt this update, verify your profile dashboard immediately.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #F9FAFB; padding: 28px; text-align: center; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E5E7EB; font-weight: 600; letter-spacing: 0.5px;">
              &copy; ${new Date().getFullYear()} CLOUDOPTICS SYSTEMS &bull; SECURE CONTAINER SCAN
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!brevoApiKey || brevoApiKey === "your-brevo-api-key-here" || brevoApiKey.startsWith("your-")) {
    console.log("=== BREVO SMTP: SIMULATED OTP EMAIL ===");
    console.log(`To: ${to}`);
    console.log(`OTP: ${otp}`);
    console.log("========================================");
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
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
        subject: "CloudOptics - Verification Code",
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo API returned error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("OTP email successfully sent via Brevo:", data.messageId || data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending OTP email via Brevo:", error);
    throw error;
  }
}
