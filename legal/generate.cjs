const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, LevelFormat, ExternalHyperlink
} = require('/Users/xsray/.nvm/versions/node/v24.14.0/lib/node_modules/docx');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname);

// ─── Shared styles ────────────────────────────────────────────────────────────
const BRAND = "1A56C4"; // Qliniqit blue
const DARK  = "1E293B";
const GRAY  = "64748B";

const styles = {
  default: { document: { run: { font: "Arial", size: 22, color: DARK } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 36, bold: true, font: "Arial", color: BRAND },
      paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 26, bold: true, font: "Arial", color: DARK },
      paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 } },
    { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 22, bold: true, font: "Arial", color: DARK },
      paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 2 } },
  ]
};

const numbering = {
  config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ]
};

const PAGE = { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } };

function makeHeader(title) {
  return new Header({
    children: [
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND } },
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "QLINIQIT  |  ", bold: true, font: "Arial", size: 20, color: BRAND }),
          new TextRun({ text: title, font: "Arial", size: 20, color: GRAY }),
        ]
      })
    ]
  });
}

function makeFooter() {
  return new Footer({
    children: [
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" } },
        spacing: { before: 120 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "www.qliniqit.com  |  aiman@hu.edu.jo  |  Page ", font: "Arial", size: 18, color: GRAY }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: GRAY }),
        ]
      })
    ]
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text, ...opts })] });
}
function bullet(text) {
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22 })] });
}
function num(text) {
  return new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22 })] });
}
function spacer() {
  return new Paragraph({ children: [new TextRun("")] });
}
function titleBlock(title, subtitle, date) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 120 },
      children: [new TextRun({ text: "QLINIQIT", bold: true, font: "Arial", size: 52, color: BRAND })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND } },
      children: [new TextRun({ text: title, bold: true, font: "Arial", size: 36, color: DARK })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [new TextRun({ text: subtitle, font: "Arial", size: 22, color: GRAY, italics: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 },
      children: [new TextRun({ text: date, font: "Arial", size: 20, color: GRAY })]
    }),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PRIVACY POLICY
// ═══════════════════════════════════════════════════════════════════════════════
function createPrivacyPolicy() {
  const children = [
    ...titleBlock("Privacy Policy", "HIPAA & GDPR Compliant", "Effective Date: June 19, 2026"),

    h1("1. Introduction"),
    p("Qliniqit (\"we,\" \"us,\" or \"our\") operates www.qliniqit.com, a global telemedicine and healthcare provider discovery platform. We are committed to protecting your privacy and handling your personal and health information with the utmost care and in compliance with applicable laws, including the Health Insurance Portability and Accountability Act (HIPAA), the General Data Protection Regulation (GDPR), and applicable Jordanian data protection legislation."),
    p("This Privacy Policy explains what information we collect, how we use it, who we share it with, and the rights you have regarding your information. By using Qliniqit, you agree to the practices described in this Policy."),
    spacer(),

    h1("2. Information We Collect"),
    h2("2.1 Information You Provide"),
    bullet("Identity data: full name, date of birth, gender, nationality"),
    bullet("Contact data: email address, phone number, mailing address"),
    bullet("Account credentials: username and encrypted password"),
    bullet("Health information: symptoms, medical history, prescriptions, consultation notes, diagnoses"),
    bullet("Payment information: billing address, card details (processed by Stripe; we do not store raw card numbers)"),
    bullet("Professional data (providers only): medical license number, specialty, credentials, institution affiliation"),
    spacer(),
    h2("2.2 Information Collected Automatically"),
    bullet("Usage data: pages visited, features used, session duration, clicks"),
    bullet("Device data: IP address, browser type, operating system, device identifiers"),
    bullet("Location data: country and region (derived from IP address)"),
    bullet("Cookies and similar tracking technologies (see Section 9)"),
    spacer(),
    h2("2.3 Information from Third Parties"),
    bullet("Video consultation data from Daily.co (session metadata only; video content is end-to-end encrypted)"),
    bullet("Payment confirmation data from Stripe"),
    bullet("Authentication data if you sign in via a social provider"),
    spacer(),

    h1("3. How We Use Your Information"),
    h2("3.1 To Provide Services"),
    bullet("Create and manage your account"),
    bullet("Match members with healthcare providers"),
    bullet("Facilitate in-clinic and video consultations"),
    bullet("Process payments and issue receipts"),
    bullet("Send appointment confirmations, reminders, and follow-up communications"),
    spacer(),
    h2("3.2 For Safety and Compliance"),
    bullet("Verify provider credentials and licenses"),
    bullet("Detect and prevent fraud and unauthorized access"),
    bullet("Comply with legal obligations, court orders, and regulatory requirements"),
    bullet("Maintain audit logs as required by HIPAA"),
    spacer(),
    h2("3.3 To Improve the Platform"),
    bullet("Analyze usage patterns to improve features and performance"),
    bullet("Conduct research and analytics (on anonymized or aggregated data only)"),
    bullet("Send service-related notifications and, with your consent, marketing communications"),
    spacer(),

    h1("4. Legal Bases for Processing (GDPR)"),
    p("For users in the European Economic Area (EEA), the United Kingdom, and other GDPR-applicable jurisdictions, we process your personal data under the following legal bases:"),
    bullet("Contract performance: to provide the services you requested"),
    bullet("Legitimate interests: to improve the platform, prevent fraud, and ensure security"),
    bullet("Legal obligation: to comply with applicable laws"),
    bullet("Consent: for optional communications and non-essential cookies"),
    bullet("Vital interests: in emergency situations where processing is necessary to protect life"),
    spacer(),

    h1("5. How We Share Your Information"),
    h2("5.1 With Healthcare Providers"),
    p("When you book a consultation, we share the health information you provide with the relevant provider to enable them to deliver care. Providers are bound by professional confidentiality obligations and our Provider Agreement."),
    spacer(),
    h2("5.2 With Service Providers (Business Associates)"),
    p("We engage third-party vendors who process data on our behalf under signed Business Associate Agreements (BAAs) or Data Processing Agreements (DPAs):"),
    bullet("Daily.co: video consultation infrastructure (HIPAA BAA in place)"),
    bullet("Stripe: payment processing (BAA/DPA in place)"),
    bullet("Amazon Web Services (AWS): cloud hosting and storage (HIPAA BAA in place)"),
    bullet("Supabase: authentication and database services (BAA in place)"),
    spacer(),
    h2("5.3 Legal Requirements"),
    p("We may disclose information if required by law, subpoena, court order, or to protect the rights, property, or safety of Qliniqit, our users, or the public."),
    spacer(),
    h2("5.4 Business Transfers"),
    p("In the event of a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your information is transferred and becomes subject to a different privacy policy."),
    spacer(),
    h2("5.5 No Sale of Personal Data"),
    p("We do not sell, rent, or trade your personal or health information to any third party for marketing purposes."),
    spacer(),

    h1("6. Data Retention"),
    new Table({
      width: { size: 10080, type: WidthType.DXA },
      columnWidths: [3600, 6480],
      rows: [
        new TableRow({
          children: [
            new TableCell({ shading: { fill: "1A56C4", type: ShadingType.CLEAR },
              width: { size: 3600, type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 150, right: 150 },
              children: [new Paragraph({ children: [new TextRun({ text: "Data Type", bold: true, color: "FFFFFF", font: "Arial", size: 20 })] })] }),
            new TableCell({ shading: { fill: "1A56C4", type: ShadingType.CLEAR },
              width: { size: 6480, type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 150, right: 150 },
              children: [new Paragraph({ children: [new TextRun({ text: "Retention Period", bold: true, color: "FFFFFF", font: "Arial", size: 20 })] })] }),
          ]
        }),
        ...[
          ["Health records & consultation notes", "7 years from last interaction, or as required by applicable law"],
          ["Account information", "Duration of account, plus 3 years after closure"],
          ["Payment records", "7 years (financial regulations)"],
          ["Audit logs (HIPAA)", "6 years from creation"],
          ["Marketing data", "Until consent is withdrawn"],
          ["Usage/analytics data", "2 years, then anonymized"],
        ].map(([type, period], i) =>
          new TableRow({
            children: [
              new TableCell({ shading: { fill: i % 2 === 0 ? "F8FAFC" : "FFFFFF", type: ShadingType.CLEAR },
                width: { size: 3600, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 150, right: 150 },
                children: [new Paragraph({ children: [new TextRun({ text: type, font: "Arial", size: 20 })] })] }),
              new TableCell({ shading: { fill: i % 2 === 0 ? "F8FAFC" : "FFFFFF", type: ShadingType.CLEAR },
                width: { size: 6480, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 150, right: 150 },
                children: [new Paragraph({ children: [new TextRun({ text: period, font: "Arial", size: 20 })] })] }),
            ]
          })
        )
      ]
    }),
    spacer(),

    h1("7. Your Rights"),
    h2("7.1 GDPR Rights (EEA/UK Users)"),
    bullet("Right of access: request a copy of your personal data"),
    bullet("Right to rectification: correct inaccurate data"),
    bullet("Right to erasure: request deletion (subject to legal retention requirements)"),
    bullet("Right to restriction: limit how we process your data"),
    bullet("Right to data portability: receive your data in a structured, machine-readable format"),
    bullet("Right to object: object to processing based on legitimate interests"),
    bullet("Right to withdraw consent: at any time for consent-based processing"),
    p("To exercise any GDPR right, contact us at aiman@hu.edu.jo. We will respond within 30 days."),
    spacer(),
    h2("7.2 HIPAA Rights (Health Information)"),
    bullet("Right to access your Protected Health Information (PHI)"),
    bullet("Right to request amendment of your PHI"),
    bullet("Right to an accounting of disclosures of your PHI"),
    bullet("Right to request restrictions on how your PHI is used or disclosed"),
    bullet("Right to receive a copy of this Notice of Privacy Practices"),
    p("To exercise HIPAA rights, contact our Privacy Officer at aiman@hu.edu.jo."),
    spacer(),

    h1("8. International Data Transfers"),
    p("Qliniqit operates globally. Your information may be transferred to and processed in countries outside your country of residence, including Jordan, the United States, and countries within the European Economic Area."),
    p("For transfers from the EEA/UK to third countries, we rely on: (a) Standard Contractual Clauses (SCCs) approved by the European Commission; (b) adequacy decisions where applicable; or (c) your explicit consent."),
    spacer(),

    h1("9. Cookies"),
    p("We use cookies and similar technologies to operate and improve the platform. For full details, please see our Cookie Policy. You can manage cookie preferences in your account settings or browser."),
    spacer(),

    h1("10. Security"),
    p("We implement industry-standard technical and organizational security measures, including:"),
    bullet("Encryption in transit (TLS 1.2+) and at rest (AES-256)"),
    bullet("Access controls and role-based permissions"),
    bullet("Regular security assessments and penetration testing"),
    bullet("HIPAA-compliant audit logging"),
    bullet("Employee training on data privacy and security"),
    p("In the event of a data breach affecting your rights and freedoms, we will notify you and applicable regulatory authorities within 72 hours of discovery, as required by GDPR."),
    spacer(),

    h1("11. Children"),
    p("Qliniqit is not directed at children under 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, contact us immediately at aiman@hu.edu.jo."),
    spacer(),

    h1("12. Changes to This Policy"),
    p("We may update this Privacy Policy periodically. We will notify you of material changes via email or a prominent notice on the platform at least 30 days before the changes take effect. Continued use of Qliniqit after the effective date constitutes acceptance of the updated Policy."),
    spacer(),

    h1("13. Contact Us"),
    p("Data Controller: Qliniqit"),
    p("Privacy Officer Email: aiman@hu.edu.jo"),
    p("Website: www.qliniqit.com"),
    p("For GDPR inquiries, you also have the right to lodge a complaint with your local data protection authority."),
  ];

  return new Document({
    styles, numbering,
    sections: [{ properties: { page: PAGE },
      headers: { default: makeHeader("Privacy Policy") },
      footers: { default: makeFooter() },
      children }]
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. TERMS OF SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
function createTermsOfService() {
  const children = [
    ...titleBlock("Terms of Service", "Platform Usage Agreement", "Effective Date: June 19, 2026"),

    h1("1. Acceptance of Terms"),
    p("By accessing or using Qliniqit (\"Platform,\" \"we,\" \"us,\" \"our\") at www.qliniqit.com, you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree, do not use the Platform."),
    spacer(),

    h1("2. Platform Description"),
    p("Qliniqit is a global healthcare marketplace that connects members (patients, caregivers, and health-conscious individuals) with verified healthcare providers for in-clinic appointments, video consultations, medical events, health travel, and related services. Qliniqit is a technology platform and not a healthcare provider."),
    spacer(),

    h1("3. Eligibility"),
    bullet("You must be at least 18 years of age to create an account"),
    bullet("If registering on behalf of a minor, a parent or legal guardian must accept these Terms"),
    bullet("You must provide accurate, current, and complete registration information"),
    bullet("You may not create an account if you have previously been banned from the Platform"),
    spacer(),

    h1("4. Account Types"),
    h2("4.1 Member Accounts"),
    p("Members may search for providers, book appointments, attend virtual consultations, access health content, and manage their health records on the Platform."),
    h2("4.2 Provider Accounts"),
    p("Healthcare providers (doctors, clinics, hospitals, labs, pharmacies, and other health entities) may list their services, manage availability, receive bookings, conduct video consultations, and publish health content. Providers must agree to the Provider Agreement in addition to these Terms."),
    spacer(),

    h1("5. Prohibited Uses"),
    p("You agree not to:"),
    num("Use the Platform for any unlawful purpose or in violation of any applicable law"),
    num("Impersonate any person, provider, or entity"),
    num("Upload false, misleading, or fraudulent credentials or information"),
    num("Interfere with, disrupt, or damage the Platform or its servers"),
    num("Scrape, crawl, or extract data from the Platform without written permission"),
    num("Use the Platform to transmit spam, malware, or malicious code"),
    num("Attempt to gain unauthorized access to any account or system"),
    num("Harass, abuse, or harm other users or providers"),
    num("Use the Platform in any way that could harm minors"),
    spacer(),

    h1("6. Telemedicine Disclaimer"),
    p("IMPORTANT: Qliniqit facilitates access to telemedicine services but is not a medical provider. The following limitations apply:"),
    bullet("Telemedicine is not a substitute for in-person care in all circumstances"),
    bullet("In a medical emergency, call your local emergency services immediately (e.g., 911, 112, 911)"),
    bullet("Qliniqit cannot guarantee the accuracy, completeness, or suitability of any medical advice provided by providers on the Platform"),
    bullet("Providers are independent professionals and are not employees of Qliniqit"),
    bullet("Qliniqit is not liable for any medical advice, diagnosis, or treatment rendered by providers"),
    spacer(),

    h1("7. Payments and Fees"),
    h2("7.1 Booking Fees"),
    p("Consultation fees are set by individual providers and displayed prior to booking. Qliniqit charges a service fee on each transaction, which is included in the displayed price or disclosed separately at checkout."),
    h2("7.2 Payment Processing"),
    p("Payments are processed by Stripe. By making a payment, you agree to Stripe's Terms of Service. Qliniqit does not store your full payment card information."),
    h2("7.3 Cancellation and Refunds"),
    bullet("Cancellations made more than 24 hours before the appointment: full refund"),
    bullet("Cancellations made 12-24 hours before the appointment: 50% refund"),
    bullet("Cancellations made less than 12 hours before the appointment: no refund"),
    bullet("No-shows without cancellation: no refund"),
    bullet("Provider-initiated cancellations: full refund to member"),
    bullet("Technical issues attributable to Qliniqit: full refund at our discretion"),
    p("Refund requests must be submitted within 7 days of the appointment through your account dashboard."),
    spacer(),

    h1("8. Intellectual Property"),
    p("All content on the Platform, including software, design, logos, text, and graphics, is the intellectual property of Qliniqit or its licensors and is protected by copyright, trademark, and other intellectual property laws."),
    p("You may not reproduce, distribute, modify, or create derivative works of any Platform content without our prior written consent."),
    p("Health content published by providers remains their intellectual property. By publishing on the Platform, providers grant Qliniqit a non-exclusive, royalty-free license to display and distribute such content."),
    spacer(),

    h1("9. Limitation of Liability"),
    p("TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, QLINIQIT AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, LOSS OF REVENUE, OR PERSONAL INJURY, ARISING FROM OR RELATED TO YOUR USE OF THE PLATFORM."),
    p("Our total liability to you for any claim arising from these Terms or your use of the Platform shall not exceed the amount you paid to Qliniqit in the 12 months preceding the claim."),
    spacer(),

    h1("10. Indemnification"),
    p("You agree to indemnify, defend, and hold harmless Qliniqit and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from: (a) your use of the Platform; (b) your violation of these Terms; (c) your violation of any rights of a third party; or (d) any content you submit to the Platform."),
    spacer(),

    h1("11. Governing Law and Dispute Resolution"),
    p("These Terms are governed by and construed in accordance with the laws of the Hashemite Kingdom of Jordan, without regard to conflict of law principles."),
    p("Any dispute arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If not resolved within 30 days, disputes shall be submitted to binding arbitration in Amman, Jordan, in accordance with applicable arbitration rules."),
    p("Notwithstanding the above, either party may seek emergency injunctive relief in a court of competent jurisdiction."),
    spacer(),

    h1("12. Termination"),
    p("We may suspend or terminate your account immediately, without notice, if you:"),
    bullet("Violate these Terms or the Provider Agreement"),
    bullet("Provide false or misleading information"),
    bullet("Engage in fraudulent, abusive, or harmful conduct"),
    bullet("Fail to pay amounts owed"),
    p("Upon termination, your right to use the Platform ceases immediately. We may retain your data as required by law or our retention policy."),
    spacer(),

    h1("13. Changes to These Terms"),
    p("We may update these Terms at any time. We will notify you of material changes at least 30 days in advance via email. Continued use after the effective date constitutes acceptance."),
    spacer(),

    h1("14. Contact"),
    p("Qliniqit | www.qliniqit.com | aiman@hu.edu.jo"),
  ];

  return new Document({ styles, numbering,
    sections: [{ properties: { page: PAGE },
      headers: { default: makeHeader("Terms of Service") },
      footers: { default: makeFooter() },
      children }] });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PROVIDER AGREEMENT
// ═══════════════════════════════════════════════════════════════════════════════
function createProviderAgreement() {
  const children = [
    ...titleBlock("Healthcare Provider Agreement", "Terms for Registered Healthcare Providers", "Effective Date: June 19, 2026"),

    h1("1. Introduction"),
    p("This Healthcare Provider Agreement (\"Agreement\") governs the relationship between Qliniqit (\"Platform\") and you, the registered healthcare provider (\"Provider\"). By completing Provider registration, you accept and agree to this Agreement in addition to the Qliniqit Terms of Service."),
    spacer(),

    h1("2. Eligibility and Verification Requirements"),
    p("To register as a Provider, you must:"),
    num("Hold a valid, current healthcare license in your jurisdiction of practice"),
    num("Submit accurate credential documentation, including license number, issuing authority, and expiry date"),
    num("Provide proof of professional indemnity / malpractice insurance where required by your jurisdiction"),
    num("Pass Qliniqit's credential verification process, which may include third-party checks with relevant licensing bodies"),
    num("Maintain all required licenses and credentials in good standing for the duration of your registration"),
    p("IMPORTANT: By completing registration, you declare under penalty of permanent account suspension that all submitted qualifications are true, valid, and current, and that you consent to verification checks by Qliniqit or the relevant authorization body."),
    spacer(),

    h1("3. Provider Obligations"),
    h2("3.1 Professional Conduct"),
    bullet("Provide services that meet the professional standards of your specialty and jurisdiction"),
    bullet("Maintain patient confidentiality in accordance with applicable laws"),
    bullet("Respond to booking requests and messages within a reasonable time"),
    bullet("Keep your availability calendar accurate and up to date"),
    bullet("Notify Qliniqit promptly of any disciplinary action, license suspension, or criminal charges"),
    spacer(),
    h2("3.2 Telemedicine Standards"),
    bullet("Only conduct telemedicine for conditions appropriate for remote care"),
    bullet("Inform members when in-person evaluation is required"),
    bullet("Maintain adequate technology (camera, microphone, secure connection) for video consultations"),
    bullet("Document consultations in accordance with your professional obligations"),
    bullet("Not prescribe controlled substances via telemedicine unless expressly permitted by applicable law"),
    spacer(),
    h2("3.3 Prescription Rules"),
    bullet("Electronic prescriptions must comply with applicable national and local laws"),
    bullet("Providers are solely responsible for the appropriateness of any prescription issued"),
    bullet("Qliniqit does not facilitate or take responsibility for prescription fulfillment"),
    spacer(),

    h1("4. Data Handling Obligations"),
    p("As a healthcare provider accessing member health information through the Platform, you agree to:"),
    bullet("Treat all member health information as Protected Health Information (PHI)"),
    bullet("Use member data only for the purpose of delivering the booked service"),
    bullet("Not copy, retain, or share member PHI outside the Platform except as required for continuity of care"),
    bullet("Immediately notify Qliniqit of any suspected or actual data breach involving member information"),
    bullet("Comply with all applicable data protection laws, including HIPAA and GDPR where relevant"),
    spacer(),

    h1("5. Fees and Revenue Share"),
    h2("5.1 Platform Service Fee"),
    p("Qliniqit charges a service fee on each completed booking. The applicable fee rate is disclosed in your Provider dashboard and may be updated with 30 days' notice."),
    h2("5.2 Payment Schedule"),
    p("Earnings (net of Qliniqit's service fee) are transferred to your registered payment account within 7 business days of consultation completion, subject to any holds for disputes."),
    h2("5.3 Disputes and Chargebacks"),
    p("Qliniqit reserves the right to withhold payment pending resolution of member disputes or chargebacks. Providers are liable for refunds resulting from their failure to attend, gross misconduct, or material misrepresentation."),
    spacer(),

    h1("6. Termination"),
    h2("6.1 Termination by Provider"),
    p("You may terminate this Agreement by providing 30 days' written notice to aiman@hu.edu.jo. You remain responsible for completing all booked consultations or arranging appropriate referrals."),
    h2("6.2 Termination for Cause"),
    p("Qliniqit may terminate this Agreement immediately and permanently ban your account if you:"),
    bullet("Provide false, forged, or misrepresented credentials"),
    bullet("Engage in sexual misconduct, abuse, or harassment"),
    bullet("Are subject to license suspension or revocation"),
    bullet("Cause demonstrable harm to a member"),
    bullet("Violate data protection or confidentiality obligations"),
    bullet("Engage in fraudulent billing or payment manipulation"),
    spacer(),

    h1("7. Indemnification"),
    p("Provider agrees to indemnify, defend, and hold harmless Qliniqit, its officers, directors, employees, and agents from any claims, liabilities, damages, and expenses (including legal fees) arising from: (a) your provision of healthcare services; (b) your violation of this Agreement; (c) your violation of applicable law; or (d) any malpractice, negligence, or misconduct in your professional services."),
    spacer(),

    h1("8. Governing Law"),
    p("This Agreement is governed by the laws of the Hashemite Kingdom of Jordan. Disputes shall be resolved in accordance with the dispute resolution provisions in the Terms of Service."),
    spacer(),

    h1("9. Contact"),
    p("For queries regarding this Agreement, contact: aiman@hu.edu.jo"),
  ];

  return new Document({ styles, numbering,
    sections: [{ properties: { page: PAGE },
      headers: { default: makeHeader("Provider Agreement") },
      footers: { default: makeFooter() },
      children }] });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. MEMBER CONSENT FORM
// ═══════════════════════════════════════════════════════════════════════════════
function createMemberConsent() {
  const children = [
    ...titleBlock("Telemedicine Informed Consent Form", "Please read carefully before your first video consultation", "Version: June 2026"),

    h1("1. What Is Telemedicine?"),
    p("Telemedicine (also called telehealth or virtual care) is the delivery of healthcare services using electronic communications, including video calls, secure messaging, and digital health tools. Through Qliniqit, you can consult with licensed healthcare providers from any location with internet access."),
    spacer(),

    h1("2. Benefits of Telemedicine"),
    bullet("Convenient access to healthcare from your home or any location"),
    bullet("Reduced travel time and cost"),
    bullet("Access to specialists who may not be available locally"),
    bullet("Continuity of care for follow-up consultations"),
    bullet("Faster access to medical advice for non-emergency conditions"),
    spacer(),

    h1("3. Limitations and Risks"),
    p("You understand and acknowledge that:"),
    num("Telemedicine has limitations compared to in-person care. Physical examination, hands-on procedures, and some diagnostic tests cannot be performed remotely."),
    num("The quality of the consultation may be affected by internet connectivity, audio/video quality, or technical issues."),
    num("Your provider may determine during a telemedicine session that an in-person visit is necessary and refer you accordingly."),
    num("Telemedicine is not appropriate for all medical conditions. It is not suitable for emergencies requiring immediate physical intervention."),
    num("Delays in care may occur due to technical failures. If you experience a medical emergency, contact your local emergency services immediately."),
    spacer(),

    h1("4. Privacy and Electronic Transmission"),
    p("You understand that:"),
    num("Your consultation will take place over an encrypted video connection. However, no electronic transmission is 100% guaranteed to be secure."),
    num("Your consultation data, including health information shared during the session, is stored securely by Qliniqit in accordance with our Privacy Policy."),
    num("Providers may document your consultation notes within the Platform, which are accessible to you through your account."),
    num("Sessions are not recorded without your explicit consent and the provider's consent."),
    spacer(),

    h1("5. Emergency Situations"),
    p("IMPORTANT: Telemedicine providers on Qliniqit CANNOT dispatch emergency services on your behalf. In a medical emergency:"),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120 },
      children: [new TextRun({ text: "CALL YOUR LOCAL EMERGENCY NUMBER IMMEDIATELY", bold: true, font: "Arial", size: 28, color: "DC2626" })]
    }),
    p("(e.g., 911 in the US, 999 in the UK, 112 in Europe, 911 in Jordan)"),
    p("Do not wait for a telemedicine appointment if you are experiencing: chest pain, difficulty breathing, stroke symptoms, severe allergic reactions, uncontrolled bleeding, loss of consciousness, or any other life-threatening condition."),
    spacer(),

    h1("6. Insurance Coverage"),
    p("Telemedicine services on Qliniqit may or may not be covered by your health insurance. You are responsible for:"),
    bullet("Verifying your insurance coverage for telemedicine services before booking"),
    bullet("Paying any applicable co-payments, deductibles, or fees not covered by insurance"),
    bullet("Requesting receipts or medical documentation from your provider if required for insurance reimbursement"),
    spacer(),

    h1("7. Right to Withdraw Consent"),
    p("Your consent to telemedicine is voluntary. You may withdraw this consent at any time by:"),
    bullet("Ending the video consultation at any time without penalty"),
    bullet("Contacting us at aiman@hu.edu.jo to remove this consent from your records"),
    bullet("Requesting an in-person referral from your provider"),
    p("Withdrawal of consent does not affect the lawfulness of any services already provided."),
    spacer(),

    h1("8. Member Acknowledgment and Consent"),
    p("By using telemedicine services on Qliniqit, I confirm that:"),
    num("I have read and understand this Informed Consent Form"),
    num("I understand the benefits, limitations, and risks of telemedicine"),
    num("I consent to the use of electronic communications for my healthcare consultations"),
    num("I understand that telemedicine is not a substitute for emergency care"),
    num("I understand that my sessions are not recorded without explicit consent"),
    num("I am aware of my right to withdraw consent at any time"),
    spacer(),
    spacer(),

    new Table({
      width: { size: 10080, type: WidthType.DXA },
      columnWidths: [5040, 5040],
      rows: [
        new TableRow({ children: [
          new TableCell({ width: { size: 5040, type: WidthType.DXA },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 4, color: DARK } },
            margins: { top: 400, bottom: 80, left: 100, right: 200 },
            children: [new Paragraph({ children: [new TextRun({ text: "Member Full Name", font: "Arial", size: 20, color: GRAY })] })] }),
          new TableCell({ width: { size: 5040, type: WidthType.DXA },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 4, color: DARK } },
            margins: { top: 400, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: "Date", font: "Arial", size: 20, color: GRAY })] })] }),
        ]}),
        new TableRow({ children: [
          new TableCell({ width: { size: 5040, type: WidthType.DXA },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 4, color: DARK } },
            margins: { top: 400, bottom: 80, left: 100, right: 200 },
            children: [new Paragraph({ children: [new TextRun({ text: "Member Signature", font: "Arial", size: 20, color: GRAY })] })] }),
          new TableCell({ width: { size: 5040, type: WidthType.DXA },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 4, color: DARK } },
            margins: { top: 400, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: "Account Email", font: "Arial", size: 20, color: GRAY })] })] }),
        ]}),
      ]
    }),
    spacer(),
    p("Questions? Contact us at aiman@hu.edu.jo | www.qliniqit.com", { color: GRAY, italics: true }),
  ];

  return new Document({ styles, numbering,
    sections: [{ properties: { page: PAGE },
      headers: { default: makeHeader("Telemedicine Informed Consent") },
      footers: { default: makeFooter() },
      children }] });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. BAA TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════
