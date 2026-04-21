const CONTACT_FORM_ENDPOINT =
  process.env.CONTACT_FORM_URL ||
  'https://contact-form-service-e8aa.onrender.com/api/contact';

const SITE_URL =
  process.env.FRONTEND_URL || 'https://professionalsathome.com/';

const sendPasswordRecoveryEmail = async ({ to, resetUrl }) => {
  const payload = {
    name: 'professionals at home',
    email: process.env.MAIL_REPLY_TO || 'no-reply@professionalsathome.com',
    to,
    subject: 'Recuperación de clave - professionals at home',
    message: `Recibimos una solicitud para recuperar tu clave en professionals at home.\n\nRestablecé tu clave desde este enlace:\n${resetUrl}\n\nEste enlace vence en 30 minutos por seguridad. Si no solicitaste este cambio, podés ignorar este correo.`,
    site: SITE_URL,
    company: 'professionals at home',
  };

  const response = await fetch(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      `[mail] Error al enviar correo de recuperación: ${response.status} ${JSON.stringify(body)}`,
    );
  }

  console.log(`[mail] Correo de recuperación enviado a ${to}`);
  return await response.json().catch(() => ({}));
};

module.exports = {
  sendPasswordRecoveryEmail,
};
