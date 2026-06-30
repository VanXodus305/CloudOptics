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
      <body style="margin: 0; padding: 0; background-color: #0A0C1B; -webkit-text-size-adjust: 100%;">
        <div class="outer-wrapper" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080914; padding: 50px 20px; color: #E2E8F0; margin: 0;">
          <div class="email-container" style="max-width: 560px; margin: 0 auto; background-color: #0F112A; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 50px rgba(121, 44, 162, 0.15); border: 1px solid rgba(121, 44, 162, 0.15);">
            
            <!-- Header Banner -->
            <div class="header-banner" style="background: linear-gradient(135deg, #090B1E 0%, #15193B 50%, #4C1D95 100%); padding: 55px 40px; text-align: center; color: white; border-bottom: 1px solid rgba(121, 44, 162, 0.2);">
              <div style="background-color: rgba(121, 44, 162, 0.2); width: 48px; height: 48px; border-radius: 16px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(121, 44, 162, 0.35);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="#C084FC"/>
                </svg>
              </div>
              <h1 class="header-title" style="margin: 0; font-size: 32px; font-weight: 850; letter-spacing: -1px; background: linear-gradient(to right, #FFFFFF, #DCCBFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">CloudOptics</h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.8; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #C084FC;">Cloud Intelligence Vault</p>
            </div>
            
            <!-- Body Content -->
            <div class="body-content" style="padding: 45px; text-align: center;">
              <h2 style="margin-top: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3; margin-bottom: 20px;">Your Cloud Portal is Ready</h2>
              
              <p style="color: #94A3B8; font-size: 15px; line-height: 1.6; font-weight: 500; margin-bottom: 30px; text-align: center; max-width: 440px; margin-left: auto; margin-right: auto;">
                You have been granted access to the CloudOptics cost optimization platform. Explore metrics, track idle instances, and trigger mitigation playbooks.
              </p>
              
              <!-- Role Badge -->
              <div style="margin-bottom: 35px;">
                <p style="color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Assigned Identity Privilege</p>
                <span style="background-color: rgba(192, 132, 252, 0.1); color: #C084FC; padding: 8px 18px; border-radius: 99px; font-weight: 700; font-size: 13px; border: 1px solid rgba(192, 132, 252, 0.2); display: inline-block; letter-spacing: 0.5px;">
                  🛡️ ${role}
                </span>
              </div>
              
              <!-- CTA Button -->
              <div style="margin: 40px 0;">
                <a href="${loginUrl}" class="cta-button" style="background: linear-gradient(135deg, #792CA2 0%, #9A4DCC 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 16px; font-weight: 750; font-size: 15px; display: inline-block; box-shadow: 0 10px 25px rgba(121, 44, 162, 0.4); border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.25s ease-out; letter-spacing: 0.5px;">
                  Access CloudOptics Vault ➔
                </a>
              </div>
              
              <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 35px 0;" />
              
              <p style="color: #475569; font-size: 11px; line-height: 1.6; font-weight: 500; text-align: left; max-width: 460px; margin: 0 auto;">
                <strong>Security notice:</strong> This invitation is bound to this email address. If you did not request access, you may safely ignore this message. Powered by CloudOptics automated user provisioning.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #0A0B1A; padding: 28px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid rgba(255, 255, 255, 0.06); font-weight: 600; letter-spacing: 0.5px;">
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
      <body style="margin: 0; padding: 0; background-color: #0A0C1B; -webkit-text-size-adjust: 100%;">
        <div class="outer-wrapper" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080914; padding: 50px 20px; color: #E2E8F0; margin: 0;">
          <div class="email-container" style="max-width: 560px; margin: 0 auto; background-color: #0F112A; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 50px rgba(121, 44, 162, 0.15); border: 1px solid rgba(121, 44, 162, 0.15);">
            
            <!-- Header Banner -->
            <div class="header-banner" style="background: linear-gradient(135deg, #090B1E 0%, #15193B 50%, #4C1D95 100%); padding: 55px 40px; text-align: center; color: white; border-bottom: 1px solid rgba(121, 44, 162, 0.2);">
              <div style="background-color: rgba(192, 132, 252, 0.15); width: 48px; height: 48px; border-radius: 16px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(192, 132, 252, 0.3);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#C084FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="#C084FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 class="header-title" style="margin: 0; font-size: 32px; font-weight: 850; letter-spacing: -1px; background: linear-gradient(to right, #FFFFFF, #DCCBFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">CloudOptics</h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.8; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #C084FC;">Security Verification Module</p>
            </div>
            
            <!-- Body Content -->
            <div class="body-content" style="padding: 45px; text-align: center;">
              <h2 style="margin-top: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3; margin-bottom: 20px;">Email Verification Required</h2>
              
              <p style="color: #94A3B8; font-size: 15px; line-height: 1.6; font-weight: 500; margin-bottom: 30px; text-align: center; max-width: 440px; margin-left: auto; margin-right: auto;">
                Please input the following high-security One-Time Password (OTP) to authorize your new email configuration. This code will expire in 10 minutes.
              </p>
              
              <!-- OTP Box -->
              <div class="otp-box" style="margin: 35px 0; background-color: rgba(192, 132, 252, 0.04); padding: 22px 30px; border-radius: 20px; border: 1.5px dashed rgba(192, 132, 252, 0.35); display: inline-block;">
                <span class="otp-code" style="font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 36px; font-weight: 850; letter-spacing: 8px; color: #C084FC; display: inline-block;">${otp}</span>
              </div>
    
              <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 35px 0;" />
              
              <p style="color: #475569; font-size: 11px; line-height: 1.6; font-weight: 500; text-align: center; max-width: 400px; margin: 0 auto;">
                This transmission is protected by End-to-End Secure Tunnel. If you did not prompt this update, verify your profile dashboard immediately.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #0A0B1A; padding: 28px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid rgba(255, 255, 255, 0.06); font-weight: 600; letter-spacing: 0.5px;">
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
