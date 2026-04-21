const CONTACT_FORM_ENDPOINT =
  process.env.CONTACT_FORM_URL ||
  'https://contact-form-service-e8aa.onrender.com/api/contact';

const SITE_URL =
  process.env.FRONTEND_URL || 'https://professionalsathome.com/';

const sendPasswordRecoveryEmail = async ({ to, resetUrl }) => {
  const payload = {
    name: 'professionals at home',
    email: to,
    to,
    message: `Recuperación de clave\n\nRecibimos una solicitud para recuperar tu clave en professionals at home.\n\nRestablecé tu clave desde este enlace:\n${resetUrl}\n\nEste enlace vence en 30 minutos por seguridad. Si no solicitaste este cambio, podés ignorar este correo.`,
    site: SITE_URL,
    company: '',
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
