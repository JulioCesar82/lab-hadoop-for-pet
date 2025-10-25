/**
 * Simula o envio de notificações.
 * Em um ambiente de produção, este módulo se integraria com serviços reais
 * como SendGrid (Email), Twilio (SMS) ou Firebase (Push).
 */

const sendEmail = (tutor, recommendations) => {
    console.log(`[EMAIL] Enviando e-mail para ${tutor.email} sobre ${recommendations.length} novas recomendações.`);
    // Lógica de envio de e-mail aqui...
};

const sendSMS = (tutor, recommendations) => {
    console.log(`[SMS] Enviando SMS para ${tutor.phone} sobre ${recommendations.length} novas recomendações.`);
    // Lógica de envio de SMS aqui...
};

const sendPushNotification = (tutor, recommendations) => {
    console.log(`[PUSH] Enviando Push Notification para o tutor ${tutor.name} (ID: ${tutor.tutor_id}) sobre ${recommendations.length} novas recomendações.`);
    // Lógica de envio de Push Notification aqui...
};

const notifyTutor = (tutor, recommendations) => {
    sendEmail(tutor, recommendations);
    sendSMS(tutor, recommendations);
    sendPushNotification(tutor, recommendations);
};

module.exports = {
    notifyTutor,
};