function createBAA() {
  const children = [
    ...titleBlock("Business Associate Agreement", "HIPAA-Compliant Template", "Effective Date: [DATE]"),

    p("This Business Associate Agreement (\"BAA\" or \"Agreement\") is entered into as of [DATE] between:", { bold: true }),
    p("Covered Entity: Qliniqit, operating at www.qliniqit.com (\"CE\")"),
    p("Business Associate: [VENDOR NAME] (\"BA\")"),
    p("collectively referred to as the \"Parties.\""),
    spacer(),

    h1("1. Definitions"),
    p("The following terms have the meanings given under HIPAA (45 CFR Parts 160 and 164):"),
    bullet("Protected Health Information (PHI): individually identifiable health information transmitted or maintained in any form"),
    bullet("Electronic PHI (ePHI): PHI transmitted or maintained in electronic form"),
    bullet("Covered Entity (CE): a healthcare provider, health plan, or healthcare clearinghouse subject to HIPAA"),
    bullet("Business Associate (BA): a person or entity that performs functions or activities involving the use or disclosure of PHI on behalf of a CE"),
    bullet("Breach: unauthorized acquisition, access, use, or disclosure of PHI that compromises its security or privacy"),
    bullet("HIPAA Rules: the HIPAA Privacy Rule (45 CFR Part 164, Subparts A and E), Security Rule (Subparts A and C), and Breach Notification Rule (Subpart D)"),
    spacer(),

    h1("2. Permitted Uses and Disclosures by BA"),
    p("The BA may use or disclose PHI only:"),
    num("As necessary to perform the services described in the underlying services agreement between the Parties"),
    num("As required by law"),
    num("For BA's proper management and administration, provided disclosures are required by law or the BA obtains reasonable assurances that the recipient will maintain confidentiality"),
    p("The BA shall not use or disclose PHI in a manner that would violate the HIPAA Privacy Rule if done by the CE, except as permitted herein."),
    spacer(),

    h1("3. Safeguards"),
    p("The BA agrees to:"),
    num("Implement and maintain appropriate administrative, physical, and technical safeguards to protect PHI and ePHI in accordance with the HIPAA Security Rule (45 CFR Sections 164.308, 164.310, and 164.312)"),
    num("Encrypt all ePHI at rest (AES-256) and in transit (TLS 1.2+)"),
    num("Implement access controls ensuring only authorized personnel access PHI"),
    num("Maintain a security incident response plan"),
    num("Conduct regular risk assessments and document findings"),
    spacer(),

    h1("4. Breach Notification"),
    p("The BA shall:"),
    num("Notify the CE without unreasonable delay, and no later than 60 calendar days after discovery, of any Breach of Unsecured PHI"),
    num("Include in the notification: (a) the nature of the Breach; (b) PHI involved; (c) individuals affected; (d) steps taken to mitigate; (e) steps taken to prevent recurrence"),
    num("Notify the CE of any Security Incident of which it becomes aware"),
    num("Cooperate fully with the CE in investigating and mitigating any Breach"),
    spacer(),

    h1("5. Subcontractors"),
    p("The BA shall:"),
    num("Ensure any subcontractor that creates, receives, maintains, or transmits PHI on behalf of the BA agrees to the same restrictions and conditions as the BA through a written BAA"),
    num("Remain liable to the CE for acts and omissions of subcontractors to the same extent as for its own acts and omissions"),
    spacer(),

    h1("6. Individual Rights"),
    p("The BA shall:"),
    num("Make PHI available to the CE as necessary for CE to respond to individuals' access requests within 30 days"),
    num("Make PHI available for amendment as directed by the CE"),
    num("Provide an accounting of disclosures as required under 45 CFR Section 164.528"),
    num("Make its internal practices and records relating to PHI available to the Secretary of HHS for compliance review"),
    spacer(),

    h1("7. Term and Termination"),
    h2("7.1 Term"),
    p("This Agreement commences on the Effective Date and continues until the termination of the underlying services agreement, unless earlier terminated."),
    h2("7.2 Termination for Cause"),
    p("Either Party may terminate this Agreement if the other materially breaches any provision, and such breach is not cured within 30 days of written notice."),
    h2("7.3 Effect of Termination"),
    p("Upon termination, the BA shall, at the CE's direction, either return or destroy all PHI received from or created on behalf of the CE. If return or destruction is infeasible, the BA shall extend the protections of this Agreement to such PHI and limit further use or disclosure."),
    spacer(),

    h1("8. Miscellaneous"),
    bullet("Amendment: This Agreement may only be amended by a written instrument signed by both Parties"),
    bullet("Interpretation: Any ambiguity shall be resolved in favor of a meaning that permits the CE to comply with HIPAA"),
    bullet("No Third-Party Beneficiaries: This Agreement does not create rights in any third party"),
    bullet("Survival: Provisions regarding PHI obligations survive termination"),
    spacer(),

    h1("9. Signatures"),
    spacer(),
    new Table({
      width: { size: 10080, type: WidthType.DXA },
      columnWidths: [5040, 5040],
      rows: [
        new TableRow({ children: [
          new TableCell({ width: { size: 5040, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "FOR QLINIQIT (Covered Entity)", bold: true, font: "Arial", size: 20 })] })] }),
          new TableCell({ width: { size: 5040, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "FOR [VENDOR NAME] (Business Associate)", bold: true, font: "Arial", size: 20 })] })] }),
        ]}),
        ...[["Signature:", "Signature:"],["Name:", "Name:"],["Title:", "Title:"],["Date:", "Date:"]].map(([l, r]) =>
          new TableRow({ children: [
            new TableCell({ width: { size: 5040, type: WidthType.DXA },
              borders: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" } },
              margins: { top: 240, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: l, font: "Arial", size: 20, color: GRAY })] })] }),
            new TableCell({ width: { size: 5040, type: WidthType.DXA },
              borders: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" } },
              margins: { top: 240, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: r, font: "Arial", size: 20, color: GRAY })] })] }),
          ]})
        )
      ]
    }),
  ];

  return new Document({ styles, numbering,
    sections: [{ properties: { page: PAGE },
      headers: { default: makeHeader("Business Associate Agreement") },
      footers: { default: makeFooter() },
      children }] });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. COOKIE POLICY
