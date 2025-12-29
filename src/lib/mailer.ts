import nodemailer from 'nodemailer';
import { config } from './config';

type SendCodeResult = { delivered: boolean; previewCode?: string };

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!config.EMAIL.ENABLED) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.EMAIL.SMTP_HOST,
      port: config.EMAIL.SMTP_PORT,
      secure: config.EMAIL.SMTP_SECURE,
      auth: {
        user: config.EMAIL.SMTP_USER,
        pass: config.EMAIL.SMTP_PASSWORD
      }
    });
  }

  return transporter;
};

export async function sendPasswordResetCodeEmail(
  email: string,
  code: string,
  name?: string
): Promise<SendCodeResult> {
  const transport = getTransporter();

  if (!transport) {
    // Trong môi trường dev nếu chưa cấu hình SMTP, log code để dễ kiểm tra
    console.log(`[DEV] Password reset code for ${email}: ${code}`);
    return {
      delivered: false,
      previewCode: process.env.NODE_ENV === 'production' ? undefined : code
    };
  }

  const previewName = name ? ` ${name}` : '';
  const subject = 'Mã xác thực đặt lại mật khẩu SportStore';
  const text = [
    `Xin chào${previewName},`,
    '',
    'Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản SportStore.',
    `Mã xác thực của bạn là: ${code}`,
    'Mã có hiệu lực trong 10 phút. Không chia sẻ mã cho bất kỳ ai.',
    '',
    'Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.',
    '',
    'SportStore Team'
  ].join('\n');

  const html = `
    <p>Xin chào${previewName},</p>
    <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản <strong>SportStore</strong>.</p>
    <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
    <p>Mã có hiệu lực trong 10 phút. Không chia sẻ mã cho bất kỳ ai.</p>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    <p>SportStore Team</p>
  `;

  await transport.sendMail({
    from: config.EMAIL.FROM,
    to: email,
    subject,
    text,
    html
  });

  return { delivered: true };
}

