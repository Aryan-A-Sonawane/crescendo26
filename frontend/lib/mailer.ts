import nodemailer from "nodemailer";

function getMailerConfig() {
  const user = String(process.env.EMAIL_USER || "").trim();
  // Gmail app passwords are often copied with spaces; sanitize defensively.
  const pass = String(process.env.EMAIL_PASS || "").replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error("[mailer] EMAIL_USER or EMAIL_PASS is not configured.");
  }

  return { user, pass };
}

function createTransporter() {
  const { user, pass } = getMailerConfig();

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail(email: string, otp: string, name: string) {
  const transporter = createTransporter();
  const { user } = getMailerConfig();

  await transporter.sendMail({
    from: `"Crescendo'26 Official" <${user}>`,
    to: email,
    subject: "Your OTP for Crescendo'26 Registration",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f3ba35;font-family:'Arial',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3ba35;padding:32px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0"
                  style="background:#8B1538;border-radius:16px;overflow:hidden;border:4px solid #D4A017;">
                  <tr>
                    <td align="center" style="padding:24px 32px 8px;">
                      <h1 style="margin:0;color:#D4A017;font-size:28px;letter-spacing:2px;">
                        CRESCENDO&apos;26
                      </h1>
                      <p style="color:#FFF8E7;font-size:13px;margin:4px 0 0;letter-spacing:1px;">
                        THE INDIAN ODYSSEY
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 32px;">
                      <p style="color:#FFF8E7;font-size:15px;margin:0 0 8px;">
                        Hi <strong>${name}</strong>,
                      </p>
                      <p style="color:#FFF8E7;font-size:14px;margin:0 0 20px;line-height:1.6;">
                        Use the OTP below to complete your registration for Crescendo&apos;26.
                        This code is valid for <strong>10 minutes</strong>.
                      </p>
                      <div style="background:#D4A017;border-radius:12px;padding:20px;text-align:center;margin:0 0 20px;">
                        <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#8B1538;">
                          ${otp}
                        </span>
                      </div>
                      <p style="color:#FFF8E7;font-size:12px;margin:0;line-height:1.6;opacity:0.8;">
                        If you didn&apos;t request this, please ignore this email.
                        Do not share this OTP with anyone.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:12px 32px 24px;">
                      <p style="color:#D4A017;font-size:11px;margin:0;letter-spacing:1px;">
                        © 2026 Crescendo — VIT Pune Inter-College Fest
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