// ═══════════════════════════════════════════════════════════════════════════════
function createCookiePolicy() {
  const children = [
    ...titleBlock("Cookie Policy", "GDPR Compliant", "Effective Date: June 19, 2026"),

    h1("1. What Are Cookies?"),
    p("Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and serve relevant content. Similar technologies include web beacons, pixels, and local storage."),
    spacer(),

    h1("2. Cookies We Use"),
    new Table({
      width: { size: 10080, type: WidthType.DXA },
      columnWidths: [2200, 2200, 3080, 2600],
      rows: [
        new TableRow({ children: ["Category","Name / Provider","Purpose","Duration"].map((h, i) =>
          new TableCell({ shading: { fill: "1A56C4", type: ShadingType.CLEAR },
            width: { size: [2200,2200,3080,2600][i], type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: "FFFFFF", font: "Arial", size: 18 })] })] })
        )}),
        ...[
          ["Essential", "session_id", "Maintains your login session and platform security", "Session"],
          ["Essential", "csrf_token", "Protects against cross-site request forgery attacks", "Session"],
          ["Essential", "cookie_consent", "Stores your cookie preferences", "1 year"],
          ["Functional", "language_pref", "Remembers your language selection (AR/EN)", "1 year"],
          ["Functional", "timezone", "Stores your timezone for accurate appointment scheduling", "1 year"],
          ["Analytics", "Google Analytics (_ga, _gid)", "Anonymized usage statistics to improve the platform", "_ga: 2 years; _gid: 24 hours"],
          ["Marketing", "Platform ads pixel", "Measures effectiveness of our marketing campaigns", "90 days"],
        ].map(([cat, name, purpose, duration], i) =>
          new TableRow({ children: [cat, name, purpose, duration].map((val, j) =>
            new TableCell({ shading: { fill: i % 2 === 0 ? "F8FAFC" : "FFFFFF", type: ShadingType.CLEAR },
              width: { size: [2200,2200,3080,2600][j], type: WidthType.DXA },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: val, font: "Arial", size: 18 })] })] })
          )})
        )
      ]
    }),
    spacer(),

    h1("3. Third-Party Cookies"),
    p("Some cookies are set by third-party services we use:"),
    bullet("Google Analytics (analytics.google.com): measures how users interact with the Platform. Data is anonymized and aggregated. See Google's Privacy Policy at policies.google.com/privacy."),
    bullet("Stripe (stripe.com): payment processing cookies that facilitate secure transactions. See Stripe's Privacy Policy at stripe.com/privacy."),
    bullet("Daily.co (daily.co): video session cookies necessary for telemedicine consultations. See Daily.co's Privacy Policy at daily.co/privacy."),
    spacer(),

    h1("4. Your Choices"),
    h2("4.1 Cookie Consent Banner"),
    p("On your first visit, we display a cookie consent banner. You may accept all cookies or customize your preferences by category. Essential cookies cannot be disabled as they are necessary for the Platform to function."),
    h2("4.2 Managing Cookies in Your Browser"),
    p("You can control and delete cookies through your browser settings:"),
    bullet("Chrome: Settings > Privacy and security > Cookies and other site data"),
    bullet("Firefox: Settings > Privacy & Security > Cookies and Site Data"),
    bullet("Safari: Preferences > Privacy > Manage Website Data"),
    bullet("Edge: Settings > Cookies and site permissions > Cookies and site data"),
    p("Please note that disabling cookies may affect the functionality of the Platform."),
    h2("4.3 Opting Out of Analytics"),
    p("You may opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on, available at tools.google.com/dlpage/gaoptout."),
    spacer(),

    h1("5. Updates to This Policy"),
    p("We may update this Cookie Policy to reflect changes in the cookies we use or for legal, operational, or regulatory reasons. We will notify you of material changes via the Platform or by email."),
    spacer(),

    h1("6. Contact"),
    p("For questions about our use of cookies, contact us at aiman@hu.edu.jo | www.qliniqit.com"),
  ];

  return new Document({ styles, numbering,
    sections: [{ properties: { page: PAGE },
      headers: { default: makeHeader("Cookie Policy") },
      footers: { default: makeFooter() },
      children }] });
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE ALL
// ═══════════════════════════════════════════════════════════════════════════════
async function main() {
  const docs = [
    { fn: createPrivacyPolicy, name: "privacy-policy.docx" },
    { fn: createTermsOfService, name: "terms-of-service.docx" },
    { fn: createProviderAgreement, name: "provider-agreement.docx" },
    { fn: createMemberConsent, name: "member-consent.docx" },
    { fn: createBAA, name: "baa-template.docx" },
    { fn: createCookiePolicy, name: "cookie-policy.docx" },
  ];

  for (const { fn, name } of docs) {
    const doc = fn();
    const buffer = await Packer.toBuffer(doc);
    const outPath = path.join(OUT, name);
    fs.writeFileSync(outPath, buffer);
    console.log(`✅ ${name} (${Math.round(buffer.length / 1024)}KB)`);
  }
  console.log('\nAll documents saved to /Users/xsray/qliniqit-v2/legal/');
}

main().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
