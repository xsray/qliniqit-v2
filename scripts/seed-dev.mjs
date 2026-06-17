import pg from "pg";
import { randomUUID } from "crypto";

const client = new pg.Client({
  connectionString: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
});

await client.connect();
console.log("Connected to database");

// Seed specialties
const specialties = [
  { name_en: "General Practice", slug: "general-practice" },
  { name_en: "Cardiology", slug: "cardiology" },
  { name_en: "Dermatology", slug: "dermatology" },
  { name_en: "Pediatrics", slug: "pediatrics" },
  { name_en: "Orthopedics", slug: "orthopedics" },
  { name_en: "Dentistry", slug: "dentistry" },
  { name_en: "Ophthalmology", slug: "ophthalmology" },
  { name_en: "Neurology", slug: "neurology" },
  { name_en: "Psychiatry", slug: "psychiatry" },
  { name_en: "Gynecology", slug: "gynecology" },
];

for (const s of specialties) {
  await client.query(
    `INSERT INTO specialties (name_en, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
    [s.name_en, s.slug]
  );
}
console.log("✓ Specialties seeded");

// Seed providers
const providers = [
  { name: "Dr. Sarah Al-Hassan", email: "sarah@qliniqit.dev", city: "Amman", country: "JO", specialty: "cardiology", fee: "50.00", currency: "JOD", video: true, bio: "Cardiologist with 12 years of experience in interventional cardiology and heart disease prevention. Trained at Johns Hopkins and the Royal Brompton Hospital.", type: "doctor", languages: ["Arabic", "English"], cancellation: 24 },
  { name: "Dr. Ahmed Mansour", email: "ahmed@qliniqit.dev", city: "Dubai", country: "AE", specialty: "dermatology", fee: "200.00", currency: "AED", video: true, bio: "Board-certified dermatologist specialising in acne, eczema, psoriasis, and cosmetic dermatology. Over 2,000 satisfied patients across the UAE and GCC.", type: "doctor", languages: ["Arabic", "English"], cancellation: 12 },
  { name: "Dr. Layla Nasser", email: "layla@qliniqit.dev", city: "Cairo", country: "EG", specialty: "pediatrics", fee: "300.00", currency: "EGP", video: false, bio: "Paediatric specialist focused on child development, vaccinations, and nutritional guidance for ages 0–18. Fellow of the Egyptian Board of Pediatrics.", type: "doctor", languages: ["Arabic"], cancellation: 24 },
  { name: "City Dental Center", email: "city-dental@qliniqit.dev", city: "Beirut", country: "LB", specialty: "dentistry", fee: "80.00", currency: "USD", video: false, bio: "Full-service dental clinic offering general dentistry, cosmetic treatments, orthodontics, and implants. State-of-the-art equipment in a comfortable environment.", type: "dental_clinic", languages: ["Arabic", "English", "French"], cancellation: 48 },
  { name: "Dr. Omar Khalil", email: "omar@qliniqit.dev", city: "London", country: "GB", specialty: "general-practice", fee: "90.00", currency: "GBP", video: true, bio: "GP with a special interest in preventive medicine, chronic disease management, and travel health. NHS-trained with over 15 years of experience.", type: "doctor", languages: ["English", "Arabic"], cancellation: 24 },
  { name: "Dr. Fatima Al-Zahraa", email: "fatima@qliniqit.dev", city: "Riyadh", country: "SA", specialty: "neurology", fee: "400.00", currency: "SAR", video: true, bio: "Neurologist specialising in migraines, epilepsy, Parkinson's disease, and multiple sclerosis. Visiting consultant at King Faisal Specialist Hospital.", type: "doctor", languages: ["Arabic", "English"], cancellation: 48 },
  { name: "Dr. Mia Andersen", email: "mia@qliniqit.dev", city: "Copenhagen", country: "DK", specialty: "psychiatry", fee: "1200.00", currency: "DKK", video: true, bio: "Psychiatrist specialising in anxiety, depression, ADHD, and burnout. Cognitive behavioural therapy (CBT) and EMDR certified. Fluent in English and Danish.", type: "doctor", languages: ["Danish", "English"], cancellation: 48 },
  { name: "Dr. Carlos Vega", email: "carlos@qliniqit.dev", city: "Barcelona", country: "ES", specialty: "orthopedics", fee: "150.00", currency: "EUR", video: false, bio: "Orthopaedic surgeon with expertise in sports injuries, knee and hip replacements, and minimally invasive arthroscopic procedures.", type: "doctor", languages: ["Spanish", "English"], cancellation: 72 },
  { name: "Dr. Priya Sharma", email: "priya@qliniqit.dev", city: "Mumbai", country: "IN", specialty: "gynecology", fee: "1500.00", currency: "INR", video: true, bio: "Gynaecologist and obstetrician with 18 years of experience in high-risk pregnancies, PCOS management, and laparoscopic surgery.", type: "doctor", languages: ["Hindi", "English"], cancellation: 24 },
  { name: "Seoul Vision Clinic", email: "vision@qliniqit.dev", city: "Seoul", country: "KR", specialty: "ophthalmology", fee: "200.00", currency: "USD", video: false, bio: "Specialised eye clinic offering LASIK, cataract surgery, glaucoma treatment, and routine eye exams. JCI-accredited facility.", type: "clinic", languages: ["Korean", "English"], cancellation: 24 },
  { name: "Dr. Yusuf Ibrahim", email: "yusuf@qliniqit.dev", city: "Nairobi", country: "KE", specialty: "general-practice", fee: "3000.00", currency: "KES", video: true, bio: "Family medicine practitioner with experience in tropical diseases, HIV management, and maternal health.", type: "doctor", languages: ["Swahili", "English"], cancellation: 12 },
  { name: "Dr. Anna Kowalski", email: "anna@qliniqit.dev", city: "Warsaw", country: "PL", specialty: "dermatology", fee: "300.00", currency: "PLN", video: true, bio: "Dermatologist and cosmetologist. Expert in laser treatments, skin cancer screening, and anti-ageing procedures.", type: "doctor", languages: ["Polish", "English"], cancellation: 24 },
];

const createdProviders = [];

for (const p of providers) {
  const uid = randomUUID();
  const userRes = await client.query(
    `INSERT INTO users (supabase_uid, name, email, role, country_code, city, is_active)
     VALUES ($1, $2, $3, 'provider', $4, $5, true)
     ON CONFLICT DO NOTHING RETURNING id`,
    [uid, p.name, p.email, p.country, p.city]
  );
  if (!userRes.rows[0]) {
    // Already exists, fetch
    const existing = await client.query(`SELECT id FROM users WHERE email = $1`, [p.email]);
    if (!existing.rows[0]) continue;
    const existingProvider = await client.query(`SELECT id, slug FROM provider_profiles WHERE user_id = $1`, [existing.rows[0].id]);
    if (existingProvider.rows[0]) {
      createdProviders.push({ name: p.name, providerId: existingProvider.rows[0].id, slug: existingProvider.rows[0].slug });
    }
    continue;
  }
  const userId = userRes.rows[0].id;

  const specRes = await client.query(`SELECT id FROM specialties WHERE slug = $1`, [p.specialty]);
  const specialtyId = specRes.rows[0]?.id ?? null;

  const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);

  await client.query(
    `INSERT INTO provider_profiles
       (user_id, slug, specialty_id, provider_type, consultation_fee, currency_code,
        country_code, city, offers_video, bio, is_active, is_featured, verification_status,
        rating_avg, review_count, languages, cancellation_window_hours)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true,$11,'verified',$12,$13,$14,$15)
     ON CONFLICT DO NOTHING`,
    [userId, slug, specialtyId, p.type, p.fee, p.currency,
     p.country, p.city, p.video, p.bio,
     Math.random() > 0.4,
     (3.8 + Math.random() * 1.2).toFixed(1),
     Math.floor(Math.random() * 200) + 10,
     JSON.stringify(p.languages),
     p.cancellation]
  );

  const provRes = await client.query(`SELECT id FROM provider_profiles WHERE user_id = $1`, [userId]);
  const providerId = provRes.rows[0]?.id;
  if (providerId) {
    createdProviders.push({ name: p.name, providerId, slug });
    for (const day of [1, 2, 3, 4, 5]) {
      await client.query(
        `INSERT INTO availability_slots (provider_id, day_of_week, start_time, end_time, slot_duration_min, is_recurring, is_blocked)
         VALUES ($1, $2, '09:00', '17:00', 30, true, false) ON CONFLICT DO NOTHING`,
        [providerId, day]
      );
    }
  }
  console.log(`✓ Provider: ${p.name}`);
}

// Seed reviews for each provider
const reviewComments = [
  ["Absolutely brilliant doctor. Explained everything clearly and made me feel at ease. Highly recommended.", 5],
  ["Very professional and thorough. The video call worked perfectly and the diagnosis was spot on.", 5],
  ["Good experience overall. Wait time was a bit long but the consultation itself was excellent.", 4],
  ["Dr. was very knowledgeable and patient with all my questions. Will definitely book again.", 5],
  ["Great clinic, friendly staff, and very clean facilities. The doctor was experienced and caring.", 4],
  ["Quick to respond and very helpful. Prescribed the right treatment and followed up afterwards.", 5],
  ["Decent consultation. Could have spent a bit more time explaining the treatment options.", 3],
  ["Outstanding care. This doctor truly listens and doesn't rush you through the appointment.", 5],
  ["Very satisfied. The booking process was seamless and the doctor was punctual.", 4],
  ["Excellent specialist. Had been suffering for months and finally got the right diagnosis.", 5],
  ["Knowledgeable and caring. Took time to understand my full medical history before advising.", 5],
  ["Good doctor but the clinic was a bit hard to find. Would still recommend the consultation.", 4],
];

for (const { providerId } of createdProviders) {
  const reviewCount = 3 + Math.floor(Math.random() * 5);
  for (let i = 0; i < reviewCount; i++) {
    const [comment, rating] = reviewComments[Math.floor(Math.random() * reviewComments.length)];
    const patientNames = ["Ahmed K.", "Sara M.", "James L.", "Amira H.", "Oliver W.", "Fatima R.", "Carlos B.", "Priya N.", "Anna T.", "Yusuf D."];
    const name = patientNames[Math.floor(Math.random() * patientNames.length)];
    const daysAgo = Math.floor(Math.random() * 180) + 1;
    await client.query(
      `INSERT INTO reviews (provider_id, patient_name, rating, comment, is_verified, created_at)
       VALUES ($1, $2, $3, $4, true, NOW() - INTERVAL '${daysAgo} days')
       ON CONFLICT DO NOTHING`,
      [providerId, name, rating, comment]
    ).catch(() => {}); // ignore if schema differs
  }
}
console.log("✓ Reviews seeded");

// Seed deals (with proper columns)
try {
  const dealProviderRes = await client.query(`SELECT id FROM provider_profiles LIMIT 1`);
  const pid = dealProviderRes.rows[0]?.id;
  if (pid) {
    await client.query(`
      INSERT INTO deals (provider_id, title, description, category, status, valid_from, valid_until,
                         is_featured, claims_count, original_price, discounted_price, discount_pct, currency)
      VALUES
        ($1, '20% off first consultation', 'Book your first teleconsultation and get 20% off with any verified provider.', 'consultation', 'active', NOW(), NOW() + INTERVAL '30 days', true, 0, 100.00, 80.00, 20, 'USD'),
        ($1, 'Dental cleaning — half price', 'Professional scaling and polishing. New patients only. Limited slots available.', 'dental', 'active', NOW(), NOW() + INTERVAL '7 days', true, 2, 80.00, 40.00, 50, 'USD'),
        ($1, 'Full blood panel with dermatology consult', 'Book a dermatology consult and receive a complimentary full blood panel at our partner lab.', 'checkup', 'active', NOW(), NOW() + INTERVAL '14 days', false, 1, 150.00, 120.00, 20, 'USD'),
        ($1, 'Online psychiatry — first session 40% off', 'Introductory rate for your first video session with a licensed psychiatrist.', 'consultation', 'active', NOW(), NOW() + INTERVAL '21 days', true, 5, 200.00, 120.00, 40, 'USD'),
        ($1, 'LASIK pre-assessment — complimentary', 'Free LASIK eligibility screening including corneal mapping and full vision tests.', 'checkup', 'active', NOW(), NOW() + INTERVAL '60 days', false, 3, 250.00, 0.00, 100, 'USD'),
        ($1, 'Paediatric check-up bundle', 'Full developmental assessment for children 2–12 including hearing and vision tests.', 'checkup', 'active', NOW(), NOW() + INTERVAL '45 days', false, 0, 120.00, 85.00, 29, 'USD')
      ON CONFLICT DO NOTHING
    `, [pid]);
    console.log("✓ Deals seeded");
  }
} catch (e) {
  console.log("Note: deals seed skipped:", e.message);
}

await client.end();
console.log("\nDev seed complete ✅");
