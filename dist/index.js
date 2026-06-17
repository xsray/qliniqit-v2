var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc10) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc10 = __getOwnPropDesc(from, key)) || desc10.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/_core/env.ts
var env_exports = {};
__export(env_exports, {
  ENV: () => ENV
});
import { z } from "zod";
function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((i) => `  \u2022 ${i.path.join(".")}: ${i.message}`).join("\n");
    console.error(`
\u274C Invalid environment variables:
${missing}
`);
    process.exit(1);
  }
  return result.data;
}
var envSchema, ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    envSchema = z.object({
      NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
      PORT: z.coerce.number().default(3e3),
      // Database
      DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
      // Auth — Supabase
      SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
      SUPABASE_JWT_SECRET: z.string().min(32, "SUPABASE_JWT_SECRET must be at least 32 chars"),
      // App secrets
      JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 chars"),
      CRON_SECRET: z.string().min(16, "CRON_SECRET is required"),
      UNSUBSCRIBE_SECRET: z.string().min(16, "UNSUBSCRIBE_SECRET is required"),
      // Stripe
      STRIPE_SECRET_KEY: z.string().startsWith("sk_", "STRIPE_SECRET_KEY must start with sk_"),
      STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
      // Storage (S3-compatible)
      AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
      AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
      AWS_REGION: z.string().default("us-east-1"),
      AWS_S3_BUCKET: z.string().min(1, "AWS_S3_BUCKET is required"),
      // Optional services
      OPENAI_API_KEY: z.string().optional(),
      RESEND_API_KEY: z.string().optional(),
      TWILIO_ACCOUNT_SID: z.string().optional(),
      TWILIO_AUTH_TOKEN: z.string().optional(),
      TWILIO_FROM_NUMBER: z.string().optional(),
      DAILY_API_KEY: z.string().optional(),
      MUX_TOKEN_ID: z.string().optional(),
      MUX_TOKEN_SECRET: z.string().optional(),
      FIREBASE_PROJECT_ID: z.string().optional(),
      FIREBASE_CLIENT_EMAIL: z.string().optional(),
      FIREBASE_PRIVATE_KEY: z.string().optional(),
      // Client-side vars (passed through vite)
      VITE_SUPABASE_URL: z.string().url().optional(),
      VITE_SUPABASE_ANON_KEY: z.string().optional(),
      VITE_APP_URL: z.string().url().default("http://localhost:3000")
    });
    ENV = validateEnv();
  }
});

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  aiInteractions: () => aiInteractions,
  appointmentDocuments: () => appointmentDocuments,
  appointmentPackages: () => appointmentPackages,
  appointmentStatusEnum: () => appointmentStatusEnum,
  appointmentSummaries: () => appointmentSummaries,
  appointmentSurveys: () => appointmentSurveys,
  appointmentTypeEnum: () => appointmentTypeEnum,
  appointments: () => appointments,
  auditLogs: () => auditLogs,
  availabilitySlots: () => availabilitySlots,
  availabilityTemplates: () => availabilityTemplates,
  billingPeriodEnum: () => billingPeriodEnum,
  channelEnum: () => channelEnum,
  clinicGroupMembers: () => clinicGroupMembers,
  complianceFrameworkEnum: () => complianceFrameworkEnum,
  consentRecords: () => consentRecords,
  consentStatusEnum: () => consentStatusEnum,
  consentTypeEnum: () => consentTypeEnum,
  conversations: () => conversations,
  coupons: () => coupons,
  creditPacks: () => creditPacks,
  creditTransactions: () => creditTransactions,
  cronLogs: () => cronLogs,
  dealCategoryEnum: () => dealCategoryEnum,
  dealClaims: () => dealClaims,
  dealStatusEnum: () => dealStatusEnum,
  deals: () => deals,
  deletionRequests: () => deletionRequests,
  deliveryStatusEnum: () => deliveryStatusEnum,
  epidemicAlertsCache: () => epidemicAlertsCache,
  eventRegistrations: () => eventRegistrations,
  events: () => events,
  familyMembers: () => familyMembers,
  flaggedReviews: () => flaggedReviews,
  frequencyEnum: () => frequencyEnum,
  genderEnum: () => genderEnum,
  healthGoals: () => healthGoals,
  healthRecords: () => healthRecords,
  healthScores: () => healthScores,
  insuranceProviders: () => insuranceProviders,
  legalBasisEnum: () => legalBasisEnum,
  loyaltyPoints: () => loyaltyPoints,
  loyaltyTierEnum: () => loyaltyTierEnum,
  loyaltyTransactions: () => loyaltyTransactions,
  marketConfigs: () => marketConfigs,
  marketWaitlist: () => marketWaitlist,
  medicationLogs: () => medicationLogs,
  medications: () => medications,
  messages: () => messages,
  moderationStatusEnum: () => moderationStatusEnum,
  noShowDisputes: () => noShowDisputes,
  notificationPreferences: () => notificationPreferences,
  notificationTypeEnum: () => notificationTypeEnum,
  notifications: () => notifications,
  patientInsurance: () => patientInsurance,
  patientPackages: () => patientPackages,
  paymentGatewayEnum: () => paymentGatewayEnum,
  paymentStatusEnum: () => paymentStatusEnum,
  payoutRequests: () => payoutRequests,
  platformSettings: () => platformSettings,
  prescriptionRefills: () => prescriptionRefills,
  prescriptions: () => prescriptions,
  providerBadges: () => providerBadges,
  providerBlackoutDates: () => providerBlackoutDates,
  providerCalendarTokens: () => providerCalendarTokens,
  providerClinics: () => providerClinics,
  providerCredits: () => providerCredits,
  providerInsurances: () => providerInsurances,
  providerPatientReferrals: () => providerPatientReferrals,
  providerProfileViews: () => providerProfileViews,
  providerProfiles: () => providerProfiles,
  providerReels: () => providerReels,
  providerScheduleTemplateSlots: () => providerScheduleTemplateSlots,
  providerScheduleTemplates: () => providerScheduleTemplates,
  providerSubscriptions: () => providerSubscriptions,
  providerTrustScores: () => providerTrustScores,
  providerTypeEnum: () => providerTypeEnum,
  providerVerifications: () => providerVerifications,
  pushTokens: () => pushTokens,
  recordingAccessLog: () => recordingAccessLog,
  recordingConsentLog: () => recordingConsentLog,
  recordingStatusEnum: () => recordingStatusEnum,
  reelComments: () => reelComments,
  reelLikes: () => reelLikes,
  reelReports: () => reelReports,
  referrals: () => referrals,
  rescheduleRequests: () => rescheduleRequests,
  reviews: () => reviews,
  roleEnum: () => roleEnum,
  satisfactionSurveys: () => satisfactionSurveys,
  savedProviders: () => savedProviders,
  searchLogs: () => searchLogs,
  slotHolds: () => slotHolds,
  specialties: () => specialties,
  sponsorInquiries: () => sponsorInquiries,
  sponsoredListings: () => sponsoredListings,
  stockWatchlist: () => stockWatchlist,
  subscriptionPlans: () => subscriptionPlans,
  subscriptionStatusEnum: () => subscriptionStatusEnum,
  teleconsultations: () => teleconsultations,
  trustTierEnum: () => trustTierEnum,
  userCoupons: () => userCoupons,
  userCreditTransactions: () => userCreditTransactions,
  userCredits: () => userCredits,
  users: () => users,
  verificationStatusEnum: () => verificationStatusEnum,
  visitNotes: () => visitNotes,
  waitingRoomStatus: () => waitingRoomStatus,
  waitlist: () => waitlist
});
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  jsonb,
  index,
  uniqueIndex,
  smallint,
  serial
} from "drizzle-orm/pg-core";
var roleEnum, genderEnum, verificationStatusEnum, appointmentStatusEnum, appointmentTypeEnum, paymentStatusEnum, notificationTypeEnum, channelEnum, deliveryStatusEnum, providerTypeEnum, subscriptionStatusEnum, billingPeriodEnum, consentTypeEnum, legalBasisEnum, consentStatusEnum, dealStatusEnum, dealCategoryEnum, trustTierEnum, loyaltyTierEnum, moderationStatusEnum, recordingStatusEnum, frequencyEnum, complianceFrameworkEnum, paymentGatewayEnum, users, marketConfigs, specialties, providerProfiles, providerVerifications, availabilitySlots, appointments, rescheduleRequests, reviews, providerReels, reelLikes, reelComments, familyMembers, healthRecords, healthScores, subscriptionPlans, providerSubscriptions, notifications, notificationPreferences, teleconsultations, aiInteractions, conversations, messages, savedProviders, auditLogs, consentRecords, cronLogs, recordingConsentLog, recordingAccessLog, deletionRequests, platformSettings, slotHolds, noShowDisputes, appointmentSummaries, prescriptions, visitNotes, insuranceProviders, patientInsurance, providerClinics, clinicGroupMembers, satisfactionSurveys, providerBadges, providerTrustScores, prescriptionRefills, waitlist, waitingRoomStatus, appointmentPackages, patientPackages, appointmentDocuments, providerBlackoutDates, referrals, providerScheduleTemplates, providerScheduleTemplateSlots, medications, medicationLogs, providerPatientReferrals, healthGoals, deals, dealClaims, loyaltyPoints, loyaltyTransactions, sponsoredListings, providerCredits, creditTransactions, userCredits, userCreditTransactions, creditPacks, coupons, userCoupons, events, eventRegistrations, sponsorInquiries, marketWaitlist, providerProfileViews, flaggedReviews, reelReports, payoutRequests, pushTokens, providerInsurances, appointmentSurveys, epidemicAlertsCache, stockWatchlist, searchLogs, providerCalendarTokens, availabilityTemplates;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    roleEnum = pgEnum("role", ["user", "provider", "admin"]);
    genderEnum = pgEnum("gender", ["male", "female", "other"]);
    verificationStatusEnum = pgEnum("verification_status", ["pending", "verified", "rejected"]);
    appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "completed", "cancelled", "no_show"]);
    appointmentTypeEnum = pgEnum("appointment_type", ["in_clinic", "teleconsultation"]);
    paymentStatusEnum = pgEnum("payment_status", ["unpaid", "pending", "paid", "refunded"]);
    notificationTypeEnum = pgEnum("notification_type", [
      "booking_confirmed",
      "booking_reminder",
      "booking_cancelled",
      "review_request",
      "message_received",
      "system_announcement",
      "provider_update",
      "subscription_update",
      "new_booking",
      "package_expiry",
      "package_renewal_reminder",
      "refill_request",
      "refill_response",
      "monthly_earnings_summary"
    ]);
    channelEnum = pgEnum("channel", ["in_app", "email", "sms", "push", "whatsapp"]);
    deliveryStatusEnum = pgEnum("delivery_status", ["pending", "sent", "delivered", "failed"]);
    providerTypeEnum = pgEnum("provider_type", [
      "doctor",
      "clinic",
      "hospital",
      "pharmacy",
      "drug_store",
      "medical_supplier",
      "lab",
      "physiotherapy_center",
      "nutrition_center",
      "dental_clinic",
      "optical_center",
      "home_care",
      "ambulance",
      "medical_device",
      "insurance",
      "other"
    ]);
    subscriptionStatusEnum = pgEnum("subscription_status", ["active", "past_due", "cancelled", "trialing"]);
    billingPeriodEnum = pgEnum("billing_period", ["monthly", "annual"]);
    consentTypeEnum = pgEnum("consent_type", [
      "data_processing",
      "marketing",
      "telemedicine",
      "data_sharing_third_party",
      "analytics",
      "push_notifications",
      "sms_notifications",
      "whatsapp_notifications",
      "health_records_access",
      "ai_processing"
    ]);
    legalBasisEnum = pgEnum("legal_basis", [
      "consent",
      "contract",
      "legal_obligation",
      "vital_interests",
      "public_task",
      "legitimate_interests"
    ]);
    consentStatusEnum = pgEnum("consent_status", ["granted", "withdrawn", "pending"]);
    dealStatusEnum = pgEnum("deal_status", ["draft", "active", "paused", "expired", "sold_out"]);
    dealCategoryEnum = pgEnum("deal_category", [
      "consultation",
      "lab_test",
      "imaging",
      "dental",
      "physiotherapy",
      "wellness",
      "cosmetic",
      "pharmacy",
      "vaccination",
      "checkup",
      "other"
    ]);
    trustTierEnum = pgEnum("trust_tier", ["standard", "verified", "elite"]);
    loyaltyTierEnum = pgEnum("loyalty_tier", ["bronze", "silver", "gold", "platinum"]);
    moderationStatusEnum = pgEnum("moderation_status", ["pending", "approved", "flagged", "removed"]);
    recordingStatusEnum = pgEnum("recording_status", ["none", "processing", "ready", "failed", "expired"]);
    frequencyEnum = pgEnum("frequency", ["once_daily", "twice_daily", "three_times_daily", "four_times_daily", "weekly", "as_needed"]);
    complianceFrameworkEnum = pgEnum("compliance_framework", ["gdpr", "uk_gdpr", "pdpl_jordan", "hipaa", "generic"]);
    paymentGatewayEnum = pgEnum("payment_gateway", ["stripe", "stripe_plus_hyperpay"]);
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      supabaseUid: varchar("supabase_uid", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      phone: varchar("phone", { length: 32 }),
      avatarUrl: text("avatar_url"),
      role: roleEnum("role").default("user").notNull(),
      countryCode: varchar("country_code", { length: 2 }).default("JO"),
      locale: varchar("locale", { length: 10 }).default("en"),
      timezone: varchar("timezone", { length: 64 }).default("Asia/Amman"),
      dateOfBirth: varchar("date_of_birth", { length: 10 }),
      gender: genderEnum("gender"),
      city: varchar("city", { length: 100 }),
      isActive: boolean("is_active").default(true).notNull(),
      smsOptedOut: boolean("sms_opted_out").default(false),
      preferredJurisdiction: varchar("preferred_jurisdiction", { length: 10 }),
      noShowCount: integer("no_show_count").default(0).notNull(),
      referralSource: varchar("referral_source", { length: 255 }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
      lastSignedIn: timestamp("last_signed_in").defaultNow().notNull()
    });
    marketConfigs = pgTable("market_configs", {
      id: serial("id").primaryKey(),
      countryCode: varchar("country_code", { length: 2 }).notNull().unique(),
      countryNameEn: varchar("country_name_en", { length: 100 }).notNull(),
      countryNameLocal: varchar("country_name_local", { length: 100 }),
      defaultLocale: varchar("default_locale", { length: 10 }).default("en"),
      currencyCode: varchar("currency_code", { length: 3 }).default("USD"),
      currencySymbol: varchar("currency_symbol", { length: 5 }).default("$"),
      timezone: varchar("timezone", { length: 64 }).default("UTC"),
      complianceFramework: complianceFrameworkEnum("compliance_framework").default("gdpr"),
      notificationChannels: jsonb("notification_channels").$type(),
      paymentGateway: paymentGatewayEnum("payment_gateway").default("stripe"),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    specialties = pgTable("specialties", {
      id: serial("id").primaryKey(),
      nameEn: varchar("name_en", { length: 100 }).notNull(),
      nameAr: varchar("name_ar", { length: 100 }),
      slug: varchar("slug", { length: 120 }).notNull().unique(),
      iconUrl: text("icon_url"),
      parentId: integer("parent_id"),
      sortOrder: integer("sort_order").default(0),
      isActive: boolean("is_active").default(true).notNull()
    });
    providerProfiles = pgTable("provider_profiles", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().unique(),
      specialtyId: integer("specialty_id"),
      licenseNumber: varchar("license_number", { length: 50 }),
      licenceJurisdiction: varchar("licence_jurisdiction", { length: 10 }),
      npiNumber: varchar("npi_number", { length: 20 }),
      scfhsNumber: varchar("scfhs_number", { length: 30 }),
      dhaNumber: varchar("dha_number", { length: 30 }),
      mohNumber: varchar("moh_number", { length: 30 }),
      euProfQualRef: varchar("eu_prof_qual_ref", { length: 60 }),
      verificationStatus: verificationStatusEnum("verification_status").default("pending"),
      displayNameAr: varchar("display_name_ar", { length: 200 }),
      bio: text("bio"),
      bioAr: text("bio_ar"),
      specialtyDescriptionAr: text("specialty_description_ar"),
      education: jsonb("education").$type(),
      experienceYears: integer("experience_years").default(0),
      consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }),
      currencyCode: varchar("currency_code", { length: 3 }).default("USD"),
      languages: jsonb("languages").$type(),
      acceptedInsurance: jsonb("accepted_insurance").$type(),
      officeAddress: text("office_address"),
      city: varchar("city", { length: 100 }),
      countryCode: varchar("country_code", { length: 2 }),
      lat: decimal("lat", { precision: 10, scale: 7 }),
      lng: decimal("lng", { precision: 10, scale: 7 }),
      workingHours: jsonb("working_hours").$type(),
      ratingAvg: decimal("rating_avg", { precision: 3, scale: 2 }).default("0"),
      reviewCount: integer("review_count").default(0),
      providerType: providerTypeEnum("provider_type").default("doctor"),
      isFeatured: boolean("is_featured").default(false),
      slug: varchar("slug", { length: 200 }).unique(),
      galleryUrls: jsonb("gallery_urls").$type(),
      offersVideo: boolean("offers_video").default(false).notNull(),
      enableRecording: boolean("enable_recording").default(true).notNull(),
      cancellationWindowHours: integer("cancellation_window_hours").default(24).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      completenessEmailSent: boolean("completeness_email_sent").default(false).notNull(),
      onboardingCompletedSteps: jsonb("onboarding_completed_steps").$type(),
      avgResponseHours: decimal("avg_response_hours", { precision: 6, scale: 2 }),
      monthlyEarningsGoal: decimal("monthly_earnings_goal", { precision: 10, scale: 2 }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_provider_country").on(t2.countryCode),
      index("idx_provider_specialty").on(t2.specialtyId)
    ]);
    providerVerifications = pgTable("provider_verifications", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      documentType: varchar("document_type", { length: 32 }).notNull(),
      fileUrl: text("file_url").notNull(),
      status: varchar("status", { length: 16 }).default("pending"),
      reviewedBy: integer("reviewed_by"),
      reviewedAt: timestamp("reviewed_at"),
      rejectionReason: text("rejection_reason"),
      expiresAt: timestamp("expires_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    availabilitySlots = pgTable("availability_slots", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      clinicId: integer("clinic_id"),
      dayOfWeek: smallint("day_of_week"),
      specificDate: varchar("specific_date", { length: 10 }),
      startTime: varchar("start_time", { length: 5 }).notNull(),
      endTime: varchar("end_time", { length: 5 }).notNull(),
      slotDurationMin: integer("slot_duration_min").default(30),
      isBlocked: boolean("is_blocked").default(false),
      isRecurring: boolean("is_recurring").default(true),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_slot_provider").on(t2.providerId)]);
    appointments = pgTable("appointments", {
      id: serial("id").primaryKey(),
      patientId: integer("patient_id").notNull(),
      providerId: integer("provider_id").notNull(),
      slotStart: timestamp("slot_start").notNull(),
      slotEnd: timestamp("slot_end").notNull(),
      status: appointmentStatusEnum("status").default("pending"),
      type: appointmentTypeEnum("type").default("in_clinic"),
      bookingSource: varchar("booking_source", { length: 16 }).default("web"),
      patientTimezone: varchar("patient_timezone", { length: 64 }),
      providerTimezone: varchar("provider_timezone", { length: 64 }),
      cancellationReason: text("cancellation_reason"),
      cancelledBy: varchar("cancelled_by", { length: 16 }),
      rescheduleReason: text("reschedule_reason"),
      rescheduledFrom: integer("rescheduled_from"),
      reminder24hSent: boolean("reminder_24h_sent").default(false),
      reminder24hSentAt: timestamp("reminder_24h_sent_at"),
      reminder1hSent: boolean("reminder_1h_sent").default(false),
      reminder1hSentAt: timestamp("reminder_1h_sent_at"),
      videoCallUrl: varchar("video_call_url", { length: 512 }),
      notes: text("notes"),
      paymentStatus: paymentStatusEnum("payment_status").default("unpaid"),
      stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
      stripeSessionId: varchar("stripe_session_id", { length: 255 }),
      stripeReceiptUrl: varchar("stripe_receipt_url", { length: 1024 }),
      familyMemberId: integer("family_member_id"),
      patientConsentedToRecording: boolean("patient_consented_to_recording").default(false),
      consentedAt: timestamp("consented_at"),
      reminderLeadTime: varchar("reminder_lead_time", { length: 8 }).default("24h"),
      smartReminderSent: boolean("smart_reminder_sent").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_appt_patient").on(t2.patientId),
      index("idx_appt_provider").on(t2.providerId),
      index("idx_appt_status").on(t2.status),
      index("idx_appt_slot_start").on(t2.slotStart)
    ]);
    rescheduleRequests = pgTable("reschedule_requests", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull(),
      requestedBy: integer("requested_by").notNull(),
      newDate: varchar("new_date", { length: 10 }).notNull(),
      newTime: varchar("new_time", { length: 8 }).notNull(),
      reason: text("reason"),
      status: varchar("status", { length: 16 }).default("pending"),
      respondedAt: timestamp("responded_at"),
      declineReason: text("decline_reason"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_reschedule_appt").on(t2.appointmentId),
      index("idx_reschedule_patient").on(t2.requestedBy)
    ]);
    reviews = pgTable("reviews", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull().unique(),
      patientId: integer("patient_id").notNull(),
      providerId: integer("provider_id").notNull(),
      rating: smallint("rating").notNull(),
      comment: text("comment"),
      aspects: jsonb("aspects").$type(),
      providerResponse: text("provider_response"),
      providerResponseAt: timestamp("provider_response_at"),
      isVisible: boolean("is_visible").default(true),
      moderationStatus: moderationStatusEnum("moderation_status").default("pending"),
      moderationNote: text("moderation_note"),
      moderatedAt: timestamp("moderated_at"),
      moderatedBy: integer("moderated_by"),
      aiModerationScore: integer("ai_moderation_score"),
      isVerifiedAppointment: boolean("is_verified_appointment").default(true),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_review_provider").on(t2.providerId)]);
    providerReels = pgTable("provider_reels", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      muxUploadId: varchar("mux_upload_id", { length: 100 }),
      muxAssetId: varchar("mux_asset_id", { length: 100 }),
      muxPlaybackId: varchar("mux_playback_id", { length: 100 }),
      uploadStatus: varchar("upload_status", { length: 20 }).default("waiting"),
      videoUrl: text("video_url"),
      sourceUrl: text("source_url"),
      sourcePlatform: varchar("source_platform", { length: 16 }).default("upload"),
      thumbnailUrl: text("thumbnail_url"),
      caption: text("caption"),
      captionAr: text("caption_ar"),
      category: varchar("category", { length: 32 }).default("other"),
      durationSeconds: integer("duration_seconds"),
      viewCount: integer("view_count").default(0),
      likeCount: integer("like_count").default(0),
      isActive: boolean("is_active").default(true),
      isFeatured: boolean("is_featured").default(false),
      moderationStatus: varchar("moderation_status", { length: 16 }).default("pending"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_reel_provider").on(t2.providerId)]);
    reelLikes = pgTable("reel_likes", {
      id: serial("id").primaryKey(),
      reelId: integer("reel_id").notNull(),
      userId: integer("user_id").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [uniqueIndex("idx_reel_like_unique").on(t2.reelId, t2.userId)]);
    reelComments = pgTable("reel_comments", {
      id: serial("id").primaryKey(),
      reelId: integer("reel_id").notNull(),
      userId: integer("user_id").notNull(),
      comment: text("comment").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_reel_comment").on(t2.reelId)]);
    familyMembers = pgTable("family_members", {
      id: serial("id").primaryKey(),
      primaryUserId: integer("primary_user_id").notNull(),
      name: varchar("name", { length: 100 }).notNull(),
      relationship: varchar("relationship", { length: 16 }).notNull(),
      dateOfBirth: varchar("date_of_birth", { length: 10 }),
      gender: genderEnum("gender"),
      medicalNotes: text("medical_notes"),
      avatarUrl: text("avatar_url"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_family_primary").on(t2.primaryUserId)]);
    healthRecords = pgTable("health_records", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      familyMemberId: integer("family_member_id"),
      recordType: varchar("record_type", { length: 32 }).notNull(),
      title: varchar("title", { length: 200 }).notNull(),
      description: text("description"),
      fileUrls: jsonb("file_urls").$type(),
      fileKeys: jsonb("file_keys").$type(),
      providerId: integer("provider_id"),
      recordDate: varchar("record_date", { length: 10 }),
      isSharedWithProvider: boolean("is_shared_with_provider").default(false),
      sharedWithProviders: jsonb("shared_with_providers").$type(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_record_user").on(t2.userId)]);
    healthScores = pgTable("health_scores", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().unique(),
      score: smallint("score").default(0),
      breakdown: jsonb("breakdown").$type(),
      streakDays: integer("streak_days").default(0),
      level: loyaltyTierEnum("level").default("bronze"),
      answersJson: jsonb("answers_json"),
      calculatedAt: timestamp("calculated_at").defaultNow(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    subscriptionPlans = pgTable("subscription_plans", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 32 }).notNull().unique(),
      displayName: varchar("display_name", { length: 100 }).notNull(),
      priceMonthly: jsonb("price_monthly").$type(),
      priceAnnual: jsonb("price_annual").$type(),
      features: jsonb("features").$type(),
      limits: jsonb("limits").$type(),
      stripePriceIdMonthly: varchar("stripe_price_id_monthly", { length: 100 }),
      stripePriceIdAnnual: varchar("stripe_price_id_annual", { length: 100 }),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    providerSubscriptions = pgTable("provider_subscriptions", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      planId: integer("plan_id").notNull(),
      stripeSubscriptionId: varchar("stripe_subscription_id", { length: 100 }),
      stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
      status: subscriptionStatusEnum("status").default("trialing"),
      billingPeriod: billingPeriodEnum("billing_period").default("monthly"),
      currentPeriodStart: timestamp("current_period_start"),
      currentPeriodEnd: timestamp("current_period_end"),
      cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      type: notificationTypeEnum("type").notNull(),
      title: varchar("title", { length: 200 }).notNull(),
      body: text("body"),
      data: jsonb("data"),
      channel: channelEnum("channel").default("in_app"),
      deliveryStatus: deliveryStatusEnum("delivery_status").default("pending"),
      readAt: timestamp("read_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_notif_user").on(t2.userId)]);
    notificationPreferences = pgTable("notification_preferences", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      channel: channelEnum("channel").notNull(),
      category: varchar("category", { length: 32 }).notNull(),
      enabled: boolean("enabled").default(true),
      remind24hOptOut: boolean("remind_24h_opt_out").default(false),
      remind1hOptOut: boolean("remind_1h_opt_out").default(false),
      providerRemind24hOptOut: boolean("provider_remind_24h_opt_out").default(false),
      providerRemind1hOptOut: boolean("provider_remind_1h_opt_out").default(false),
      whatsappOptInConfirmedAt: timestamp("whatsapp_opt_in_confirmed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [uniqueIndex("idx_notif_pref_unique").on(t2.userId, t2.channel, t2.category)]);
    teleconsultations = pgTable("teleconsultations", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull().unique(),
      roomUrl: text("room_url"),
      roomName: varchar("room_name", { length: 100 }),
      startedAt: timestamp("started_at"),
      endedAt: timestamp("ended_at"),
      durationMinutes: integer("duration_minutes"),
      recordingUrl: text("recording_url"),
      recordingStatus: recordingStatusEnum("recording_status").default("none"),
      recordingExpiresAt: timestamp("recording_expires_at"),
      recordingId: varchar("recording_id", { length: 128 }),
      status: varchar("status", { length: 16 }).default("scheduled"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    aiInteractions = pgTable("ai_interactions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      interactionType: varchar("interaction_type", { length: 32 }).notNull(),
      inputText: text("input_text").notNull(),
      responseText: text("response_text"),
      recommendedSpecialties: jsonb("recommended_specialties").$type(),
      recommendedProviders: jsonb("recommended_providers").$type(),
      tokensUsed: integer("tokens_used"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_ai_user").on(t2.userId)]);
    conversations = pgTable("conversations", {
      id: serial("id").primaryKey(),
      patientId: integer("patient_id").notNull(),
      providerId: integer("provider_id").notNull(),
      lastMessageAt: timestamp("last_message_at"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [uniqueIndex("idx_conv_unique").on(t2.patientId, t2.providerId)]);
    messages = pgTable("messages", {
      id: serial("id").primaryKey(),
      conversationId: integer("conversation_id").notNull(),
      senderId: integer("sender_id").notNull(),
      contentType: varchar("content_type", { length: 8 }).default("text"),
      content: text("content"),
      fileUrl: text("file_url"),
      isRead: boolean("is_read").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_msg_conv").on(t2.conversationId)]);
    savedProviders = pgTable("saved_providers", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      providerId: integer("provider_id").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [uniqueIndex("idx_saved_unique").on(t2.userId, t2.providerId)]);
    auditLogs = pgTable("audit_logs", {
      id: serial("id").primaryKey(),
      userId: integer("user_id"),
      action: varchar("action", { length: 64 }).notNull(),
      resourceType: varchar("resource_type", { length: 64 }),
      resourceId: varchar("resource_id", { length: 64 }),
      ipAddress: varchar("ip_address", { length: 64 }),
      userAgent: text("user_agent"),
      metadata: jsonb("metadata"),
      countryCode: varchar("country_code", { length: 2 }),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_audit_user").on(t2.userId), index("idx_audit_created").on(t2.createdAt)]);
    consentRecords = pgTable("consent_records", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      supabaseUid: varchar("supabase_uid", { length: 64 }),
      consentType: consentTypeEnum("consent_type").notNull(),
      status: consentStatusEnum("status").notNull().default("pending"),
      legalBasis: legalBasisEnum("legal_basis").notNull().default("consent"),
      policyVersion: varchar("policy_version", { length: 32 }).notNull().default("1.0"),
      description: text("description"),
      ipAddress: varchar("ip_address", { length: 64 }),
      userAgent: text("user_agent"),
      countryCode: varchar("country_code", { length: 2 }),
      market: varchar("market", { length: 10 }),
      granted: boolean("granted"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      withdrawnAt: timestamp("withdrawn_at")
    }, (t2) => [
      index("idx_consent_user").on(t2.userId),
      index("idx_consent_type").on(t2.consentType, t2.status)
    ]);
    cronLogs = pgTable("cron_logs", {
      id: serial("id").primaryKey(),
      jobName: varchar("job_name", { length: 100 }).notNull(),
      ranAt: timestamp("ran_at").defaultNow().notNull(),
      status: varchar("status", { length: 16 }).notNull(),
      durationMs: integer("duration_ms"),
      result: jsonb("result").$type(),
      errorMessage: text("error_message")
    }, (t2) => [
      index("idx_cron_logs_job").on(t2.jobName),
      index("idx_cron_logs_ran").on(t2.ranAt)
    ]);
    recordingConsentLog = pgTable("recording_consent_log", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull(),
      userId: integer("user_id").notNull(),
      action: varchar("action", { length: 8 }).notNull(),
      consentedBy: varchar("consented_by", { length: 20 }).default("patient").notNull(),
      ipAddress: varchar("ip_address", { length: 45 }),
      userAgent: varchar("user_agent", { length: 512 }),
      expiresAt: timestamp("expires_at"),
      autoRevoked: boolean("auto_revoked").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_rcl_appointment").on(t2.appointmentId),
      index("idx_rcl_user").on(t2.userId)
    ]);
    recordingAccessLog = pgTable("recording_access_log", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull(),
      teleconsultationId: integer("teleconsultation_id"),
      accessedByUserId: integer("accessed_by_user_id").notNull(),
      accessedByRole: roleEnum("accessed_by_role").notNull(),
      ipAddress: varchar("ip_address", { length: 45 }),
      userAgent: text("user_agent"),
      accessedAt: timestamp("accessed_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_ral_appointment").on(t2.appointmentId),
      index("idx_ral_user").on(t2.accessedByUserId)
    ]);
    deletionRequests = pgTable("deletion_requests", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      reason: text("reason"),
      status: varchar("status", { length: 16 }).notNull().default("pending"),
      requestedAt: timestamp("requested_at").defaultNow().notNull(),
      processedAt: timestamp("processed_at"),
      processedBy: integer("processed_by"),
      adminNotes: text("admin_notes")
    }, (t2) => [
      index("idx_dr_user").on(t2.userId),
      index("idx_dr_status").on(t2.status)
    ]);
    platformSettings = pgTable("platform_settings", {
      id: serial("id").primaryKey(),
      key: varchar("key", { length: 128 }).notNull().unique(),
      value: text("value").notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
      updatedBy: integer("updated_by")
    });
    slotHolds = pgTable("slot_holds", {
      id: serial("id").primaryKey(),
      patientId: integer("patient_id").notNull(),
      providerId: integer("provider_id").notNull(),
      slotStart: timestamp("slot_start").notNull(),
      slotEnd: timestamp("slot_end").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      status: varchar("status", { length: 16 }).default("active").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_sh_provider_slot").on(t2.providerId, t2.slotStart),
      index("idx_sh_expires").on(t2.expiresAt)
    ]);
    noShowDisputes = pgTable("no_show_disputes", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull(),
      patientId: integer("patient_id").notNull(),
      reason: text("reason").notNull(),
      status: varchar("status", { length: 16 }).default("pending").notNull(),
      adminNote: text("admin_note"),
      resolvedAt: timestamp("resolved_at"),
      resolvedBy: integer("resolved_by"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_nsd_patient").on(t2.patientId),
      index("idx_nsd_status").on(t2.status)
    ]);
    appointmentSummaries = pgTable("appointment_summaries", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull().unique(),
      patientId: integer("patient_id").notNull(),
      providerId: integer("provider_id").notNull(),
      subjective: text("subjective").notNull(),
      objective: text("objective").notNull(),
      assessment: text("assessment").notNull(),
      plan: text("plan").notNull(),
      rawSummary: text("raw_summary"),
      emailSentAt: timestamp("email_sent_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    prescriptions = pgTable("prescriptions", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull(),
      patientId: integer("patient_id").notNull(),
      providerId: integer("provider_id").notNull(),
      type: varchar("type", { length: 16 }).notNull().default("prescription"),
      diagnosis: text("diagnosis").notNull(),
      medications: jsonb("medications").notNull().$type(),
      referralSpecialty: varchar("referral_specialty", { length: 120 }),
      referralReason: text("referral_reason"),
      notes: text("notes"),
      pdfUrl: varchar("pdf_url", { length: 500 }),
      pdfKey: varchar("pdf_key", { length: 300 }),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_rx_patient").on(t2.patientId),
      index("idx_rx_provider").on(t2.providerId)
    ]);
    visitNotes = pgTable("visit_notes", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull(),
      providerId: integer("provider_id").notNull(),
      patientId: integer("patient_id").notNull(),
      chiefComplaint: text("chief_complaint"),
      diagnosis: text("diagnosis"),
      treatmentPlan: text("treatment_plan"),
      prescriptions: text("prescriptions"),
      followUpDate: varchar("follow_up_date", { length: 10 }),
      followUpNotes: text("follow_up_notes"),
      isSharedWithPatient: boolean("is_shared_with_patient").default(false).notNull(),
      sharedAt: timestamp("shared_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_vn_appointment").on(t2.appointmentId),
      index("idx_vn_provider").on(t2.providerId),
      index("idx_vn_patient").on(t2.patientId)
    ]);
    insuranceProviders = pgTable("insurance_providers", {
      id: serial("id").primaryKey(),
      nameEn: varchar("name_en", { length: 100 }).notNull(),
      nameLocal: varchar("name_local", { length: 100 }),
      logoUrl: text("logo_url"),
      countryCode: varchar("country_code", { length: 2 }).notNull(),
      isActive: boolean("is_active").default(true)
    });
    patientInsurance = pgTable("patient_insurance", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      insuranceProviderId: integer("insurance_provider_id").notNull(),
      membershipNumber: varchar("membership_number", { length: 100 }).notNull(),
      holderName: varchar("holder_name", { length: 150 }),
      expiryDate: varchar("expiry_date", { length: 10 }),
      frontImageUrl: text("front_image_url"),
      backImageUrl: text("back_image_url"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_pi_user").on(t2.userId)]);
    providerClinics = pgTable("provider_clinics", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      name: varchar("name", { length: 200 }).notNull(),
      address: text("address"),
      city: varchar("city", { length: 100 }),
      lat: decimal("lat", { precision: 10, scale: 7 }),
      lng: decimal("lng", { precision: 10, scale: 7 }),
      phone: varchar("phone", { length: 30 }),
      email: varchar("email", { length: 150 }),
      workingHours: text("working_hours"),
      isActive: boolean("is_active").default(true),
      isPrimary: boolean("is_primary").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_clinic_provider").on(t2.providerId)]);
    clinicGroupMembers = pgTable("clinic_group_members", {
      id: serial("id").primaryKey(),
      clinicId: integer("clinic_id").notNull(),
      providerId: integer("provider_id").notNull(),
      role: varchar("role", { length: 16 }).default("member").notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      joinedAt: timestamp("joined_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_cgm_clinic").on(t2.clinicId),
      index("idx_cgm_provider").on(t2.providerId)
    ]);
    satisfactionSurveys = pgTable("satisfaction_surveys", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull().unique(),
      patientId: integer("patient_id").notNull(),
      providerId: integer("provider_id").notNull(),
      q1Overall: smallint("q1_overall"),
      q2Communication: smallint("q2_communication"),
      q3Recommend: smallint("q3_recommend"),
      comment: text("comment"),
      sentAt: timestamp("sent_at").defaultNow().notNull(),
      submittedAt: timestamp("submitted_at"),
      providerReply: text("provider_reply"),
      repliedAt: timestamp("replied_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_survey_patient").on(t2.patientId),
      index("idx_survey_provider").on(t2.providerId)
    ]);
    providerBadges = pgTable("provider_badges", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      badgeType: varchar("badge_type", { length: 32 }).notNull(),
      awardedAt: timestamp("awarded_at").defaultNow().notNull(),
      metadata: jsonb("metadata")
    }, (t2) => [
      index("idx_badge_provider").on(t2.providerId),
      uniqueIndex("idx_badge_provider_type").on(t2.providerId, t2.badgeType)
    ]);
    providerTrustScores = pgTable("provider_trust_scores", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull().unique(),
      score: integer("score").default(0).notNull(),
      reviewScore: integer("review_score").default(0).notNull(),
      responseScore: integer("response_score").default(0).notNull(),
      completenessScore: integer("completeness_score").default(0).notNull(),
      verificationScore: integer("verification_score").default(0).notNull(),
      completionScore: integer("completion_score").default(0).notNull(),
      tier: trustTierEnum("tier").default("standard").notNull(),
      calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_trust_score").on(t2.score)]);
    prescriptionRefills = pgTable("prescription_refills", {
      id: serial("id").primaryKey(),
      prescriptionId: integer("prescription_id").notNull(),
      patientId: integer("patient_id").notNull(),
      providerId: integer("provider_id").notNull(),
      status: varchar("status", { length: 16 }).default("pending").notNull(),
      patientNote: text("patient_note"),
      providerNote: text("provider_note"),
      requestedAt: timestamp("requested_at").defaultNow().notNull(),
      respondedAt: timestamp("responded_at")
    }, (t2) => [
      index("idx_refill_prescription").on(t2.prescriptionId),
      index("idx_refill_patient").on(t2.patientId)
    ]);
    waitlist = pgTable("waitlist", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      patientId: integer("patient_id").notNull(),
      slotDate: varchar("slot_date", { length: 10 }).notNull(),
      slotTime: varchar("slot_time", { length: 5 }).notNull(),
      consultationType: varchar("consultation_type", { length: 16 }).default("in_clinic"),
      status: varchar("status", { length: 16 }).default("waiting").notNull(),
      notifiedAt: timestamp("notified_at"),
      expiresAt: timestamp("expires_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_waitlist_provider").on(t2.providerId),
      index("idx_waitlist_patient").on(t2.patientId)
    ]);
    waitingRoomStatus = pgTable("waiting_room_status", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull().unique(),
      patientReady: boolean("patient_ready").default(false).notNull(),
      providerReady: boolean("provider_ready").default(false).notNull(),
      patientReadyAt: timestamp("patient_ready_at"),
      providerReadyAt: timestamp("provider_ready_at"),
      callStartedAt: timestamp("call_started_at"),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    appointmentPackages = pgTable("appointment_packages", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      title: varchar("title", { length: 200 }).notNull(),
      description: text("description"),
      sessionCount: integer("session_count").notNull().default(5),
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      currency: varchar("currency", { length: 10 }).notNull().default("USD"),
      validityDays: integer("validity_days").notNull().default(180),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_pkg_provider").on(t2.providerId)]);
    patientPackages = pgTable("patient_packages", {
      id: serial("id").primaryKey(),
      packageId: integer("package_id").notNull(),
      patientId: integer("patient_id").notNull(),
      sessionsRemaining: integer("sessions_remaining").notNull(),
      sessionsTotal: integer("sessions_total").notNull().default(0),
      purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
      renewalReminderOptOut: boolean("renewal_reminder_opt_out").default(false).notNull()
    }, (t2) => [
      index("idx_patient_pkg_patient").on(t2.patientId),
      index("idx_patient_pkg_package").on(t2.packageId)
    ]);
    appointmentDocuments = pgTable("appointment_documents", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull(),
      patientId: integer("patient_id").notNull(),
      fileUrl: varchar("file_url", { length: 1e3 }).notNull(),
      fileKey: varchar("file_key", { length: 500 }).notNull(),
      fileName: varchar("file_name", { length: 300 }).notNull(),
      mimeType: varchar("mime_type", { length: 100 }).notNull().default("application/octet-stream"),
      uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
      flagged: boolean("flagged").default(false).notNull(),
      flaggedAt: timestamp("flagged_at"),
      flaggedBy: integer("flagged_by")
    }, (t2) => [
      index("idx_appt_doc_appointment").on(t2.appointmentId),
      index("idx_appt_doc_patient").on(t2.patientId)
    ]);
    providerBlackoutDates = pgTable("provider_blackout_dates", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      date: varchar("date", { length: 10 }).notNull(),
      reason: varchar("reason", { length: 200 }),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_blackout_provider").on(t2.providerId),
      index("idx_blackout_date").on(t2.date)
    ]);
    referrals = pgTable("referrals", {
      id: serial("id").primaryKey(),
      referrerId: integer("referrer_id").notNull(),
      refereeId: integer("referee_id"),
      code: varchar("code", { length: 20 }).notNull().unique(),
      status: varchar("status", { length: 16 }).default("pending").notNull(),
      rewardGranted: boolean("reward_granted").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      completedAt: timestamp("completed_at")
    }, (t2) => [
      index("idx_referral_referrer").on(t2.referrerId),
      index("idx_referral_code").on(t2.code)
    ]);
    providerScheduleTemplates = pgTable("provider_schedule_templates", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      name: varchar("name", { length: 100 }).notNull(),
      description: varchar("description", { length: 300 }),
      isDefault: boolean("is_default").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_sched_tmpl_provider").on(t2.providerId)]);
    providerScheduleTemplateSlots = pgTable("provider_schedule_template_slots", {
      id: serial("id").primaryKey(),
      templateId: integer("template_id").notNull(),
      dayOfWeek: integer("day_of_week").notNull(),
      startTime: varchar("start_time", { length: 5 }).notNull(),
      endTime: varchar("end_time", { length: 5 }).notNull()
    }, (t2) => [index("idx_sched_tmpl_slot_template").on(t2.templateId)]);
    medications = pgTable("medications", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      name: varchar("name", { length: 200 }).notNull(),
      dosage: varchar("dosage", { length: 100 }),
      frequency: frequencyEnum("frequency").notNull().default("once_daily"),
      startDate: varchar("start_date", { length: 10 }),
      endDate: varchar("end_date", { length: 10 }),
      reminderTime: varchar("reminder_time", { length: 5 }).default("08:00"),
      reminderEnabled: boolean("reminder_enabled").default(true).notNull(),
      notes: text("notes"),
      prescribedBy: varchar("prescribed_by", { length: 200 }),
      color: varchar("color", { length: 20 }).default("teal"),
      reminderLastSentAt: timestamp("reminder_last_sent_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_med_user").on(t2.userId)]);
    medicationLogs = pgTable("medication_logs", {
      id: serial("id").primaryKey(),
      patientId: integer("patient_id").notNull(),
      medicationName: varchar("medication_name", { length: 200 }).notNull(),
      dosage: varchar("dosage", { length: 100 }),
      scheduledDate: varchar("scheduled_date", { length: 10 }).notNull(),
      scheduledTime: varchar("scheduled_time", { length: 8 }),
      taken: boolean("taken").default(false).notNull(),
      takenAt: timestamp("taken_at"),
      skippedReason: varchar("skipped_reason", { length: 300 }),
      notes: text("notes"),
      prescriptionId: integer("prescription_id"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_medlog_patient").on(t2.patientId),
      index("idx_medlog_date").on(t2.scheduledDate)
    ]);
    providerPatientReferrals = pgTable("provider_patient_referrals", {
      id: serial("id").primaryKey(),
      fromProviderId: integer("from_provider_id").notNull(),
      toProviderId: integer("to_provider_id").notNull(),
      patientId: integer("patient_id").notNull(),
      reason: text("reason").notNull(),
      urgency: varchar("urgency", { length: 16 }).default("routine").notNull(),
      status: varchar("status", { length: 16 }).default("pending").notNull(),
      notes: text("notes"),
      appointmentId: integer("appointment_id"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_ppr_from").on(t2.fromProviderId),
      index("idx_ppr_to").on(t2.toProviderId),
      index("idx_ppr_patient").on(t2.patientId)
    ]);
    healthGoals = pgTable("health_goals", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      type: varchar("type", { length: 32 }).notNull().default("custom"),
      title: varchar("title", { length: 200 }).notNull(),
      targetValue: decimal("target_value", { precision: 10, scale: 2 }).notNull(),
      currentValue: decimal("current_value", { precision: 10, scale: 2 }).default("0").notNull(),
      unit: varchar("unit", { length: 50 }).default(""),
      deadline: varchar("deadline", { length: 10 }),
      status: varchar("status", { length: 16 }).default("active").notNull(),
      streak: integer("streak").default(0).notNull(),
      lastCheckInAt: timestamp("last_check_in_at"),
      badgeEarned: boolean("badge_earned").default(false).notNull(),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_hg_user").on(t2.userId)]);
    deals = pgTable("deals", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      title: varchar("title", { length: 200 }).notNull(),
      titleAr: varchar("title_ar", { length: 200 }),
      description: text("description"),
      descriptionAr: text("description_ar"),
      originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
      discountedPrice: decimal("discounted_price", { precision: 10, scale: 2 }).notNull(),
      currency: varchar("currency", { length: 3 }).default("USD").notNull(),
      discountPct: decimal("discount_pct", { precision: 5, scale: 2 }).notNull(),
      commissionPct: decimal("commission_pct", { precision: 5, scale: 2 }).default("10.00").notNull(),
      category: dealCategoryEnum("category").default("consultation").notNull(),
      imageUrl: text("image_url"),
      maxClaims: integer("max_claims"),
      claimsCount: integer("claims_count").default(0).notNull(),
      validFrom: timestamp("valid_from").notNull(),
      validUntil: timestamp("valid_until").notNull(),
      status: dealStatusEnum("status").default("draft").notNull(),
      isFeatured: boolean("is_featured").default(false).notNull(),
      countryCode: varchar("country_code", { length: 2 }),
      specialtyId: integer("specialty_id"),
      termsAndConditions: text("terms_and_conditions"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_deal_provider").on(t2.providerId),
      index("idx_deal_status").on(t2.status),
      index("idx_deal_country").on(t2.countryCode),
      index("idx_deal_valid").on(t2.validFrom, t2.validUntil)
    ]);
    dealClaims = pgTable("deal_claims", {
      id: serial("id").primaryKey(),
      dealId: integer("deal_id").notNull(),
      patientId: integer("patient_id").notNull(),
      claimCode: varchar("claim_code", { length: 20 }).notNull().unique(),
      status: varchar("status", { length: 16 }).default("claimed").notNull(),
      redeemedAt: timestamp("redeemed_at"),
      appointmentId: integer("appointment_id"),
      platformCommissionAmount: decimal("platform_commission_amount", { precision: 10, scale: 2 }),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_claim_deal").on(t2.dealId),
      index("idx_claim_patient").on(t2.patientId),
      uniqueIndex("idx_claim_unique").on(t2.dealId, t2.patientId)
    ]);
    loyaltyPoints = pgTable("loyalty_points", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      balance: integer("balance").default(0).notNull(),
      lifetimeEarned: integer("lifetime_earned").default(0).notNull(),
      lifetimeRedeemed: integer("lifetime_redeemed").default(0).notNull(),
      tier: loyaltyTierEnum("tier").default("bronze").notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [uniqueIndex("idx_loyalty_user").on(t2.userId)]);
    loyaltyTransactions = pgTable("loyalty_transactions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      points: integer("points").notNull(),
      action: varchar("action", { length: 32 }).notNull(),
      referenceId: integer("reference_id"),
      description: varchar("description", { length: 300 }),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_loyalty_tx_user").on(t2.userId)]);
    sponsoredListings = pgTable("sponsored_listings", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      targetSpecialtyId: integer("target_specialty_id"),
      targetCountryCode: varchar("target_country_code", { length: 2 }),
      creditBudget: decimal("credit_budget", { precision: 10, scale: 2 }).notNull(),
      creditsSpent: decimal("credits_spent", { precision: 10, scale: 2 }).default("0").notNull(),
      bidPerClick: decimal("bid_per_click", { precision: 6, scale: 2 }).default("0.50").notNull(),
      impressions: integer("impressions").default(0).notNull(),
      clicks: integer("clicks").default(0).notNull(),
      status: varchar("status", { length: 16 }).default("active").notNull(),
      startsAt: timestamp("starts_at").notNull(),
      endsAt: timestamp("ends_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_sponsored_provider").on(t2.providerId),
      index("idx_sponsored_status").on(t2.status)
    ]);
    providerCredits = pgTable("provider_credits", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      balance: integer("balance").default(0).notNull(),
      lifetimeEarned: integer("lifetime_earned").default(0).notNull(),
      lifetimeSpent: integer("lifetime_spent").default(0).notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_prov_credits_provider").on(t2.providerId)]);
    creditTransactions = pgTable("credit_transactions", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      type: varchar("type", { length: 16 }).notNull(),
      amount: integer("amount").notNull(),
      balanceAfter: integer("balance_after").notNull(),
      description: varchar("description", { length: 255 }),
      referenceId: varchar("reference_id", { length: 100 }),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_credit_tx_provider").on(t2.providerId)]);
    userCredits = pgTable("user_credits", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      balance: integer("balance").default(0).notNull(),
      lifetimeEarned: integer("lifetime_earned").default(0).notNull(),
      lifetimeSpent: integer("lifetime_spent").default(0).notNull(),
      lastLoginStreakAt: timestamp("last_login_streak_at"),
      streakDays: integer("streak_days").default(0).notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_user_credits_user").on(t2.userId)]);
    userCreditTransactions = pgTable("user_credit_transactions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      amount: integer("amount").notNull(),
      balanceAfter: integer("balance_after").notNull(),
      type: varchar("type", { length: 32 }).notNull(),
      description: varchar("description", { length: 255 }),
      referenceId: varchar("reference_id", { length: 100 }),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [index("idx_uct_user").on(t2.userId)]);
    creditPacks = pgTable("credit_packs", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 100 }).notNull(),
      description: varchar("description", { length: 255 }),
      credits: integer("credits").notNull(),
      priceUsd: decimal("price_usd", { precision: 10, scale: 2 }).notNull(),
      stripePriceId: varchar("stripe_price_id", { length: 100 }),
      badge: varchar("badge", { length: 50 }),
      isPopular: boolean("is_popular").default(false).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      sortOrder: integer("sort_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    coupons = pgTable("coupons", {
      id: serial("id").primaryKey(),
      code: varchar("code", { length: 32 }).notNull().unique(),
      title: varchar("title", { length: 120 }).notNull(),
      description: text("description"),
      scope: varchar("scope", { length: 16 }).default("provider").notNull(),
      discountType: varchar("discount_type", { length: 16 }).default("percent").notNull(),
      discountValue: integer("discount_value").default(0).notNull(),
      currency: varchar("currency", { length: 3 }).default("USD"),
      providerId: integer("provider_id"),
      maxUses: integer("max_uses").default(100).notNull(),
      usedCount: integer("used_count").default(0).notNull(),
      minBookingFee: integer("min_booking_fee").default(0),
      expiresAt: timestamp("expires_at"),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_coupon_code").on(t2.code),
      index("idx_coupon_provider").on(t2.providerId)
    ]);
    userCoupons = pgTable("user_coupons", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      couponId: integer("coupon_id").notNull(),
      status: varchar("status", { length: 16 }).default("claimed").notNull(),
      appointmentId: integer("appointment_id"),
      claimedAt: timestamp("claimed_at").defaultNow().notNull(),
      usedAt: timestamp("used_at")
    }, (t2) => [
      index("idx_uc_user").on(t2.userId),
      index("idx_uc_coupon").on(t2.couponId)
    ]);
    events = pgTable("events", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 300 }).notNull(),
      titleAr: varchar("title_ar", { length: 300 }),
      description: text("description"),
      descriptionAr: text("description_ar"),
      type: varchar("type", { length: 32 }).default("conference").notNull(),
      organizer: varchar("organizer", { length: 200 }).notNull(),
      organizerUserId: integer("organizer_user_id"),
      location: varchar("location", { length: 300 }),
      country: varchar("country", { length: 100 }),
      countryCode: varchar("country_code", { length: 2 }),
      startDate: varchar("start_date", { length: 20 }).notNull(),
      endDate: varchar("end_date", { length: 20 }),
      attendeeCount: integer("attendee_count").default(0),
      seekingSponsors: boolean("seeking_sponsors").default(false).notNull(),
      sponsorshipDetails: text("sponsorship_details"),
      imageUrl: text("image_url"),
      websiteUrl: varchar("website_url", { length: 500 }),
      status: varchar("status", { length: 16 }).default("pending").notNull(),
      featured: boolean("featured").default(false).notNull(),
      specialtyTags: varchar("specialty_tags", { length: 500 }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_event_status").on(t2.status),
      index("idx_event_type").on(t2.type)
    ]);
    eventRegistrations = pgTable("event_registrations", {
      id: serial("id").primaryKey(),
      eventId: integer("event_id").notNull(),
      userId: integer("user_id"),
      name: varchar("name", { length: 200 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      phone: varchar("phone", { length: 32 }),
      organization: varchar("organization", { length: 200 }),
      role: varchar("role", { length: 100 }),
      message: text("message"),
      status: varchar("status", { length: 16 }).default("pending").notNull(),
      reminderSentAt: timestamp("reminder_sent_at"),
      checkInToken: varchar("check_in_token", { length: 64 }).unique(),
      checkedInAt: timestamp("checked_in_at"),
      checkedInBy: integer("checked_in_by"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_event_reg_event").on(t2.eventId),
      index("idx_event_reg_user").on(t2.userId),
      index("idx_event_reg_email").on(t2.email)
    ]);
    sponsorInquiries = pgTable("sponsor_inquiries", {
      id: serial("id").primaryKey(),
      eventId: integer("event_id").notNull(),
      userId: integer("user_id"),
      companyName: varchar("company_name", { length: 200 }).notNull(),
      contactEmail: varchar("contact_email", { length: 320 }),
      tierInterest: varchar("tier_interest", { length: 16 }).default("bronze").notNull(),
      message: text("message"),
      status: varchar("status", { length: 16 }).default("new").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_sponsor_inq_event").on(t2.eventId),
      index("idx_sponsor_inq_status").on(t2.status)
    ]);
    marketWaitlist = pgTable("market_waitlist", {
      id: serial("id").primaryKey(),
      email: varchar("email", { length: 320 }).notNull(),
      countryCode: varchar("country_code", { length: 2 }).notNull(),
      countryName: varchar("country_name", { length: 100 }),
      role: varchar("role", { length: 16 }).default("member").notNull(),
      userId: integer("user_id"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_mwl_email").on(t2.email),
      index("idx_mwl_country").on(t2.countryCode)
    ]);
    providerProfileViews = pgTable("provider_profile_views", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      viewerUserId: integer("viewer_user_id"),
      viewedAt: timestamp("viewed_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_ppv_provider").on(t2.providerId),
      index("idx_ppv_viewed_at").on(t2.viewedAt)
    ]);
    flaggedReviews = pgTable("flagged_reviews", {
      id: serial("id").primaryKey(),
      reviewId: integer("review_id").notNull(),
      flaggedBy: integer("flagged_by").notNull(),
      reason: varchar("reason", { length: 500 }).notNull(),
      status: varchar("status", { length: 16 }).default("pending").notNull(),
      adminNote: text("admin_note"),
      resolvedBy: integer("resolved_by"),
      resolvedAt: timestamp("resolved_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_flag_review").on(t2.reviewId),
      index("idx_flag_status").on(t2.status)
    ]);
    reelReports = pgTable("reel_reports", {
      id: serial("id").primaryKey(),
      reelId: integer("reel_id").notNull(),
      reportedBy: integer("reported_by").notNull(),
      reason: varchar("reason", { length: 32 }).notNull(),
      details: text("details"),
      status: varchar("status", { length: 16 }).default("pending").notNull(),
      reviewedBy: integer("reviewed_by"),
      reviewedAt: timestamp("reviewed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_reel_report_reel").on(t2.reelId),
      index("idx_reel_report_status").on(t2.status)
    ]);
    payoutRequests = pgTable("payout_requests", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      currency: varchar("currency", { length: 10 }).default("JOD").notNull(),
      status: varchar("status", { length: 16 }).default("pending").notNull(),
      bankDetails: text("bank_details"),
      adminNotes: text("admin_notes"),
      requestedAt: timestamp("requested_at").defaultNow().notNull(),
      processedAt: timestamp("processed_at")
    }, (t2) => [
      index("idx_pr_provider").on(t2.providerId),
      index("idx_pr_status").on(t2.status)
    ]);
    pushTokens = pgTable("push_tokens", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      token: text("token").notNull(),
      platform: varchar("platform", { length: 20 }).default("web").notNull(),
      enabled: boolean("enabled").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_push_token_user").on(t2.userId)]);
    providerInsurances = pgTable("provider_insurances", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      insuranceProviderId: integer("insurance_provider_id").notNull(),
      isActive: boolean("is_active").default(true),
      acceptedSince: timestamp("accepted_since").defaultNow()
    }, (t2) => [index("idx_prov_ins_provider").on(t2.providerId)]);
    appointmentSurveys = pgTable("appointment_surveys", {
      id: serial("id").primaryKey(),
      appointmentId: integer("appointment_id").notNull(),
      patientId: integer("patient_id").notNull(),
      providerId: integer("provider_id").notNull(),
      rating: integer("rating").notNull(),
      feedback: text("feedback"),
      providerReply: text("provider_reply"),
      repliedAt: timestamp("replied_at"),
      submittedAt: timestamp("submitted_at").defaultNow().notNull()
    }, (t2) => [
      index("idx_appt_survey_appointment").on(t2.appointmentId),
      index("idx_appt_survey_patient").on(t2.patientId)
    ]);
    epidemicAlertsCache = pgTable("epidemic_alerts_cache", {
      id: serial("id").primaryKey(),
      countryCode: varchar("country_code", { length: 10 }).notNull(),
      lang: varchar("lang", { length: 5 }).notNull().default("en"),
      payload: text("payload").notNull(),
      cachedAt: timestamp("cached_at").defaultNow().notNull(),
      expiresAt: timestamp("expires_at").notNull()
    }, (t2) => [index("idx_epidemic_cache_country_lang").on(t2.countryCode, t2.lang)]);
    stockWatchlist = pgTable("stock_watchlist", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      symbol: varchar("symbol", { length: 20 }).notNull(),
      addedAt: timestamp("added_at").defaultNow().notNull()
    }, (t2) => [index("idx_stock_user").on(t2.userId)]);
    searchLogs = pgTable("search_logs", {
      id: serial("id").primaryKey(),
      userId: integer("user_id"),
      queryText: text("query_text"),
      filters: jsonb("filters"),
      resultsCount: integer("results_count"),
      countryCode: varchar("country_code", { length: 2 }),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    providerCalendarTokens = pgTable("provider_calendar_tokens", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().unique(),
      accessToken: text("access_token").notNull(),
      refreshToken: text("refresh_token"),
      expiresAt: timestamp("expires_at"),
      calendarId: varchar("calendar_id", { length: 200 }).default("primary"),
      syncEnabled: boolean("sync_enabled").default(true),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    availabilityTemplates = pgTable("availability_templates", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      name: varchar("name", { length: 128 }).notNull(),
      slots: jsonb("slots").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (t2) => [index("idx_at_provider").on(t2.providerId)]);
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  closeDb: () => closeDb,
  getDb: () => getDb,
  getPool: () => getPool,
  requireDb: () => requireDb
});
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { TRPCError as TRPCError2 } from "@trpc/server";
function getPool() {
  if (!_pool) {
    _pool = new Pool({
      connectionString: ENV.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 3e4,
      connectionTimeoutMillis: 1e4,
      ssl: ENV.NODE_ENV === "production" ? { rejectUnauthorized: true } : false
    });
    _pool.on("error", (err) => {
      console.error("[DB] Unexpected pool error:", err.message);
      _pool = null;
      _db = null;
    });
    _pool.on("connect", () => {
      if (ENV.NODE_ENV === "development") {
        console.log("[DB] New client connected");
      }
    });
  }
  return _pool;
}
function getDb() {
  if (!_db) {
    _db = drizzle(getPool(), { schema: schema_exports });
  }
  return _db;
}
function requireDb() {
  try {
    return getDb();
  } catch (err) {
    console.error("[DB] requireDb failed:", err);
    throw new TRPCError2({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database unavailable"
    });
  }
}
async function closeDb() {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
  }
}
var _pool, _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_env();
    init_schema();
    _pool = null;
    _db = null;
  }
});

// server/lib/icalGenerator.ts
var icalGenerator_exports = {};
__export(icalGenerator_exports, {
  generateProviderIcal: () => generateProviderIcal
});
import { eq as eq20, and as and11, gte as gte10 } from "drizzle-orm";
async function generateProviderIcal(providerId) {
  const db = getDb();
  const [pp] = await db.select({ id: providerProfiles.id, userName: users.name }).from(providerProfiles).innerJoin(users, eq20(providerProfiles.userId, users.id)).where(eq20(providerProfiles.id, providerId)).limit(1);
  if (!pp) throw new Error("NOT_FOUND");
  const upcoming = await db.select({
    id: appointments.id,
    slotStart: appointments.slotStart,
    slotEnd: appointments.slotEnd,
    type: appointments.type,
    notes: appointments.notes
  }).from(appointments).where(
    and11(
      eq20(appointments.providerId, providerId),
      eq20(appointments.status, "confirmed"),
      gte10(appointments.slotStart, /* @__PURE__ */ new Date())
    )
  ).limit(200);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Qliniqit//Provider Availability//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Dr. ${pp.userName ?? "Provider"} \u2014 Qliniqit Schedule`,
    "X-WR-TIMEZONE:UTC"
  ];
  for (const appt of upcoming) {
    const start = new Date(appt.slotStart);
    const end = appt.slotEnd ? new Date(appt.slotEnd) : new Date(start.getTime() + 30 * 60 * 1e3);
    lines.push(
      "BEGIN:VEVENT",
      `UID:qliniqit-appt-${appt.id}@qliniqit.com`,
      `DTSTAMP:${fmt(/* @__PURE__ */ new Date())}Z`,
      `DTSTART:${fmt(start)}Z`,
      `DTEND:${fmt(end)}Z`,
      `SUMMARY:${appt.type === "teleconsultation" ? "Video Consultation" : "In-Clinic Appointment"} \u2014 Qliniqit`,
      appt.notes ? `DESCRIPTION:${appt.notes.replace(/\n/g, "\\n")}` : "DESCRIPTION:Appointment via Qliniqit",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
var init_icalGenerator = __esm({
  "server/lib/icalGenerator.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/lib/twilio.ts
var twilio_exports = {};
__export(twilio_exports, {
  isStartMessage: () => isStartMessage,
  isStopMessage: () => isStopMessage
});
function isStopMessage(body) {
  return STOP_KEYWORDS.includes(body.trim().toLowerCase());
}
function isStartMessage(body) {
  return START_KEYWORDS.includes(body.trim().toLowerCase());
}
var STOP_KEYWORDS, START_KEYWORDS;
var init_twilio = __esm({
  "server/lib/twilio.ts"() {
    "use strict";
    STOP_KEYWORDS = ["stop", "cancel", "unsubscribe", "quit", "end"];
    START_KEYWORDS = ["start", "yes", "unstop"];
  }
});

// server/index.ts
init_env();
import "dotenv/config";
import express2 from "express";
import helmet from "helmet";
import cors from "cors";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Never expose stack traces to clients
        stack: void 0
      }
    };
  }
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required (10001)"
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
var protectedProcedure = t.procedure.use(requireUser);
var requireProvider = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required (10001)" });
  }
  if (ctx.user.role !== "provider" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Provider account required (10003)" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
var providerProcedure = t.procedure.use(requireProvider);
var requireAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required (10001)" });
  }
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required (10002)" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
var adminProcedure = t.procedure.use(requireAdmin);

// server/routers/auth.ts
import { z as z2 } from "zod";
init_db();
init_schema();
import { eq } from "drizzle-orm";
import { TRPCError as TRPCError3 } from "@trpc/server";
var authRouter = router({
  /**
   * Called by the client after Supabase sign-in to upsert the user
   * record in our database. Safe to call on every login.
   */
  upsertUser: publicProcedure.input(
    z2.object({
      supabaseUid: z2.string().min(1),
      email: z2.string().email().optional(),
      name: z2.string().max(200).optional(),
      avatarUrl: z2.string().url().optional()
    })
  ).mutation(async ({ input }) => {
    const db = requireDb();
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.supabaseUid, input.supabaseUid)).limit(1);
    if (existing.length > 0) {
      await db.update(users).set({ lastSignedIn: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.supabaseUid, input.supabaseUid));
      return { created: false, userId: existing[0].id };
    }
    const [created] = await db.insert(users).values({
      supabaseUid: input.supabaseUid,
      email: input.email ?? null,
      name: input.name ?? null,
      avatarUrl: input.avatarUrl ?? null,
      role: "user"
    }).returning({ id: users.id });
    return { created: true, userId: created.id };
  }),
  /**
   * Returns the currently authenticated user's profile.
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb();
    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    if (!user) throw new TRPCError3({ code: "NOT_FOUND", message: "User not found" });
    return user;
  }),
  /**
   * Update the current user's profile.
   */
  updateProfile: protectedProcedure.input(
    z2.object({
      name: z2.string().max(200).optional(),
      phone: z2.string().max(32).optional(),
      dateOfBirth: z2.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      gender: z2.enum(["male", "female", "other"]).optional(),
      city: z2.string().max(100).optional(),
      countryCode: z2.string().length(2).optional(),
      locale: z2.string().max(10).optional(),
      timezone: z2.string().max(64).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    await db.update(users).set({ ...input, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, ctx.user.id));
    return { ok: true };
  })
});

// server/routers/providers.ts
import { z as z3 } from "zod";
init_db();
init_schema();
import { eq as eq2, and, ilike, gte, lte, ne, desc } from "drizzle-orm";
import { TRPCError as TRPCError4 } from "@trpc/server";
var providersRouter = router({
  /**
   * Search providers with filters.
   */
  search: publicProcedure.input(
    z3.object({
      query: z3.string().max(200).optional(),
      specialtyId: z3.number().int().positive().optional(),
      countryCode: z3.string().length(2).optional(),
      city: z3.string().max(100).optional(),
      providerType: z3.string().optional(),
      offersVideo: z3.boolean().optional(),
      minRating: z3.number().min(0).max(5).optional(),
      page: z3.number().int().min(1).default(1),
      limit: z3.number().int().min(1).max(50).default(20)
    })
  ).query(async ({ input }) => {
    const db = requireDb();
    const offset = (input.page - 1) * input.limit;
    const conditions = [eq2(providerProfiles.isActive, true)];
    if (input.specialtyId) conditions.push(eq2(providerProfiles.specialtyId, input.specialtyId));
    if (input.countryCode) conditions.push(eq2(providerProfiles.countryCode, input.countryCode));
    if (input.city) conditions.push(ilike(providerProfiles.city, `%${input.city}%`));
    if (input.providerType) conditions.push(eq2(providerProfiles.providerType, input.providerType));
    if (input.offersVideo !== void 0) conditions.push(eq2(providerProfiles.offersVideo, input.offersVideo));
    if (input.minRating) conditions.push(gte(providerProfiles.ratingAvg, String(input.minRating)));
    if (input.query) {
      conditions.push(ilike(users.name, `%${input.query}%`));
    }
    const rows = await db.select({
      id: providerProfiles.id,
      slug: providerProfiles.slug,
      userId: providerProfiles.userId,
      name: users.name,
      avatarUrl: users.avatarUrl,
      specialtyId: providerProfiles.specialtyId,
      providerType: providerProfiles.providerType,
      consultationFee: providerProfiles.consultationFee,
      currencyCode: providerProfiles.currencyCode,
      ratingAvg: providerProfiles.ratingAvg,
      reviewCount: providerProfiles.reviewCount,
      city: providerProfiles.city,
      countryCode: providerProfiles.countryCode,
      offersVideo: providerProfiles.offersVideo,
      isFeatured: providerProfiles.isFeatured,
      verificationStatus: providerProfiles.verificationStatus
    }).from(providerProfiles).innerJoin(users, eq2(users.id, providerProfiles.userId)).where(and(...conditions)).orderBy(desc(providerProfiles.isFeatured), desc(providerProfiles.ratingAvg)).limit(input.limit).offset(offset);
    return { providers: rows, page: input.page, limit: input.limit };
  }),
  /**
   * Get a provider's full public profile by slug.
   */
  getBySlug: publicProcedure.input(z3.object({ slug: z3.string().min(1) })).query(async ({ input }) => {
    const db = requireDb();
    const [row] = await db.select({
      profile: providerProfiles,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      specialtyName: specialties.nameEn
    }).from(providerProfiles).innerJoin(users, eq2(users.id, providerProfiles.userId)).leftJoin(specialties, eq2(specialties.id, providerProfiles.specialtyId)).where(and(eq2(providerProfiles.slug, input.slug), eq2(providerProfiles.isActive, true))).limit(1);
    if (!row) throw new TRPCError4({ code: "NOT_FOUND", message: "Provider not found" });
    const [trustScore] = await db.select().from(providerTrustScores).where(eq2(providerTrustScores.providerId, row.profile.id)).limit(1);
    return { ...row, trustScore: trustScore ?? null };
  }),
  /**
   * Get available time slots for a provider on a given date.
   */
  getAvailability: publicProcedure.input(
    z3.object({
      providerId: z3.number().int().positive(),
      date: z3.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
  ).query(async ({ input }) => {
    const db = requireDb();
    const dateObj = new Date(input.date);
    const dayOfWeek = dateObj.getUTCDay();
    const slots = await db.select().from(availabilitySlots).where(
      and(
        eq2(availabilitySlots.providerId, input.providerId),
        eq2(availabilitySlots.dayOfWeek, dayOfWeek),
        eq2(availabilitySlots.isBlocked, false),
        eq2(availabilitySlots.isRecurring, true)
      )
    );
    const blackouts = await db.select().from(providerBlackoutDates).where(
      and(
        eq2(providerBlackoutDates.providerId, input.providerId),
        eq2(providerBlackoutDates.date, input.date)
      )
    );
    if (blackouts.length > 0) return [];
    const dateStart = /* @__PURE__ */ new Date(`${input.date}T00:00:00Z`);
    const dateEnd = /* @__PURE__ */ new Date(`${input.date}T23:59:59Z`);
    const booked = await db.select({ slotStart: appointments.slotStart }).from(appointments).where(
      and(
        eq2(appointments.providerId, input.providerId),
        gte(appointments.slotStart, dateStart),
        lte(appointments.slotStart, dateEnd),
        ne(appointments.status, "cancelled")
      )
    );
    const bookedMinutes = new Set(
      booked.map((b) => {
        const d = new Date(b.slotStart);
        return d.getUTCHours() * 60 + d.getUTCMinutes();
      })
    );
    const timeSlots = [];
    for (const slot of slots) {
      const [startH, startM] = slot.startTime.split(":").map(Number);
      const [endH, endM] = slot.endTime.split(":").map(Number);
      const duration = slot.slotDurationMin ?? 30;
      let cur = startH * 60 + startM;
      const endTotal = endH * 60 + endM;
      while (cur + duration <= endTotal) {
        const h = Math.floor(cur / 60);
        const m = cur % 60;
        const nextCur = cur + duration;
        const nh = Math.floor(nextCur / 60);
        const nm = nextCur % 60;
        const startStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const endStr = `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
        timeSlots.push({ start: startStr, end: endStr, available: !bookedMinutes.has(cur) });
        cur = nextCur;
      }
    }
    return timeSlots;
  }),
  /**
   * Update own provider profile.
   */
  updateProfile: providerProcedure.input(
    z3.object({
      bio: z3.string().max(2e3).optional(),
      consultationFee: z3.string().optional(),
      currencyCode: z3.string().length(3).optional(),
      officeAddress: z3.string().max(500).optional(),
      city: z3.string().max(100).optional(),
      languages: z3.array(z3.string()).optional(),
      offersVideo: z3.boolean().optional(),
      cancellationWindowHours: z3.number().int().min(0).max(168).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [profile] = await db.select({ id: providerProfiles.id }).from(providerProfiles).where(eq2(providerProfiles.userId, ctx.user.id)).limit(1);
    if (!profile) throw new TRPCError4({ code: "NOT_FOUND", message: "Provider profile not found" });
    await db.update(providerProfiles).set({ ...input, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(providerProfiles.id, profile.id));
    return { ok: true };
  })
});

// server/routers/booking.ts
import { z as z4 } from "zod";
init_db();
init_schema();
import { eq as eq3, and as and2, gte as gte2, ne as ne2, desc as desc2 } from "drizzle-orm";
import { TRPCError as TRPCError5 } from "@trpc/server";
var bookingRouter = router({
  /**
   * Hold a slot for 10 minutes while the patient completes booking.
   */
  holdSlot: protectedProcedure.input(
    z4.object({
      providerId: z4.number().int().positive(),
      slotStart: z4.string().datetime(),
      slotEnd: z4.string().datetime()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
    const conflict = await db.select({ id: appointments.id }).from(appointments).where(
      and2(
        eq3(appointments.providerId, input.providerId),
        eq3(appointments.slotStart, new Date(input.slotStart)),
        ne2(appointments.status, "cancelled")
      )
    ).limit(1);
    if (conflict.length > 0) {
      throw new TRPCError5({ code: "CONFLICT", message: "Slot already booked" });
    }
    const [hold] = await db.insert(slotHolds).values({
      patientId: ctx.user.id,
      providerId: input.providerId,
      slotStart: new Date(input.slotStart),
      slotEnd: new Date(input.slotEnd),
      expiresAt,
      status: "active"
    }).returning();
    return { holdId: hold.id, expiresAt };
  }),
  /**
   * Confirm a booking (converts a hold to an appointment).
   */
  create: protectedProcedure.input(
    z4.object({
      holdId: z4.number().int().positive(),
      providerId: z4.number().int().positive(),
      slotStart: z4.string().datetime(),
      slotEnd: z4.string().datetime(),
      type: z4.enum(["in_clinic", "teleconsultation"]).default("in_clinic"),
      notes: z4.string().max(1e3).optional(),
      familyMemberId: z4.number().int().positive().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [hold] = await db.select().from(slotHolds).where(
      and2(
        eq3(slotHolds.id, input.holdId),
        eq3(slotHolds.patientId, ctx.user.id),
        eq3(slotHolds.status, "active"),
        gte2(slotHolds.expiresAt, /* @__PURE__ */ new Date())
      )
    ).limit(1);
    if (!hold) {
      throw new TRPCError5({ code: "PRECONDITION_FAILED", message: "Slot hold expired or not found" });
    }
    const [appt] = await db.insert(appointments).values({
      patientId: ctx.user.id,
      providerId: input.providerId,
      slotStart: new Date(input.slotStart),
      slotEnd: new Date(input.slotEnd),
      type: input.type,
      notes: input.notes ?? null,
      familyMemberId: input.familyMemberId ?? null,
      status: "pending",
      bookingSource: "web"
    }).returning();
    await db.update(slotHolds).set({ status: "converted" }).where(eq3(slotHolds.id, input.holdId));
    return { appointmentId: appt.id };
  }),
  /**
   * Get appointments for the current user (patient view).
   */
  myAppointments: protectedProcedure.input(
    z4.object({
      status: z4.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]).optional(),
      page: z4.number().int().min(1).default(1),
      limit: z4.number().int().min(1).max(50).default(20)
    })
  ).query(async ({ ctx, input }) => {
    const db = requireDb();
    const offset = (input.page - 1) * input.limit;
    const conditions = [eq3(appointments.patientId, ctx.user.id)];
    if (input.status) conditions.push(eq3(appointments.status, input.status));
    const rows = await db.select({
      id: appointments.id,
      slotStart: appointments.slotStart,
      slotEnd: appointments.slotEnd,
      status: appointments.status,
      type: appointments.type,
      paymentStatus: appointments.paymentStatus,
      providerName: users.name,
      providerAvatar: users.avatarUrl
    }).from(appointments).innerJoin(providerProfiles, eq3(providerProfiles.id, appointments.providerId)).innerJoin(users, eq3(users.id, providerProfiles.userId)).where(and2(...conditions)).orderBy(desc2(appointments.slotStart)).limit(input.limit).offset(offset);
    return rows;
  }),
  /**
   * Cancel an appointment.
   */
  cancel: protectedProcedure.input(
    z4.object({
      appointmentId: z4.number().int().positive(),
      reason: z4.string().max(500).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [appt] = await db.select().from(appointments).where(eq3(appointments.id, input.appointmentId)).limit(1);
    if (!appt) throw new TRPCError5({ code: "NOT_FOUND" });
    const isPatient = appt.patientId === ctx.user.id;
    const isProviderOrAdmin = ctx.user.role === "admin" || ctx.user.role === "provider" && await db.select({ id: providerProfiles.id }).from(providerProfiles).where(
      and2(
        eq3(providerProfiles.userId, ctx.user.id),
        eq3(providerProfiles.id, appt.providerId)
      )
    ).limit(1).then((r) => r.length > 0);
    if (!isPatient && !isProviderOrAdmin) {
      throw new TRPCError5({ code: "FORBIDDEN" });
    }
    if (!["pending", "confirmed"].includes(appt.status ?? "")) {
      throw new TRPCError5({ code: "BAD_REQUEST", message: "Cannot cancel a completed appointment" });
    }
    await db.update(appointments).set({
      status: "cancelled",
      cancellationReason: input.reason ?? null,
      cancelledBy: isPatient ? "patient" : "provider",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(appointments.id, input.appointmentId));
    return { ok: true };
  })
});

// server/routers/reviews.ts
import { z as z5 } from "zod";
init_db();
init_schema();
import { eq as eq4, and as and3, desc as desc3, gte as gte3, lte as lte3 } from "drizzle-orm";
import { TRPCError as TRPCError6 } from "@trpc/server";
import { nanoid } from "nanoid";
var reviewsRouter = router({
  forProvider: publicProcedure.input(z5.object({ providerId: z5.number().int().positive(), page: z5.number().int().min(1).default(1), limit: z5.number().int().min(1).max(50).default(10) })).query(async ({ input }) => {
    const db = requireDb();
    const rows = await db.select({ id: reviews.id, rating: reviews.rating, comment: reviews.comment, aspects: reviews.aspects, providerResponse: reviews.providerResponse, createdAt: reviews.createdAt, patientName: users.name, patientAvatar: users.avatarUrl }).from(reviews).innerJoin(users, eq4(users.id, reviews.patientId)).where(and3(eq4(reviews.providerId, input.providerId), eq4(reviews.isVisible, true), eq4(reviews.moderationStatus, "approved"))).orderBy(desc3(reviews.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  create: protectedProcedure.input(z5.object({ appointmentId: z5.number().int().positive(), rating: z5.number().int().min(1).max(5), comment: z5.string().max(2e3).optional(), aspects: z5.object({ waitTime: z5.number().min(1).max(5).optional(), communication: z5.number().min(1).max(5).optional(), facility: z5.number().min(1).max(5).optional() }).optional() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [appt] = await db.select().from(appointments).where(and3(eq4(appointments.id, input.appointmentId), eq4(appointments.patientId, ctx.user.id), eq4(appointments.status, "completed"))).limit(1);
    if (!appt) throw new TRPCError6({ code: "FORBIDDEN", message: "Can only review completed appointments" });
    const [review] = await db.insert(reviews).values({ appointmentId: input.appointmentId, patientId: ctx.user.id, providerId: appt.providerId, rating: input.rating, comment: input.comment ?? null, aspects: input.aspects ?? null, moderationStatus: "pending", isVerifiedAppointment: true }).returning();
    return { reviewId: review.id };
  })
});
var patientRouter = router({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb();
    const upcomingAppts = await db.select({ id: appointments.id, slotStart: appointments.slotStart, type: appointments.type, status: appointments.status, providerName: users.name }).from(appointments).innerJoin(providerProfiles, eq4(providerProfiles.id, appointments.providerId)).innerJoin(users, eq4(users.id, providerProfiles.userId)).where(and3(eq4(appointments.patientId, ctx.user.id), eq4(appointments.status, "confirmed"), gte3(appointments.slotStart, /* @__PURE__ */ new Date()))).orderBy(appointments.slotStart).limit(5);
    return { upcomingAppointments: upcomingAppts };
  })
});
var dealsRouter = router({
  list: publicProcedure.input(z5.object({ countryCode: z5.string().length(2).optional(), category: z5.string().optional(), page: z5.number().int().min(1).default(1), limit: z5.number().int().min(1).max(50).default(20) })).query(async ({ input }) => {
    const db = requireDb();
    const now = /* @__PURE__ */ new Date();
    const conditions = [eq4(deals.status, "active"), lte3(deals.validFrom, now), gte3(deals.validUntil, now)];
    if (input.countryCode) conditions.push(eq4(deals.countryCode, input.countryCode));
    if (input.category) conditions.push(eq4(deals.category, input.category));
    const rows = await db.select().from(deals).where(and3(...conditions)).orderBy(desc3(deals.isFeatured), desc3(deals.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  claim: protectedProcedure.input(z5.object({ dealId: z5.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [deal] = await db.select().from(deals).where(and3(eq4(deals.id, input.dealId), eq4(deals.status, "active"), gte3(deals.validUntil, /* @__PURE__ */ new Date()))).limit(1);
    if (!deal) throw new TRPCError6({ code: "NOT_FOUND", message: "Deal not found or expired" });
    if (deal.maxClaims !== null && (deal.claimsCount ?? 0) >= deal.maxClaims) throw new TRPCError6({ code: "CONFLICT", message: "Deal is sold out" });
    const claimCode = nanoid(10).toUpperCase();
    const [claim] = await db.insert(dealClaims).values({ dealId: input.dealId, patientId: ctx.user.id, claimCode, status: "claimed" }).returning();
    await db.update(deals).set({ claimsCount: (deal.claimsCount ?? 0) + 1 }).where(eq4(deals.id, input.dealId));
    return { claimId: claim.id, claimCode };
  })
});
var notificationsRouter = router({
  list: protectedProcedure.input(z5.object({ unreadOnly: z5.boolean().default(false), limit: z5.number().int().min(1).max(50).default(20) })).query(async ({ ctx, input }) => {
    const db = requireDb();
    const conditions = [eq4(notifications.userId, ctx.user.id)];
    if (input.unreadOnly) conditions.push(eq4(notifications.readAt, null));
    return db.select().from(notifications).where(and3(...conditions)).orderBy(desc3(notifications.createdAt)).limit(input.limit);
  }),
  markRead: protectedProcedure.input(z5.object({ notificationId: z5.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    await db.update(notifications).set({ readAt: /* @__PURE__ */ new Date() }).where(and3(eq4(notifications.id, input.notificationId), eq4(notifications.userId, ctx.user.id)));
    return { ok: true };
  })
});
var adminRouter = router({
  stats: adminProcedure.query(async () => {
    const db = requireDb();
    const [userCount] = await db.select({ count: users.id }).from(users);
    const [providerCount] = await db.select({ count: providerProfiles.id }).from(providerProfiles);
    return { users: userCount, providers: providerCount };
  }),
  verifyProvider: adminProcedure.input(z5.object({ providerId: z5.number().int().positive(), status: z5.enum(["verified", "rejected"]), note: z5.string().max(500).optional() })).mutation(async ({ input }) => {
    const db = requireDb();
    await db.update(providerProfiles).set({ verificationStatus: input.status, updatedAt: /* @__PURE__ */ new Date() }).where(eq4(providerProfiles.id, input.providerId));
    return { ok: true };
  })
});

// server/routers/patient.ts
import { z as z6 } from "zod";
init_db();
init_schema();
import { eq as eq5, and as and4, desc as desc4, gte as gte4, lte as lte4 } from "drizzle-orm";
import { TRPCError as TRPCError7 } from "@trpc/server";
import { nanoid as nanoid2 } from "nanoid";
var reviewsRouter2 = router({
  forProvider: publicProcedure.input(z6.object({ providerId: z6.number().int().positive(), page: z6.number().int().min(1).default(1), limit: z6.number().int().min(1).max(50).default(10) })).query(async ({ input }) => {
    const db = requireDb();
    const rows = await db.select({ id: reviews.id, rating: reviews.rating, comment: reviews.comment, aspects: reviews.aspects, providerResponse: reviews.providerResponse, createdAt: reviews.createdAt, patientName: users.name, patientAvatar: users.avatarUrl }).from(reviews).innerJoin(users, eq5(users.id, reviews.patientId)).where(and4(eq5(reviews.providerId, input.providerId), eq5(reviews.isVisible, true), eq5(reviews.moderationStatus, "approved"))).orderBy(desc4(reviews.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  create: protectedProcedure.input(z6.object({ appointmentId: z6.number().int().positive(), rating: z6.number().int().min(1).max(5), comment: z6.string().max(2e3).optional(), aspects: z6.object({ waitTime: z6.number().min(1).max(5).optional(), communication: z6.number().min(1).max(5).optional(), facility: z6.number().min(1).max(5).optional() }).optional() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [appt] = await db.select().from(appointments).where(and4(eq5(appointments.id, input.appointmentId), eq5(appointments.patientId, ctx.user.id), eq5(appointments.status, "completed"))).limit(1);
    if (!appt) throw new TRPCError7({ code: "FORBIDDEN", message: "Can only review completed appointments" });
    const [review] = await db.insert(reviews).values({ appointmentId: input.appointmentId, patientId: ctx.user.id, providerId: appt.providerId, rating: input.rating, comment: input.comment ?? null, aspects: input.aspects ?? null, moderationStatus: "pending", isVerifiedAppointment: true }).returning();
    return { reviewId: review.id };
  })
});
var patientRouter2 = router({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb();
    const upcomingAppts = await db.select({ id: appointments.id, slotStart: appointments.slotStart, type: appointments.type, status: appointments.status, providerName: users.name }).from(appointments).innerJoin(providerProfiles, eq5(providerProfiles.id, appointments.providerId)).innerJoin(users, eq5(users.id, providerProfiles.userId)).where(and4(eq5(appointments.patientId, ctx.user.id), eq5(appointments.status, "confirmed"), gte4(appointments.slotStart, /* @__PURE__ */ new Date()))).orderBy(appointments.slotStart).limit(5);
    return { upcomingAppointments: upcomingAppts };
  })
});
var dealsRouter2 = router({
  list: publicProcedure.input(z6.object({ countryCode: z6.string().length(2).optional(), category: z6.string().optional(), page: z6.number().int().min(1).default(1), limit: z6.number().int().min(1).max(50).default(20) })).query(async ({ input }) => {
    const db = requireDb();
    const now = /* @__PURE__ */ new Date();
    const conditions = [eq5(deals.status, "active"), lte4(deals.validFrom, now), gte4(deals.validUntil, now)];
    if (input.countryCode) conditions.push(eq5(deals.countryCode, input.countryCode));
    if (input.category) conditions.push(eq5(deals.category, input.category));
    const rows = await db.select().from(deals).where(and4(...conditions)).orderBy(desc4(deals.isFeatured), desc4(deals.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  claim: protectedProcedure.input(z6.object({ dealId: z6.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [deal] = await db.select().from(deals).where(and4(eq5(deals.id, input.dealId), eq5(deals.status, "active"), gte4(deals.validUntil, /* @__PURE__ */ new Date()))).limit(1);
    if (!deal) throw new TRPCError7({ code: "NOT_FOUND", message: "Deal not found or expired" });
    if (deal.maxClaims !== null && (deal.claimsCount ?? 0) >= deal.maxClaims) throw new TRPCError7({ code: "CONFLICT", message: "Deal is sold out" });
    const claimCode = nanoid2(10).toUpperCase();
    const [claim] = await db.insert(dealClaims).values({ dealId: input.dealId, patientId: ctx.user.id, claimCode, status: "claimed" }).returning();
    await db.update(deals).set({ claimsCount: (deal.claimsCount ?? 0) + 1 }).where(eq5(deals.id, input.dealId));
    return { claimId: claim.id, claimCode };
  })
});
var notificationsRouter2 = router({
  list: protectedProcedure.input(z6.object({ unreadOnly: z6.boolean().default(false), limit: z6.number().int().min(1).max(50).default(20) })).query(async ({ ctx, input }) => {
    const db = requireDb();
    const conditions = [eq5(notifications.userId, ctx.user.id)];
    if (input.unreadOnly) conditions.push(eq5(notifications.readAt, null));
    return db.select().from(notifications).where(and4(...conditions)).orderBy(desc4(notifications.createdAt)).limit(input.limit);
  }),
  markRead: protectedProcedure.input(z6.object({ notificationId: z6.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    await db.update(notifications).set({ readAt: /* @__PURE__ */ new Date() }).where(and4(eq5(notifications.id, input.notificationId), eq5(notifications.userId, ctx.user.id)));
    return { ok: true };
  })
});
var adminRouter2 = router({
  stats: adminProcedure.query(async () => {
    const db = requireDb();
    const [userCount] = await db.select({ count: users.id }).from(users);
    const [providerCount] = await db.select({ count: providerProfiles.id }).from(providerProfiles);
    return { users: userCount, providers: providerCount };
  }),
  verifyProvider: adminProcedure.input(z6.object({ providerId: z6.number().int().positive(), status: z6.enum(["verified", "rejected"]), note: z6.string().max(500).optional() })).mutation(async ({ input }) => {
    const db = requireDb();
    await db.update(providerProfiles).set({ verificationStatus: input.status, updatedAt: /* @__PURE__ */ new Date() }).where(eq5(providerProfiles.id, input.providerId));
    return { ok: true };
  })
});

// server/routers/deals.ts
import { z as z7 } from "zod";
init_db();
init_schema();
import { eq as eq6, and as and5, desc as desc5, gte as gte5, lte as lte5 } from "drizzle-orm";
import { TRPCError as TRPCError8 } from "@trpc/server";
import { nanoid as nanoid3 } from "nanoid";
var reviewsRouter3 = router({
  forProvider: publicProcedure.input(z7.object({ providerId: z7.number().int().positive(), page: z7.number().int().min(1).default(1), limit: z7.number().int().min(1).max(50).default(10) })).query(async ({ input }) => {
    const db = requireDb();
    const rows = await db.select({ id: reviews.id, rating: reviews.rating, comment: reviews.comment, aspects: reviews.aspects, providerResponse: reviews.providerResponse, createdAt: reviews.createdAt, patientName: users.name, patientAvatar: users.avatarUrl }).from(reviews).innerJoin(users, eq6(users.id, reviews.patientId)).where(and5(eq6(reviews.providerId, input.providerId), eq6(reviews.isVisible, true), eq6(reviews.moderationStatus, "approved"))).orderBy(desc5(reviews.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  create: protectedProcedure.input(z7.object({ appointmentId: z7.number().int().positive(), rating: z7.number().int().min(1).max(5), comment: z7.string().max(2e3).optional(), aspects: z7.object({ waitTime: z7.number().min(1).max(5).optional(), communication: z7.number().min(1).max(5).optional(), facility: z7.number().min(1).max(5).optional() }).optional() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [appt] = await db.select().from(appointments).where(and5(eq6(appointments.id, input.appointmentId), eq6(appointments.patientId, ctx.user.id), eq6(appointments.status, "completed"))).limit(1);
    if (!appt) throw new TRPCError8({ code: "FORBIDDEN", message: "Can only review completed appointments" });
    const [review] = await db.insert(reviews).values({ appointmentId: input.appointmentId, patientId: ctx.user.id, providerId: appt.providerId, rating: input.rating, comment: input.comment ?? null, aspects: input.aspects ?? null, moderationStatus: "pending", isVerifiedAppointment: true }).returning();
    return { reviewId: review.id };
  })
});
var patientRouter3 = router({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb();
    const upcomingAppts = await db.select({ id: appointments.id, slotStart: appointments.slotStart, type: appointments.type, status: appointments.status, providerName: users.name }).from(appointments).innerJoin(providerProfiles, eq6(providerProfiles.id, appointments.providerId)).innerJoin(users, eq6(users.id, providerProfiles.userId)).where(and5(eq6(appointments.patientId, ctx.user.id), eq6(appointments.status, "confirmed"), gte5(appointments.slotStart, /* @__PURE__ */ new Date()))).orderBy(appointments.slotStart).limit(5);
    return { upcomingAppointments: upcomingAppts };
  })
});
var dealsRouter3 = router({
  list: publicProcedure.input(z7.object({ countryCode: z7.string().length(2).optional(), category: z7.string().optional(), page: z7.number().int().min(1).default(1), limit: z7.number().int().min(1).max(50).default(20) })).query(async ({ input }) => {
    const db = requireDb();
    const now = /* @__PURE__ */ new Date();
    const conditions = [eq6(deals.status, "active"), lte5(deals.validFrom, now), gte5(deals.validUntil, now)];
    if (input.countryCode) conditions.push(eq6(deals.countryCode, input.countryCode));
    if (input.category) conditions.push(eq6(deals.category, input.category));
    const rows = await db.select().from(deals).where(and5(...conditions)).orderBy(desc5(deals.isFeatured), desc5(deals.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  claim: protectedProcedure.input(z7.object({ dealId: z7.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [deal] = await db.select().from(deals).where(and5(eq6(deals.id, input.dealId), eq6(deals.status, "active"), gte5(deals.validUntil, /* @__PURE__ */ new Date()))).limit(1);
    if (!deal) throw new TRPCError8({ code: "NOT_FOUND", message: "Deal not found or expired" });
    if (deal.maxClaims !== null && (deal.claimsCount ?? 0) >= deal.maxClaims) throw new TRPCError8({ code: "CONFLICT", message: "Deal is sold out" });
    const claimCode = nanoid3(10).toUpperCase();
    const [claim] = await db.insert(dealClaims).values({ dealId: input.dealId, patientId: ctx.user.id, claimCode, status: "claimed" }).returning();
    await db.update(deals).set({ claimsCount: (deal.claimsCount ?? 0) + 1 }).where(eq6(deals.id, input.dealId));
    return { claimId: claim.id, claimCode };
  })
});
var notificationsRouter3 = router({
  list: protectedProcedure.input(z7.object({ unreadOnly: z7.boolean().default(false), limit: z7.number().int().min(1).max(50).default(20) })).query(async ({ ctx, input }) => {
    const db = requireDb();
    const conditions = [eq6(notifications.userId, ctx.user.id)];
    if (input.unreadOnly) conditions.push(eq6(notifications.readAt, null));
    return db.select().from(notifications).where(and5(...conditions)).orderBy(desc5(notifications.createdAt)).limit(input.limit);
  }),
  markRead: protectedProcedure.input(z7.object({ notificationId: z7.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    await db.update(notifications).set({ readAt: /* @__PURE__ */ new Date() }).where(and5(eq6(notifications.id, input.notificationId), eq6(notifications.userId, ctx.user.id)));
    return { ok: true };
  })
});
var adminRouter3 = router({
  stats: adminProcedure.query(async () => {
    const db = requireDb();
    const [userCount] = await db.select({ count: users.id }).from(users);
    const [providerCount] = await db.select({ count: providerProfiles.id }).from(providerProfiles);
    return { users: userCount, providers: providerCount };
  }),
  verifyProvider: adminProcedure.input(z7.object({ providerId: z7.number().int().positive(), status: z7.enum(["verified", "rejected"]), note: z7.string().max(500).optional() })).mutation(async ({ input }) => {
    const db = requireDb();
    await db.update(providerProfiles).set({ verificationStatus: input.status, updatedAt: /* @__PURE__ */ new Date() }).where(eq6(providerProfiles.id, input.providerId));
    return { ok: true };
  })
});

// server/routers/notifications.ts
import { z as z8 } from "zod";
init_db();
init_schema();
import { eq as eq7, and as and6, desc as desc6, gte as gte6, lte as lte6 } from "drizzle-orm";
import { TRPCError as TRPCError9 } from "@trpc/server";
import { nanoid as nanoid4 } from "nanoid";
var reviewsRouter4 = router({
  forProvider: publicProcedure.input(z8.object({ providerId: z8.number().int().positive(), page: z8.number().int().min(1).default(1), limit: z8.number().int().min(1).max(50).default(10) })).query(async ({ input }) => {
    const db = requireDb();
    const rows = await db.select({ id: reviews.id, rating: reviews.rating, comment: reviews.comment, aspects: reviews.aspects, providerResponse: reviews.providerResponse, createdAt: reviews.createdAt, patientName: users.name, patientAvatar: users.avatarUrl }).from(reviews).innerJoin(users, eq7(users.id, reviews.patientId)).where(and6(eq7(reviews.providerId, input.providerId), eq7(reviews.isVisible, true), eq7(reviews.moderationStatus, "approved"))).orderBy(desc6(reviews.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  create: protectedProcedure.input(z8.object({ appointmentId: z8.number().int().positive(), rating: z8.number().int().min(1).max(5), comment: z8.string().max(2e3).optional(), aspects: z8.object({ waitTime: z8.number().min(1).max(5).optional(), communication: z8.number().min(1).max(5).optional(), facility: z8.number().min(1).max(5).optional() }).optional() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [appt] = await db.select().from(appointments).where(and6(eq7(appointments.id, input.appointmentId), eq7(appointments.patientId, ctx.user.id), eq7(appointments.status, "completed"))).limit(1);
    if (!appt) throw new TRPCError9({ code: "FORBIDDEN", message: "Can only review completed appointments" });
    const [review] = await db.insert(reviews).values({ appointmentId: input.appointmentId, patientId: ctx.user.id, providerId: appt.providerId, rating: input.rating, comment: input.comment ?? null, aspects: input.aspects ?? null, moderationStatus: "pending", isVerifiedAppointment: true }).returning();
    return { reviewId: review.id };
  })
});
var patientRouter4 = router({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb();
    const upcomingAppts = await db.select({ id: appointments.id, slotStart: appointments.slotStart, type: appointments.type, status: appointments.status, providerName: users.name }).from(appointments).innerJoin(providerProfiles, eq7(providerProfiles.id, appointments.providerId)).innerJoin(users, eq7(users.id, providerProfiles.userId)).where(and6(eq7(appointments.patientId, ctx.user.id), eq7(appointments.status, "confirmed"), gte6(appointments.slotStart, /* @__PURE__ */ new Date()))).orderBy(appointments.slotStart).limit(5);
    return { upcomingAppointments: upcomingAppts };
  })
});
var dealsRouter4 = router({
  list: publicProcedure.input(z8.object({ countryCode: z8.string().length(2).optional(), category: z8.string().optional(), page: z8.number().int().min(1).default(1), limit: z8.number().int().min(1).max(50).default(20) })).query(async ({ input }) => {
    const db = requireDb();
    const now = /* @__PURE__ */ new Date();
    const conditions = [eq7(deals.status, "active"), lte6(deals.validFrom, now), gte6(deals.validUntil, now)];
    if (input.countryCode) conditions.push(eq7(deals.countryCode, input.countryCode));
    if (input.category) conditions.push(eq7(deals.category, input.category));
    const rows = await db.select().from(deals).where(and6(...conditions)).orderBy(desc6(deals.isFeatured), desc6(deals.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  claim: protectedProcedure.input(z8.object({ dealId: z8.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [deal] = await db.select().from(deals).where(and6(eq7(deals.id, input.dealId), eq7(deals.status, "active"), gte6(deals.validUntil, /* @__PURE__ */ new Date()))).limit(1);
    if (!deal) throw new TRPCError9({ code: "NOT_FOUND", message: "Deal not found or expired" });
    if (deal.maxClaims !== null && (deal.claimsCount ?? 0) >= deal.maxClaims) throw new TRPCError9({ code: "CONFLICT", message: "Deal is sold out" });
    const claimCode = nanoid4(10).toUpperCase();
    const [claim] = await db.insert(dealClaims).values({ dealId: input.dealId, patientId: ctx.user.id, claimCode, status: "claimed" }).returning();
    await db.update(deals).set({ claimsCount: (deal.claimsCount ?? 0) + 1 }).where(eq7(deals.id, input.dealId));
    return { claimId: claim.id, claimCode };
  })
});
var notificationsRouter4 = router({
  list: protectedProcedure.input(z8.object({ unreadOnly: z8.boolean().default(false), limit: z8.number().int().min(1).max(50).default(20) })).query(async ({ ctx, input }) => {
    const db = requireDb();
    const conditions = [eq7(notifications.userId, ctx.user.id)];
    if (input.unreadOnly) conditions.push(eq7(notifications.readAt, null));
    return db.select().from(notifications).where(and6(...conditions)).orderBy(desc6(notifications.createdAt)).limit(input.limit);
  }),
  markRead: protectedProcedure.input(z8.object({ notificationId: z8.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    await db.update(notifications).set({ readAt: /* @__PURE__ */ new Date() }).where(and6(eq7(notifications.id, input.notificationId), eq7(notifications.userId, ctx.user.id)));
    return { ok: true };
  })
});
var adminRouter4 = router({
  stats: adminProcedure.query(async () => {
    const db = requireDb();
    const [userCount] = await db.select({ count: users.id }).from(users);
    const [providerCount] = await db.select({ count: providerProfiles.id }).from(providerProfiles);
    return { users: userCount, providers: providerCount };
  }),
  verifyProvider: adminProcedure.input(z8.object({ providerId: z8.number().int().positive(), status: z8.enum(["verified", "rejected"]), note: z8.string().max(500).optional() })).mutation(async ({ input }) => {
    const db = requireDb();
    await db.update(providerProfiles).set({ verificationStatus: input.status, updatedAt: /* @__PURE__ */ new Date() }).where(eq7(providerProfiles.id, input.providerId));
    return { ok: true };
  })
});

// server/routers/admin.ts
import { z as z9 } from "zod";
init_db();
init_schema();
import { eq as eq8, and as and7, desc as desc7, gte as gte7, lte as lte7 } from "drizzle-orm";
import { TRPCError as TRPCError10 } from "@trpc/server";
import { nanoid as nanoid5 } from "nanoid";
var reviewsRouter5 = router({
  forProvider: publicProcedure.input(z9.object({ providerId: z9.number().int().positive(), page: z9.number().int().min(1).default(1), limit: z9.number().int().min(1).max(50).default(10) })).query(async ({ input }) => {
    const db = requireDb();
    const rows = await db.select({ id: reviews.id, rating: reviews.rating, comment: reviews.comment, aspects: reviews.aspects, providerResponse: reviews.providerResponse, createdAt: reviews.createdAt, patientName: users.name, patientAvatar: users.avatarUrl }).from(reviews).innerJoin(users, eq8(users.id, reviews.patientId)).where(and7(eq8(reviews.providerId, input.providerId), eq8(reviews.isVisible, true), eq8(reviews.moderationStatus, "approved"))).orderBy(desc7(reviews.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  create: protectedProcedure.input(z9.object({ appointmentId: z9.number().int().positive(), rating: z9.number().int().min(1).max(5), comment: z9.string().max(2e3).optional(), aspects: z9.object({ waitTime: z9.number().min(1).max(5).optional(), communication: z9.number().min(1).max(5).optional(), facility: z9.number().min(1).max(5).optional() }).optional() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [appt] = await db.select().from(appointments).where(and7(eq8(appointments.id, input.appointmentId), eq8(appointments.patientId, ctx.user.id), eq8(appointments.status, "completed"))).limit(1);
    if (!appt) throw new TRPCError10({ code: "FORBIDDEN", message: "Can only review completed appointments" });
    const [review] = await db.insert(reviews).values({ appointmentId: input.appointmentId, patientId: ctx.user.id, providerId: appt.providerId, rating: input.rating, comment: input.comment ?? null, aspects: input.aspects ?? null, moderationStatus: "pending", isVerifiedAppointment: true }).returning();
    return { reviewId: review.id };
  })
});
var patientRouter5 = router({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb();
    const upcomingAppts = await db.select({ id: appointments.id, slotStart: appointments.slotStart, type: appointments.type, status: appointments.status, providerName: users.name }).from(appointments).innerJoin(providerProfiles, eq8(providerProfiles.id, appointments.providerId)).innerJoin(users, eq8(users.id, providerProfiles.userId)).where(and7(eq8(appointments.patientId, ctx.user.id), eq8(appointments.status, "confirmed"), gte7(appointments.slotStart, /* @__PURE__ */ new Date()))).orderBy(appointments.slotStart).limit(5);
    return { upcomingAppointments: upcomingAppts };
  })
});
var dealsRouter5 = router({
  list: publicProcedure.input(z9.object({ countryCode: z9.string().length(2).optional(), category: z9.string().optional(), page: z9.number().int().min(1).default(1), limit: z9.number().int().min(1).max(50).default(20) })).query(async ({ input }) => {
    const db = requireDb();
    const now = /* @__PURE__ */ new Date();
    const conditions = [eq8(deals.status, "active"), lte7(deals.validFrom, now), gte7(deals.validUntil, now)];
    if (input.countryCode) conditions.push(eq8(deals.countryCode, input.countryCode));
    if (input.category) conditions.push(eq8(deals.category, input.category));
    const rows = await db.select().from(deals).where(and7(...conditions)).orderBy(desc7(deals.isFeatured), desc7(deals.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  claim: protectedProcedure.input(z9.object({ dealId: z9.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    const [deal] = await db.select().from(deals).where(and7(eq8(deals.id, input.dealId), eq8(deals.status, "active"), gte7(deals.validUntil, /* @__PURE__ */ new Date()))).limit(1);
    if (!deal) throw new TRPCError10({ code: "NOT_FOUND", message: "Deal not found or expired" });
    if (deal.maxClaims !== null && (deal.claimsCount ?? 0) >= deal.maxClaims) throw new TRPCError10({ code: "CONFLICT", message: "Deal is sold out" });
    const claimCode = nanoid5(10).toUpperCase();
    const [claim] = await db.insert(dealClaims).values({ dealId: input.dealId, patientId: ctx.user.id, claimCode, status: "claimed" }).returning();
    await db.update(deals).set({ claimsCount: (deal.claimsCount ?? 0) + 1 }).where(eq8(deals.id, input.dealId));
    return { claimId: claim.id, claimCode };
  })
});
var notificationsRouter5 = router({
  list: protectedProcedure.input(z9.object({ unreadOnly: z9.boolean().default(false), limit: z9.number().int().min(1).max(50).default(20) })).query(async ({ ctx, input }) => {
    const db = requireDb();
    const conditions = [eq8(notifications.userId, ctx.user.id)];
    if (input.unreadOnly) conditions.push(eq8(notifications.readAt, null));
    return db.select().from(notifications).where(and7(...conditions)).orderBy(desc7(notifications.createdAt)).limit(input.limit);
  }),
  markRead: protectedProcedure.input(z9.object({ notificationId: z9.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = requireDb();
    await db.update(notifications).set({ readAt: /* @__PURE__ */ new Date() }).where(and7(eq8(notifications.id, input.notificationId), eq8(notifications.userId, ctx.user.id)));
    return { ok: true };
  })
});
var adminRouter5 = router({
  stats: adminProcedure.query(async () => {
    const db = requireDb();
    const [userCount] = await db.select({ count: users.id }).from(users);
    const [providerCount] = await db.select({ count: providerProfiles.id }).from(providerProfiles);
    return { users: userCount, providers: providerCount };
  }),
  verifyProvider: adminProcedure.input(z9.object({ providerId: z9.number().int().positive(), status: z9.enum(["verified", "rejected"]), note: z9.string().max(500).optional() })).mutation(async ({ input }) => {
    const db = requireDb();
    await db.update(providerProfiles).set({ verificationStatus: input.status, updatedAt: /* @__PURE__ */ new Date() }).where(eq8(providerProfiles.id, input.providerId));
    return { ok: true };
  })
});

// server/routers/events.ts
import { z as z10 } from "zod";
init_db();
init_schema();
import { eq as eq9, and as and8, desc as desc8, ilike as ilike2, or } from "drizzle-orm";
import { TRPCError as TRPCError11 } from "@trpc/server";
import { nanoid as nanoid6 } from "nanoid";
var eventsRouter = router({
  list: publicProcedure.input(z10.object({
    query: z10.string().optional(),
    type: z10.string().optional(),
    country: z10.string().optional(),
    page: z10.number().int().min(1).default(1),
    limit: z10.number().int().min(1).max(50).default(12)
  })).query(async ({ input }) => {
    const db = requireDb();
    const conditions = [eq9(events.status, "active")];
    if (input.query) {
      conditions.push(
        or(
          ilike2(events.title, `%${input.query}%`),
          ilike2(events.organizer, `%${input.query}%`),
          ilike2(events.description, `%${input.query}%`)
        )
      );
    }
    if (input.type) conditions.push(eq9(events.type, input.type));
    if (input.country) conditions.push(eq9(events.countryCode, input.country));
    const rows = await db.select().from(events).where(and8(...conditions)).orderBy(desc8(events.featured), events.startDate).limit(input.limit).offset((input.page - 1) * input.limit);
    return rows;
  }),
  getById: publicProcedure.input(z10.object({ id: z10.number().int().positive() })).query(async ({ input }) => {
    const db = requireDb();
    const [event] = await db.select().from(events).where(eq9(events.id, input.id)).limit(1);
    if (!event) throw new TRPCError11({ code: "NOT_FOUND", message: "Event not found" });
    return event;
  }),
  register: publicProcedure.input(z10.object({
    eventId: z10.number().int().positive(),
    name: z10.string().min(2).max(200),
    email: z10.string().email(),
    phone: z10.string().optional(),
    organization: z10.string().optional(),
    role: z10.string().optional(),
    message: z10.string().max(500).optional()
  })).mutation(async ({ input }) => {
    const db = requireDb();
    const [event] = await db.select().from(events).where(eq9(events.id, input.eventId)).limit(1);
    if (!event) throw new TRPCError11({ code: "NOT_FOUND", message: "Event not found" });
    const token = nanoid6(32);
    const [reg] = await db.insert(eventRegistrations).values({
      eventId: input.eventId,
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      organization: input.organization ?? null,
      role: input.role ?? null,
      message: input.message ?? null,
      status: "pending",
      checkInToken: token
    }).returning();
    await db.update(events).set({ attendeeCount: (event.attendeeCount ?? 0) + 1 }).where(eq9(events.id, input.eventId));
    return { registrationId: reg.id, token };
  })
});

// server/routers.ts
var appRouter = router({
  auth: authRouter,
  providers: providersRouter,
  booking: bookingRouter,
  reviews: reviewsRouter,
  patient: patientRouter2,
  deals: dealsRouter3,
  notifications: notificationsRouter4,
  admin: adminRouter5,
  events: eventsRouter
});

// server/_core/jwt.ts
init_env();
import * as jose from "jose";
var secret = new TextEncoder().encode(ENV.JWT_SECRET);
var supabaseSecret = new TextEncoder().encode(ENV.SUPABASE_JWT_SECRET);
async function verifySupabaseJwt(token) {
  const { payload } = await jose.jwtVerify(token, supabaseSecret, {
    algorithms: ["HS256"]
  });
  return payload;
}
async function verifyJwt(token) {
  const { payload } = await jose.jwtVerify(token, secret, {
    algorithms: ["HS256"]
  });
  return payload;
}
function extractBearerToken(authHeader) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7).trim();
  return token.length > 0 ? token : null;
}

// server/_core/context.ts
init_db();
init_schema();
import { eq as eq10 } from "drizzle-orm";
async function createContext(opts) {
  const authHeader = opts.req.headers.authorization;
  const token = extractBearerToken(authHeader);
  if (!token) {
    return { req: opts.req, res: opts.res, user: null };
  }
  try {
    const payload = await verifySupabaseJwt(token);
    const supabaseUid = payload.sub;
    if (!supabaseUid) return { req: opts.req, res: opts.res, user: null };
    const db = getDb();
    const [dbUser] = await db.select({
      id: users.id,
      supabaseUid: users.supabaseUid,
      email: users.email,
      role: users.role,
      isActive: users.isActive
    }).from(users).where(eq10(users.supabaseUid, supabaseUid)).limit(1);
    if (!dbUser || !dbUser.isActive) {
      return { req: opts.req, res: opts.res, user: null };
    }
    return {
      req: opts.req,
      res: opts.res,
      user: {
        id: dbUser.id,
        supabaseUid: dbUser.supabaseUid,
        email: dbUser.email ?? null,
        role: dbUser.role ?? "user"
      }
    };
  } catch {
    return { req: opts.req, res: opts.res, user: null };
  }
}

// server/_core/vite.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
async function setupVite(app, server) {
  const { createServer: createServer2 } = await import("vite");
  const vite = await createServer2({
    configFile: path.resolve(__dirname, "../../vite.config.ts"),
    server: { middlewareMode: true },
    appType: "spa",
    root: path.resolve(__dirname, "../../client")
  });
  app.use(vite.middlewares);
  return vite;
}
function serveStatic(app) {
  const distPath = path.resolve(__dirname, "../../dist/public");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// server/stripe/webhook.ts
init_env();
init_db();
init_schema();
import Stripe from "stripe";
import { eq as eq11 } from "drizzle-orm";
function getStripe() {
  return new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
}
async function handleStripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  const db = getDb();
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        const appointmentId = pi.metadata?.appointmentId ? parseInt(pi.metadata.appointmentId) : null;
        if (appointmentId) {
          await db.update(appointments).set({
            paymentStatus: "paid",
            stripeReceiptUrl: pi.latest_charge ?? null
          }).where(eq11(appointments.stripePaymentIntentId, pi.id));
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        const appointmentId = pi.metadata?.appointmentId ? parseInt(pi.metadata.appointmentId) : null;
        if (appointmentId) {
          await db.update(appointments).set({ paymentStatus: "unpaid" }).where(eq11(appointments.stripePaymentIntentId, pi.id));
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const status = event.type === "customer.subscription.deleted" ? "cancelled" : sub.status;
        const item = sub.items?.data?.[0];
        const periodStart = item?.current_period_start ?? null;
        const periodEnd = item?.current_period_end ?? null;
        await db.update(providerSubscriptions).set({
          status,
          currentPeriodStart: periodStart ? new Date(periodStart * 1e3) : null,
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1e3) : null,
          cancelAtPeriodEnd: sub.cancel_at_period_end
        }).where(eq11(providerSubscriptions.stripeSubscriptionId, sub.id));
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error("[stripe/webhook] handler error:", err);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}

// server/daily/webhook.ts
init_db();
init_schema();
import { eq as eq12 } from "drizzle-orm";
async function handleDailyWebhook(req, res) {
  const event = req.body;
  if (!event?.action) return res.json({ received: true });
  const db = getDb();
  try {
    switch (event.action) {
      case "recording.ready": {
        const roomName = event.payload?.room_name;
        if (!roomName) break;
        await db.update(teleconsultations).set({
          recordingStatus: "ready",
          recordingUrl: event.payload?.download_url ?? null,
          recordingId: event.payload?.recording_id ?? null,
          recordingExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
        }).where(eq12(teleconsultations.roomName, roomName));
        break;
      }
      case "recording.error": {
        const roomName = event.payload?.room_name;
        if (!roomName) break;
        await db.update(teleconsultations).set({ recordingStatus: "failed" }).where(eq12(teleconsultations.roomName, roomName));
        break;
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error("[daily/webhook]", err);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}

// server/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again in 15 minutes" },
  skipSuccessfulRequests: false
});
var apiLimiter = rateLimit({
  windowMs: 60 * 1e3,
  // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
  skip: (req) => req.method === "OPTIONS"
});
var uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Upload limit exceeded. Try again in an hour." }
});
var aiLimiter = rateLimit({
  windowMs: 60 * 1e3,
  // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "AI request limit reached. Please wait a moment." }
});

// server/middleware/auth.ts
init_db();
init_schema();
import { eq as eq13 } from "drizzle-orm";
async function requireAuth(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    const payload = await verifySupabaseJwt(token);
    const supabaseUid = payload.sub;
    if (!supabaseUid) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    const db = getDb();
    const [dbUser] = await db.select({
      id: users.id,
      supabaseUid: users.supabaseUid,
      email: users.email,
      role: users.role,
      isActive: users.isActive
    }).from(users).where(eq13(users.supabaseUid, supabaseUid)).limit(1);
    if (!dbUser || !dbUser.isActive) {
      res.status(401).json({ error: "User not found or inactive" });
      return;
    }
    req.authUser = {
      id: dbUser.id,
      supabaseUid: dbUser.supabaseUid,
      email: dbUser.email ?? null,
      role: dbUser.role ?? "user"
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
async function requireProviderAuth(req, res, next) {
  await requireAuth(req, res, async () => {
    if (!req.authUser) return;
    if (req.authUser.role !== "provider" && req.authUser.role !== "admin") {
      res.status(403).json({ error: "Provider account required" });
      return;
    }
    next();
  });
}
function requireCronSecret(req, res, next) {
  const { ENV: ENV2 } = (init_env(), __toCommonJS(env_exports));
  const secret2 = ENV2.CRON_SECRET;
  const provided = req.headers["x-cron-secret"];
  if (!secret2) {
    console.warn("[cron] WARNING: CRON_SECRET is not set \u2014 cron endpoint is open");
    next();
    return;
  }
  if (provided !== secret2) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// server/index.ts
init_db();

// server/jobs/cronScheduler.ts
import cron from "node-cron";

// server/jobs/reminders.ts
init_db();
init_schema();
import { eq as eq14, and as and9, gte as gte9, lte as lte8 } from "drizzle-orm";
async function runAllReminders() {
  const db = getDb();
  const now = /* @__PURE__ */ new Date();
  const window24hStart = new Date(now.getTime() + 23 * 60 * 60 * 1e3);
  const window24hEnd = new Date(now.getTime() + 25 * 60 * 60 * 1e3);
  const window1hStart = new Date(now.getTime() + 55 * 60 * 1e3);
  const window1hEnd = new Date(now.getTime() + 65 * 60 * 1e3);
  const pending24h = await db.select({ id: appointments.id, patientId: appointments.patientId }).from(appointments).where(
    and9(
      eq14(appointments.status, "confirmed"),
      eq14(appointments.reminder24hSent, false),
      gte9(appointments.slotStart, window24hStart),
      lte8(appointments.slotStart, window24hEnd)
    )
  );
  const pending1h = await db.select({ id: appointments.id, patientId: appointments.patientId }).from(appointments).where(
    and9(
      eq14(appointments.status, "confirmed"),
      eq14(appointments.reminder1hSent, false),
      gte9(appointments.slotStart, window1hStart),
      lte8(appointments.slotStart, window1hEnd)
    )
  );
  for (const appt of pending24h) {
    await db.update(appointments).set({ reminder24hSent: true, reminder24hSentAt: now }).where(eq14(appointments.id, appt.id));
  }
  for (const appt of pending1h) {
    await db.update(appointments).set({ reminder1hSent: true, reminder1hSentAt: now }).where(eq14(appointments.id, appt.id));
  }
  return { sent24h: pending24h.length, sent1h: pending1h.length };
}

// server/jobs/expireRecordings.ts
init_db();
init_schema();
import { and as and10, eq as eq15, lte as lte9, isNotNull } from "drizzle-orm";
async function expireRecordings() {
  const db = getDb();
  const now = /* @__PURE__ */ new Date();
  const result = await db.update(teleconsultations).set({ recordingStatus: "expired", recordingUrl: null }).where(
    and10(
      eq15(teleconsultations.recordingStatus, "ready"),
      isNotNull(teleconsultations.recordingExpiresAt),
      lte9(teleconsultations.recordingExpiresAt, now)
    )
  );
  return { expired: 0 };
}

// server/jobs/eventReminders.ts
async function runEventReminders() {
  return { sent: 0 };
}

// server/jobs/cronScheduler.ts
init_db();
init_schema();
async function logCron(jobName, fn) {
  const start = Date.now();
  try {
    const result = await fn();
    await getDb().insert(cronLogs).values({
      jobName,
      status: "success",
      durationMs: Date.now() - start,
      result
    });
  } catch (err) {
    console.error(`[cron/${jobName}]`, err);
    await getDb().insert(cronLogs).values({
      jobName,
      status: "error",
      durationMs: Date.now() - start,
      errorMessage: err.message
    });
  }
}
function startCronScheduler() {
  cron.schedule("*/15 * * * *", () => {
    logCron("appointment-reminders", runAllReminders);
  });
  cron.schedule("0 * * * *", () => {
    logCron("event-reminders", runEventReminders);
  });
  cron.schedule("0 2 * * *", () => {
    logCron("expire-recordings", expireRecordings);
  });
  console.log("[cron] Scheduler started");
}

// server/index.ts
import multer from "multer";

// server/storage.ts
init_env();
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
var s3 = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY
  }
});
async function storagePut(key, body, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: ENV.AWS_S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );
  const url = `https://${ENV.AWS_S3_BUCKET}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`;
  return { url, key };
}

// server/sitemap.ts
init_db();
init_schema();
import { eq as eq16 } from "drizzle-orm";
var BASE_URL = "https://www.qliniqit.com";
async function generateSitemap() {
  const db = getDb();
  const [providers, specs] = await Promise.all([
    db.select({ slug: providerProfiles.slug }).from(providerProfiles).where(eq16(providerProfiles.isActive, true)),
    db.select({ slug: specialties.slug }).from(specialties).where(eq16(specialties.isActive, true))
  ]);
  const staticUrls = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/find-a-doctor", priority: "0.9", changefreq: "daily" },
    { loc: "/deals", priority: "0.8", changefreq: "hourly" },
    { loc: "/events", priority: "0.7", changefreq: "daily" },
    { loc: "/about", priority: "0.5", changefreq: "monthly" }
  ];
  const urls = [
    ...staticUrls.map(
      ({ loc, priority, changefreq }) => urlEntry(`${BASE_URL}${loc}`, priority, changefreq)
    ),
    ...providers.filter((p) => p.slug).map((p) => urlEntry(`${BASE_URL}/provider/${p.slug}`, "0.8", "weekly")),
    ...specs.map((s) => urlEntry(`${BASE_URL}/specialty/${s.slug}`, "0.7", "weekly"))
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}
function urlEntry(loc, priority, changefreq) {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
  </url>`;
}

// server/lib/ogImage.ts
init_db();
init_schema();
import { eq as eq17 } from "drizzle-orm";
async function getProviderOgData(slug) {
  const db = getDb();
  const [row] = await db.select({
    name: users.name,
    rating: providerProfiles.ratingAvg,
    reviewCount: providerProfiles.reviewCount
  }).from(providerProfiles).innerJoin(users, eq17(users.id, providerProfiles.userId)).where(eq17(providerProfiles.slug, slug)).limit(1);
  if (!row) return null;
  return {
    name: row.name ?? "Provider",
    specialty: "Healthcare Professional",
    rating: row.rating ?? "0",
    reviewCount: row.reviewCount ?? 0
  };
}
async function renderProviderOgImage(data) {
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#0d9488"/>
    <text x="100" y="280" font-family="sans-serif" font-size="64" font-weight="bold" fill="white">${data.name}</text>
    <text x="100" y="360" font-family="sans-serif" font-size="36" fill="rgba(255,255,255,0.85)">${data.specialty}</text>
    <text x="100" y="440" font-family="sans-serif" font-size="32" fill="rgba(255,255,255,0.7)">\u2B50 ${data.rating} \xB7 ${data.reviewCount} reviews</text>
    <text x="100" y="560" font-family="sans-serif" font-size="28" fill="rgba(255,255,255,0.6)">qliniqit.com</text>
  </svg>`;
  const { Resvg } = await import("@resvg/resvg-js");
  const resvg = new Resvg(svg);
  return Buffer.from(resvg.render().asPng());
}

// server/lib/pdfGenerator.ts
init_db();
init_schema();
import { eq as eq18 } from "drizzle-orm";
import PDFDocument from "pdfkit";
var TEAL = "#0D9488";
async function buildPdf(buildFn) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    buildFn(doc);
    doc.end();
  });
}
async function generateVisitNotePdf(noteId, requestingUserId) {
  const db = getDb();
  const [row] = await db.select({
    note: visitNotes,
    providerName: users.name,
    slotStart: appointments.slotStart
  }).from(visitNotes).innerJoin(appointments, eq18(appointments.id, visitNotes.appointmentId)).innerJoin(providerProfiles, eq18(providerProfiles.id, visitNotes.providerId)).innerJoin(users, eq18(users.id, providerProfiles.userId)).where(eq18(visitNotes.id, noteId)).limit(1);
  if (!row) throw new Error("NOT_FOUND");
  const [providerProfile] = await db.select({ id: providerProfiles.id }).from(providerProfiles).where(eq18(providerProfiles.userId, requestingUserId)).limit(1);
  const isProvider = providerProfile && row.note.providerId === providerProfile.id;
  const isPatient = row.note.patientId === requestingUserId;
  if (!isProvider && !isPatient) throw new Error("FORBIDDEN");
  if (isPatient && !row.note.isSharedWithPatient) throw new Error("FORBIDDEN");
  return buildPdf((doc) => {
    doc.fontSize(20).font("Helvetica-Bold").fillColor(TEAL).text("Qliniqit", { align: "center" });
    doc.fontSize(12).font("Helvetica").fillColor("#64748b").text("Visit Summary", { align: "center" });
    doc.moveDown();
    const dateStr = row.slotStart ? new Date(row.slotStart).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "N/A";
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#1e293b").text("Visit Date: ", { continued: true });
    doc.font("Helvetica").text(dateStr);
    doc.font("Helvetica-Bold").text("Provider: ", { continued: true });
    doc.font("Helvetica").text(`Dr. ${row.providerName ?? "Unknown"}`);
    doc.moveDown();
    const fields = [
      ["Chief Complaint", row.note.chiefComplaint],
      ["Diagnosis", row.note.diagnosis],
      ["Treatment Plan", row.note.treatmentPlan],
      ["Prescriptions", row.note.prescriptions],
      ["Follow-up Date", row.note.followUpDate],
      ["Follow-up Notes", row.note.followUpNotes]
    ];
    for (const [label, value] of fields) {
      if (!value) continue;
      doc.fontSize(10).font("Helvetica-Bold").fillColor(TEAL).text(label);
      doc.fontSize(9).font("Helvetica").fillColor("#1e293b").text(value, { indent: 10 });
      doc.moveDown(0.5);
    }
  });
}

// server/lib/healthSummaryPdf.ts
async function generateHealthSummaryPdf(_userId) {
  return Buffer.from("Health summary PDF placeholder");
}

// server/lib/healthRecordsPdf.ts
async function generateHealthRecordsPdf(_userId) {
  return Buffer.from("Health records PDF placeholder");
}

// server/lib/payoutHistoryCsv.ts
init_db();
init_schema();
import { eq as eq19, desc as desc9 } from "drizzle-orm";
async function generatePayoutHistoryCsv(userId) {
  const db = getDb();
  const [profile] = await db.select({ id: providerProfiles.id }).from(providerProfiles).where(eq19(providerProfiles.userId, userId)).limit(1);
  if (!profile) throw new Error("Provider profile not found");
  const rows = await db.select().from(payoutRequests).where(eq19(payoutRequests.providerId, profile.id)).orderBy(desc9(payoutRequests.requestedAt));
  const headers = ["ID", "Amount", "Currency", "Status", "Requested At", "Processed At"];
  const csvRows = rows.map((r) => [
    r.id,
    r.amount,
    r.currency,
    r.status,
    r.requestedAt ? new Date(r.requestedAt).toISOString() : "",
    r.processedAt ? new Date(r.processedAt).toISOString() : ""
  ]);
  return [headers, ...csvRows].map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}

// server/index.ts
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(
    helmet({
      contentSecurityPolicy: ENV.NODE_ENV === "production",
      crossOriginEmbedderPolicy: false
      // required for Daily.co video
    })
  );
  const allowedOrigins = [
    ENV.VITE_APP_URL,
    "http://localhost:3000",
    "http://localhost:5173"
  ].filter(Boolean);
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
          cb(null, true);
        } else {
          cb(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    })
  );
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", ts: Date.now() });
  });
  app.post(
    "/api/stripe/webhook",
    express2.raw({ type: "application/json" }),
    handleStripeWebhook
  );
  app.post("/api/daily/webhook", express2.json(), handleDailyWebhook);
  app.use(express2.json({ limit: "10mb" }));
  app.use(express2.urlencoded({ limit: "10mb", extended: true }));
  app.use("/api", apiLimiter);
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /dashboard/",
        "Disallow: /api/",
        "Disallow: /settings/",
        "",
        "Sitemap: https://www.qliniqit.com/sitemap.xml"
      ].join("\n")
    );
  });
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const xml = await generateSitemap();
      res.set("Content-Type", "application/xml; charset=utf-8").set("Cache-Control", "public, max-age=3600").send(xml);
    } catch (err) {
      console.error("[sitemap]", err);
      res.status(500).send("Sitemap generation failed");
    }
  });
  app.get("/api/og/provider/:slug", async (req, res) => {
    try {
      const data = await getProviderOgData(req.params.slug);
      if (!data) return res.status(404).send("Provider not found");
      const png = await renderProviderOgImage(data);
      res.set("Content-Type", "image/png").set("Cache-Control", "public, max-age=3600, s-maxage=86400").set("Content-Length", String(png.length)).send(png);
    } catch (err) {
      console.error("[og/provider]", err);
      res.status(500).send("OG image generation failed");
    }
  });
  app.get("/api/unsubscribe", async (req, res) => {
    const token = req.query.token;
    if (!token) return res.status(400).send(unsubscribeHtml("invalid"));
    try {
      const payload = await verifyJwt(token);
      const userId = payload.userId;
      if (!userId) return res.status(400).send(unsubscribeHtml("invalid"));
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { notificationPreferences: notificationPreferences3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq21 } = await import("drizzle-orm");
      const db = getDb2();
      await db.update(notificationPreferences3).set({ remind24hOptOut: true, remind1hOptOut: true }).where(eq21(notificationPreferences3.userId, userId));
      console.log(`[unsubscribe] user ${userId} opted out`);
      return res.send(unsubscribeHtml("success"));
    } catch (err) {
      console.error("[unsubscribe]", err);
      return res.status(400).send(unsubscribeHtml("invalid"));
    }
  });
  const memStorage = multer({ storage: multer.memoryStorage(), limits: { fileSize: 16 * 1024 * 1024 } });
  const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      cb(null, allowed.includes(file.mimetype));
    }
  });
  app.post(
    "/api/upload/appointment-document",
    requireAuth,
    uploadLimiter,
    memStorage.single("file"),
    async (req, res) => {
      try {
        if (!req.file) return res.status(400).json({ error: "No file provided" });
        const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const ext = req.file.originalname.split(".").pop() ?? "bin";
        const fileKey = `appointment-docs/${suffix}.${ext}`;
        const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);
        return res.json({ fileUrl: url, fileKey });
      } catch (err) {
        console.error("[upload/appointment-document]", err);
        return res.status(500).json({ error: "Upload failed" });
      }
    }
  );
  app.post(
    "/api/upload/event-image",
    requireAuth,
    // was unauthenticated in original — fixed
    uploadLimiter,
    imageUpload.single("file"),
    async (req, res) => {
      try {
        if (!req.file) return res.status(400).json({ error: "No file provided" });
        const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const ext = req.file.originalname.split(".").pop() ?? "jpg";
        const fileKey = `event-images/${suffix}.${ext}`;
        const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);
        return res.json({ url, fileKey });
      } catch (err) {
        console.error("[upload/event-image]", err);
        return res.status(500).json({ error: "Upload failed" });
      }
    }
  );
  app.get("/api/visit-notes/:id/pdf", requireAuth, async (req, res) => {
    try {
      const noteId = parseInt(req.params.id, 10);
      if (isNaN(noteId)) return res.status(400).json({ error: "Invalid note ID" });
      const pdf = await generateVisitNotePdf(noteId, req.authUser.id);
      res.set("Content-Type", "application/pdf").set("Content-Disposition", `attachment; filename=visit-note-${noteId}.pdf`).send(pdf);
    } catch (err) {
      if (err.message === "NOT_FOUND") return res.status(404).json({ error: "Note not found" });
      if (err.message === "FORBIDDEN") return res.status(403).json({ error: "Access denied" });
      console.error("[visit-notes/pdf]", err);
      res.status(500).json({ error: "PDF generation failed" });
    }
  });
  app.get("/api/patient/health-summary-pdf", requireAuth, async (req, res) => {
    try {
      const pdf = await generateHealthSummaryPdf(req.authUser.id);
      res.set("Content-Type", "application/pdf").set("Content-Disposition", `attachment; filename=health-summary.pdf`).send(pdf);
    } catch (err) {
      console.error("[health-summary-pdf]", err);
      res.status(500).json({ error: "PDF generation failed" });
    }
  });
  app.get("/api/patient/health-records-pdf", requireAuth, async (req, res) => {
    try {
      const pdf = await generateHealthRecordsPdf(req.authUser.id);
      res.set("Content-Type", "application/pdf").set(
        "Content-Disposition",
        `attachment; filename=health-records-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.pdf`
      ).send(pdf);
    } catch (err) {
      console.error("[health-records-pdf]", err);
      res.status(500).json({ error: "PDF generation failed" });
    }
  });
  app.get("/api/provider/payout-history-csv", requireProviderAuth, async (req, res) => {
    try {
      const csv = await generatePayoutHistoryCsv(req.authUser.id);
      res.set("Content-Type", "text/csv").set("Content-Disposition", `attachment; filename=payout-history.csv`).send(csv);
    } catch (err) {
      console.error("[payout-history-csv]", err);
      res.status(500).json({ error: "CSV generation failed" });
    }
  });
  app.get("/api/ical/provider/:providerId", async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId, 10);
      if (isNaN(providerId)) return res.status(400).send("Invalid provider ID");
      const { generateProviderIcal: generateProviderIcal2 } = await Promise.resolve().then(() => (init_icalGenerator(), icalGenerator_exports));
      const ical = await generateProviderIcal2(providerId);
      res.set("Content-Type", "text/calendar; charset=utf-8").set("Content-Disposition", `attachment; filename=qliniqit-provider-${providerId}.ics`).send(ical);
    } catch (err) {
      console.error("[ical/provider]", err);
      res.status(500).send("iCal generation failed");
    }
  });
  app.post(
    "/api/twilio/inbound",
    express2.urlencoded({ extended: false }),
    async (req, res) => {
      try {
        const { isStopMessage: isStopMessage2, isStartMessage: isStartMessage2 } = await Promise.resolve().then(() => (init_twilio(), twilio_exports));
        const body = req.body?.Body ?? "";
        const from = (req.body?.From ?? "").replace("whatsapp:", "");
        if (from && (isStopMessage2(body) || isStartMessage2(body))) {
          const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
          const { users: users3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          const { eq: eq21 } = await import("drizzle-orm");
          const db = getDb2();
          await db.update(users3).set({ smsOptedOut: isStopMessage2(body) }).where(eq21(users3.phone, from));
        }
        res.set("Content-Type", "text/xml").send("<?xml version='1.0' encoding='UTF-8'?><Response></Response>");
      } catch (err) {
        console.error("[twilio/inbound]", err);
        res.set("Content-Type", "text/xml").send("<?xml version='1.0' encoding='UTF-8'?><Response></Response>");
      }
    }
  );
  app.post("/api/cron/reminders", requireCronSecret, async (_req, res) => {
    try {
      const { sent24h, sent1h } = await runAllReminders();
      res.json({ ok: true, sent24h, sent1h });
    } catch (err) {
      console.error("[cron/reminders]", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/cron/expire-recordings", requireCronSecret, async (_req, res) => {
    try {
      const result = await expireRecordings();
      res.json({ ok: true, ...result });
    } catch (err) {
      console.error("[cron/expire-recordings]", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/cron/event-reminders", requireCronSecret, async (_req, res) => {
    try {
      const result = await runEventReminders();
      res.json({ ok: true, ...result });
    } catch (err) {
      console.error("[cron/event-reminders]", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/cron/status", requireCronSecret, async (_req, res) => {
    try {
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { cronLogs: cronLogs2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { desc: desc10 } = await import("drizzle-orm");
      const logs = await getDb2().select().from(cronLogs2).orderBy(desc10(cronLogs2.ranAt)).limit(20);
      res.json({ ok: true, serverTime: (/* @__PURE__ */ new Date()).toISOString(), recentLogs: logs });
    } catch (err) {
      console.error("[cron/status]", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: ({ error, path: path2 }) => {
        if (error.code === "INTERNAL_SERVER_ERROR") {
          console.error(`[tRPC] ${path2}:`, error);
        }
      }
    })
  );
  if (ENV.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = ENV.PORT;
  server.listen(port, () => {
    console.log(`\u2705 Server running on http://localhost:${port}/`);
    startCronScheduler();
  });
  const shutdown = async (signal) => {
    console.log(`
[shutdown] ${signal} received, closing server...`);
    server.close(async () => {
      await closeDb();
      console.log("[shutdown] Done.");
      process.exit(0);
    });
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
function unsubscribeHtml(state) {
  const teal = "#0d9488";
  if (state === "invalid") {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>Invalid or expired unsubscribe link.</h2><p>Manage notification preferences from your <a href="/dashboard" style="color:${teal}">dashboard</a>.</p></body></html>`;
  }
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Unsubscribed \u2014 Qliniqit</title></head><body style="font-family:-apple-system,sans-serif;text-align:center;padding:80px 20px;background:#f8fafc"><div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:48px 40px;box-shadow:0 2px 12px rgba(0,0,0,0.08)"><h1 style="color:${teal};font-size:28px;margin:0 0 16px">You've been unsubscribed</h1><p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">You will no longer receive appointment reminder emails from Qliniqit.</p><a href="/" style="display:inline-block;background:${teal};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:15px;font-weight:600">Back to Qliniqit</a></div></body></html>`;
}
startServer().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
