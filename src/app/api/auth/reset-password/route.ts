import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getConnection } from '@/lib/database';
import { sendPasswordResetCodeEmail } from '@/lib/mailer';

const CODE_EXPIRATION_MINUTES = 10;

const generateVerificationCode = () => {
  const code = crypto.randomInt(100000, 1000000).toString();
  return code.padStart(6, '0');
};

const hashVerificationCode = (code: string) =>
  crypto.createHash('sha256').update(code).digest('hex');

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword, step, code: verificationCode } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const conn = await pool.getConnection();
    
    try {
      if (step === 'send-code') {
        const [users] = await conn.execute(
          'SELECT id, email, name FROM users WHERE email = ?',
          [normalizedEmail]
        );

        if ((users as any).length === 0) {
          return NextResponse.json(
            { error: 'Email không tồn tại trong hệ thống' },
            { status: 404 }
          );
        }

        const user = (users as any)[0];
        const code = generateVerificationCode();
        const codeHash = hashVerificationCode(code);
        const expiresAt = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000);

        // Xóa mã cũ (nếu có) để tránh spam
        await conn.execute(
          'DELETE FROM password_reset_codes WHERE user_id = ?',
          [user.id]
        );

        await conn.execute(
          `INSERT INTO password_reset_codes (user_id, email, code_hash, expires_at) VALUES (?, ?, ?, ?)`,
          [user.id, normalizedEmail, codeHash, expiresAt]
        );

        const mailResult = await sendPasswordResetCodeEmail(normalizedEmail, code, user.name);

        return NextResponse.json({
          success: true,
          message: 'Đã gửi mã xác thực vào email của bạn',
          userName: user.name,
          expiresInMinutes: CODE_EXPIRATION_MINUTES,
          previewCode: mailResult.previewCode
        });
      }

      if (step === 'reset') {
        if (!verificationCode || typeof verificationCode !== 'string' || !/^\d{6}$/.test(verificationCode.trim())) {
          return NextResponse.json(
            { error: 'Mã xác thực không hợp lệ' },
            { status: 400 }
          );
        }

        if (!newPassword) {
          return NextResponse.json(
            { error: 'Mật khẩu mới là bắt buộc' },
            { status: 400 }
          );
        }

        if (newPassword.length < 6) {
          return NextResponse.json(
            { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
            { status: 400 }
          );
        }

        const [users] = await conn.execute(
          'SELECT id FROM users WHERE email = ?',
          [normalizedEmail]
        );

        if ((users as any).length === 0) {
          return NextResponse.json(
            { error: 'Email không tồn tại trong hệ thống' },
            { status: 404 }
          );
        }

        const user = (users as any)[0];

        const [codes] = await conn.execute(
          `
            SELECT id, code_hash, expires_at, used 
            FROM password_reset_codes 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 1
          `,
          [user.id]
        );

        if ((codes as any).length === 0) {
          return NextResponse.json(
            { error: 'Bạn chưa yêu cầu mã đặt lại mật khẩu' },
            { status: 400 }
          );
        }

        const codeRecord = (codes as any)[0];

        if (codeRecord.used) {
          return NextResponse.json(
            { error: 'Mã xác thực đã được sử dụng. Vui lòng yêu cầu mã mới.' },
            { status: 400 }
          );
        }

        if (new Date(codeRecord.expires_at) < new Date()) {
          return NextResponse.json(
            { error: 'Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.' },
            { status: 400 }
          );
        }

        const hashedCode = hashVerificationCode(verificationCode.trim());
        const storedHash = codeRecord.code_hash;

        if (
          storedHash.length !== hashedCode.length ||
          !crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(hashedCode))
        ) {
          await conn.execute(
            'UPDATE password_reset_codes SET attempts = attempts + 1 WHERE id = ?',
            [codeRecord.id]
          );

          return NextResponse.json(
            { error: 'Mã xác thực không chính xác' },
            { status: 400 }
          );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        try {
          await conn.beginTransaction();
          await conn.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, user.id]
          );
          await conn.execute(
            'UPDATE password_reset_codes SET used = 1 WHERE id = ?',
            [codeRecord.id]
          );
          await conn.execute(
            'DELETE FROM password_reset_codes WHERE user_id = ? AND id <> ?',
            [user.id, codeRecord.id]
          );
          await conn.commit();
        } catch (transactionError) {
          await conn.rollback();
          throw transactionError;
        }

        return NextResponse.json({
          success: true,
          message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.'
        });
      }

      return NextResponse.json(
        { error: 'Bước không hợp lệ' },
        { status: 400 }
      );

    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Không thể kết nối đến database. Vui lòng kiểm tra XAMPP MySQL.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Lỗi server: ${error.message}` },
        { status: 500 }
      );
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: `Lỗi server: ${error.message}` },
      { status: 500 }
    );
  }
}

