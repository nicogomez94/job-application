const nodemailer = require('nodemailer');

let transporterPromise;
let usingEthereal = false;

const parseBoolean = (value) => String(value).toLowerCase() === 'true';

const getMailTransporter = async () => {
  if (transporterPromise) {
    return transporterPromise;
  }

  transporterPromise = (async () => {
    const hasSmtpConfig = Boolean(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
    );

    if (hasSmtpConfig) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: parseBoolean(process.env.SMTP_SECURE),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    const account = await nodemailer.createTestAccount();
    usingEthereal = true;

    console.log('[mail] SMTP no configurado. Usando cuenta de prueba Ethereal.');

    return nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  })();

  return transporterPromise;
};

const sendPasswordRecoveryEmail = async ({ to, resetUrl }) => {
  const transporter = await getMailTransporter();
  const from = process.env.MAIL_FROM || 'JobPlatform <no-reply@jobplatform.local>';

  const info = await transporter.sendMail({
    from,
    to,
    subject: 'Recuperación de clave - JobPlatform',
    text: `Recibimos una solicitud para recuperar tu clave.

Restablecé tu clave desde este enlace:
${resetUrl}

Este enlace vence pronto por seguridad. Si no solicitaste este cambio, podés ignorar este email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #2f2416;">
        <h2 style="margin-bottom: 12px;">Recuperación de clave</h2>
        <p>Recibimos una solicitud para recuperar tu clave en JobPlatform.</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background:#efc89a;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;display:inline-block;">
            Restablecer clave
          </a>
        </p>
        <p>Si el botón no funciona, copiá y pegá este enlace en tu navegador:</p>
        <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Si no solicitaste este cambio, podés ignorar este correo.</p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl && usingEthereal) {
    console.log(`[mail] Vista previa del correo (Ethereal): ${previewUrl}`);
  }

  return { messageId: info.messageId, previewUrl };
};

module.exports = {
  sendPasswordRecoveryEmail,
};
