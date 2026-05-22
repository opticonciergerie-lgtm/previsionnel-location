// ─────────────────────────────────────────────────────────────────────────────
// Configuration EmailJS
//
// ÉTAPES POUR CONFIGURER :
// 1. Créez un compte gratuit sur https://www.emailjs.com  (200 envois/mois gratuits)
// 2. "Email Services" → Add New Service → Gmail → connectez opti.conciergerie@gmail.com
//    → copiez le Service ID ci-dessous
// 3. "Email Templates" → Create New Template → utilisez ce modèle :
//
//    Sujet : 🏠 Nouveau prospect – {{proprietaire}}
//    Corps  :
//      Bonjour,
//      Un nouveau prospect vient de générer un prévisionnel.
//
//      👤 Propriétaire : {{proprietaire}}
//      📍 Adresse du bien : {{adresse}}
//      📞 Téléphone : {{telephone}}
//      ✉️  Email : {{email}}
//
//      🏠 Caractéristiques du bien :
//      • Zone : {{zone}}
//      • Style : {{style}}
//      • Chambres : {{chambres}}
//      • Capacité : {{capacite}} personnes
//      • Prestations : {{extras}}
//      • Formule : {{formule}}
//
//    → copiez le Template ID ci-dessous
//
// 4. "Account" → copiez votre Public Key ci-dessous
// ─────────────────────────────────────────────────────────────────────────────

export const EMAILJS_SERVICE_ID  = 'service_ozkyg3s'
export const EMAILJS_TEMPLATE_ID = 'template_l8cnytw'
export const EMAILJS_PUBLIC_KEY  = 'STdG0Zv9vjqYT_1rV'
