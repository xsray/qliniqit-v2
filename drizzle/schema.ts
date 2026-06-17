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
  serial,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum("role", ["user", "provider", "admin"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const verificationStatusEnum = pgEnum("verification_status", ["pending", "verified", "rejected"]);
export const appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "completed", "cancelled", "no_show"]);
export const appointmentTypeEnum = pgEnum("appointment_type", ["in_clinic", "teleconsultation"]);
export const paymentStatusEnum = pgEnum("payment_status", ["unpaid", "pending", "paid", "refunded"]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "booking_confirmed", "booking_reminder", "booking_cancelled",
  "review_request", "message_received", "system_announcement",
  "provider_update", "subscription_update", "new_booking",
  "package_expiry", "package_renewal_reminder", "refill_request",
  "refill_response", "monthly_earnings_summary",
]);
export const channelEnum = pgEnum("channel", ["in_app", "email", "sms", "push", "whatsapp"]);
export const deliveryStatusEnum = pgEnum("delivery_status", ["pending", "sent", "delivered", "failed"]);
export const providerTypeEnum = pgEnum("provider_type", [
  "doctor", "clinic", "hospital", "pharmacy", "drug_store",
  "medical_supplier", "lab", "physiotherapy_center", "nutrition_center",
  "dental_clinic", "optical_center", "home_care", "ambulance",
  "medical_device", "insurance", "travel_organizer", "other",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "past_due", "cancelled", "trialing"]);
export const billingPeriodEnum = pgEnum("billing_period", ["monthly", "annual"]);
export const consentTypeEnum = pgEnum("consent_type", [
  "data_processing", "marketing", "telemedicine", "data_sharing_third_party",
  "analytics", "push_notifications", "sms_notifications", "whatsapp_notifications",
  "health_records_access", "ai_processing",
]);
export const legalBasisEnum = pgEnum("legal_basis", [
  "consent", "contract", "legal_obligation", "vital_interests", "public_task", "legitimate_interests",
]);
export const consentStatusEnum = pgEnum("consent_status", ["granted", "withdrawn", "pending"]);
export const dealStatusEnum = pgEnum("deal_status", ["draft", "active", "paused", "expired", "sold_out"]);
export const dealCategoryEnum = pgEnum("deal_category", [
  "consultation", "lab_test", "imaging", "dental", "physiotherapy",
  "wellness", "cosmetic", "pharmacy", "vaccination", "checkup", "other",
]);
export const trustTierEnum = pgEnum("trust_tier", ["standard", "verified", "elite"]);
export const loyaltyTierEnum = pgEnum("loyalty_tier", ["bronze", "silver", "gold", "platinum"]);
export const moderationStatusEnum = pgEnum("moderation_status", ["pending", "approved", "flagged", "removed"]);
export const recordingStatusEnum = pgEnum("recording_status", ["none", "processing", "ready", "failed", "expired"]);
export const frequencyEnum = pgEnum("frequency", ["once_daily", "twice_daily", "three_times_daily", "four_times_daily", "weekly", "as_needed"]);
export const complianceFrameworkEnum = pgEnum("compliance_framework", ["gdpr", "uk_gdpr", "pdpl_jordan", "hipaa", "generic"]);
export const paymentGatewayEnum = pgEnum("payment_gateway", ["stripe", "stripe_plus_hyperpay"]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
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
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Market Configs ───────────────────────────────────────────────────────────

export const marketConfigs = pgTable("market_configs", {
  id: serial("id").primaryKey(),
  countryCode: varchar("country_code", { length: 2 }).notNull().unique(),
  countryNameEn: varchar("country_name_en", { length: 100 }).notNull(),
  countryNameLocal: varchar("country_name_local", { length: 100 }),
  defaultLocale: varchar("default_locale", { length: 10 }).default("en"),
  currencyCode: varchar("currency_code", { length: 3 }).default("USD"),
  currencySymbol: varchar("currency_symbol", { length: 5 }).default("$"),
  timezone: varchar("timezone", { length: 64 }).default("UTC"),
  complianceFramework: complianceFrameworkEnum("compliance_framework").default("gdpr"),
  notificationChannels: jsonb("notification_channels").$type<string[]>(),
  paymentGateway: paymentGatewayEnum("payment_gateway").default("stripe"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MarketConfig = typeof marketConfigs.$inferSelect;

// ─── Specialties ──────────────────────────────────────────────────────────────

export const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  nameAr: varchar("name_ar", { length: 100 }),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  iconUrl: text("icon_url"),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
});

export type Specialty = typeof specialties.$inferSelect;

// ─── Provider Profiles ────────────────────────────────────────────────────────

export const providerProfiles = pgTable("provider_profiles", {
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
  education: jsonb("education").$type<Array<{ degree: string; institution: string; year: number; country: string }>>(),
  experienceYears: integer("experience_years").default(0),
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }),
  currencyCode: varchar("currency_code", { length: 3 }).default("USD"),
  languages: jsonb("languages").$type<string[]>(),
  acceptedInsurance: jsonb("accepted_insurance").$type<string[]>(),
  officeAddress: text("office_address"),
  city: varchar("city", { length: 100 }),
  countryCode: varchar("country_code", { length: 2 }),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  workingHours: jsonb("working_hours").$type<Array<{ dayOfWeek: number; startTime: string; endTime: string; isClosed: boolean }>>(),
  ratingAvg: decimal("rating_avg", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  providerType: providerTypeEnum("provider_type").default("doctor"),
  isFeatured: boolean("is_featured").default(false),
  slug: varchar("slug", { length: 200 }).unique(),
  galleryUrls: jsonb("gallery_urls").$type<string[]>(),
  offersVideo: boolean("offers_video").default(false).notNull(),
  enableRecording: boolean("enable_recording").default(true).notNull(),
  cancellationWindowHours: integer("cancellation_window_hours").default(24).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  completenessEmailSent: boolean("completeness_email_sent").default(false).notNull(),
  onboardingCompletedSteps: jsonb("onboarding_completed_steps").$type<string[]>(),
  avgResponseHours: decimal("avg_response_hours", { precision: 6, scale: 2 }),
  monthlyEarningsGoal: decimal("monthly_earnings_goal", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_provider_country").on(t.countryCode),
  index("idx_provider_specialty").on(t.specialtyId),
]);

export type ProviderProfile = typeof providerProfiles.$inferSelect;

// ─── Provider Verifications ───────────────────────────────────────────────────

export const providerVerifications = pgTable("provider_verifications", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  documentType: varchar("document_type", { length: 32 }).notNull(),
  fileUrl: text("file_url").notNull(),
  status: varchar("status", { length: 16 }).default("pending"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Availability Slots ───────────────────────────────────────────────────────

export const availabilitySlots = pgTable("availability_slots", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_slot_provider").on(t.providerId)]);

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointments = pgTable("appointments", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_appt_patient").on(t.patientId),
  index("idx_appt_provider").on(t.providerId),
  index("idx_appt_status").on(t.status),
  index("idx_appt_slot_start").on(t.slotStart),
]);

export type Appointment = typeof appointments.$inferSelect;

// ─── Reschedule Requests ──────────────────────────────────────────────────────

export const rescheduleRequests = pgTable("reschedule_requests", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull(),
  requestedBy: integer("requested_by").notNull(),
  newDate: varchar("new_date", { length: 10 }).notNull(),
  newTime: varchar("new_time", { length: 8 }).notNull(),
  reason: text("reason"),
  status: varchar("status", { length: 16 }).default("pending"),
  respondedAt: timestamp("responded_at"),
  declineReason: text("decline_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_reschedule_appt").on(t.appointmentId),
  index("idx_reschedule_patient").on(t.requestedBy),
]);

export type RescheduleRequest = typeof rescheduleRequests.$inferSelect;

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull().unique(),
  patientId: integer("patient_id").notNull(),
  providerId: integer("provider_id").notNull(),
  rating: smallint("rating").notNull(),
  comment: text("comment"),
  aspects: jsonb("aspects").$type<{ waitTime?: number; communication?: number; facility?: number }>(),
  providerResponse: text("provider_response"),
  providerResponseAt: timestamp("provider_response_at"),
  isVisible: boolean("is_visible").default(true),
  moderationStatus: moderationStatusEnum("moderation_status").default("pending"),
  moderationNote: text("moderation_note"),
  moderatedAt: timestamp("moderated_at"),
  moderatedBy: integer("moderated_by"),
  aiModerationScore: integer("ai_moderation_score"),
  isVerifiedAppointment: boolean("is_verified_appointment").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_review_provider").on(t.providerId)]);

export type Review = typeof reviews.$inferSelect;

// ─── Provider Reels ───────────────────────────────────────────────────────────

export const providerReels = pgTable("provider_reels", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_reel_provider").on(t.providerId)]);

export type ProviderReel = typeof providerReels.$inferSelect;

// ─── Reel Likes ───────────────────────────────────────────────────────────────

export const reelLikes = pgTable("reel_likes", {
  id: serial("id").primaryKey(),
  reelId: integer("reel_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("idx_reel_like_unique").on(t.reelId, t.userId)]);

// ─── Reel Comments ────────────────────────────────────────────────────────────

export const reelComments = pgTable("reel_comments", {
  id: serial("id").primaryKey(),
  reelId: integer("reel_id").notNull(),
  userId: integer("user_id").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_reel_comment").on(t.reelId)]);

export type ReelComment = typeof reelComments.$inferSelect;

// ─── Family Members ───────────────────────────────────────────────────────────

export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  primaryUserId: integer("primary_user_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  relationship: varchar("relationship", { length: 16 }).notNull(),
  dateOfBirth: varchar("date_of_birth", { length: 10 }),
  gender: genderEnum("gender"),
  medicalNotes: text("medical_notes"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_family_primary").on(t.primaryUserId)]);

export type FamilyMember = typeof familyMembers.$inferSelect;

// ─── Health Records ───────────────────────────────────────────────────────────

export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  familyMemberId: integer("family_member_id"),
  recordType: varchar("record_type", { length: 32 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  fileUrls: jsonb("file_urls").$type<string[]>(),
  fileKeys: jsonb("file_keys").$type<string[]>(),
  providerId: integer("provider_id"),
  recordDate: varchar("record_date", { length: 10 }),
  isSharedWithProvider: boolean("is_shared_with_provider").default(false),
  sharedWithProviders: jsonb("shared_with_providers").$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_record_user").on(t.userId)]);

export type HealthRecord = typeof healthRecords.$inferSelect;

// ─── Health Scores ────────────────────────────────────────────────────────────

export const healthScores = pgTable("health_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  score: smallint("score").default(0),
  breakdown: jsonb("breakdown").$type<{
    profileCompleteness: number;
    appointmentRegularity: number;
    reviewParticipation: number;
    healthRecordUpdates: number;
    familyProfiles: number;
  }>(),
  streakDays: integer("streak_days").default(0),
  level: loyaltyTierEnum("level").default("bronze"),
  answersJson: jsonb("answers_json"),
  calculatedAt: timestamp("calculated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type HealthScore = typeof healthScores.$inferSelect;

// ─── Subscription Plans ───────────────────────────────────────────────────────

export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 32 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  priceMonthly: jsonb("price_monthly").$type<{ usd: number; jod: number; eur: number; gbp: number }>(),
  priceAnnual: jsonb("price_annual").$type<{ usd: number; jod: number; eur: number; gbp: number }>(),
  features: jsonb("features").$type<string[]>(),
  limits: jsonb("limits").$type<{ maxBookingsPerMonth: number; maxReelsPerMonth: number; maxTeamMembers: number }>(),
  stripePriceIdMonthly: varchar("stripe_price_id_monthly", { length: 100 }),
  stripePriceIdAnnual: varchar("stripe_price_id_annual", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Provider Subscriptions ───────────────────────────────────────────────────

export const providerSubscriptions = pgTable("provider_subscriptions", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body"),
  data: jsonb("data"),
  channel: channelEnum("channel").default("in_app"),
  deliveryStatus: deliveryStatusEnum("delivery_status").default("pending"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_notif_user").on(t.userId)]);

// ─── Notification Preferences ─────────────────────────────────────────────────

export const notificationPreferences = pgTable("notification_preferences", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("idx_notif_pref_unique").on(t.userId, t.channel, t.category)]);

// ─── Teleconsultations ────────────────────────────────────────────────────────

export const teleconsultations = pgTable("teleconsultations", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── AI Interactions ──────────────────────────────────────────────────────────

export const aiInteractions = pgTable("ai_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  interactionType: varchar("interaction_type", { length: 32 }).notNull(),
  inputText: text("input_text").notNull(),
  responseText: text("response_text"),
  recommendedSpecialties: jsonb("recommended_specialties").$type<string[]>(),
  recommendedProviders: jsonb("recommended_providers").$type<number[]>(),
  tokensUsed: integer("tokens_used"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_ai_user").on(t.userId)]);

// ─── Conversations ────────────────────────────────────────────────────────────

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  providerId: integer("provider_id").notNull(),
  lastMessageAt: timestamp("last_message_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("idx_conv_unique").on(t.patientId, t.providerId)]);

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  senderId: integer("sender_id").notNull(),
  contentType: varchar("content_type", { length: 8 }).default("text"),
  content: text("content"),
  fileUrl: text("file_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_msg_conv").on(t.conversationId)]);

// ─── Saved Providers ──────────────────────────────────────────────────────────

export const savedProviders = pgTable("saved_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  providerId: integer("provider_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("idx_saved_unique").on(t.userId, t.providerId)]);

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: varchar("action", { length: 64 }).notNull(),
  resourceType: varchar("resource_type", { length: 64 }),
  resourceId: varchar("resource_id", { length: 64 }),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"),
  countryCode: varchar("country_code", { length: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_audit_user").on(t.userId), index("idx_audit_created").on(t.createdAt)]);

// ─── Consent Records ──────────────────────────────────────────────────────────

export const consentRecords = pgTable("consent_records", {
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
  withdrawnAt: timestamp("withdrawn_at"),
}, (t) => [
  index("idx_consent_user").on(t.userId),
  index("idx_consent_type").on(t.consentType, t.status),
]);

export type ConsentRecord = typeof consentRecords.$inferSelect;

// ─── Cron Logs ────────────────────────────────────────────────────────────────

export const cronLogs = pgTable("cron_logs", {
  id: serial("id").primaryKey(),
  jobName: varchar("job_name", { length: 100 }).notNull(),
  ranAt: timestamp("ran_at").defaultNow().notNull(),
  status: varchar("status", { length: 16 }).notNull(),
  durationMs: integer("duration_ms"),
  result: jsonb("result").$type<Record<string, unknown>>(),
  errorMessage: text("error_message"),
}, (t) => [
  index("idx_cron_logs_job").on(t.jobName),
  index("idx_cron_logs_ran").on(t.ranAt),
]);

// ─── Recording Consent Log ────────────────────────────────────────────────────

export const recordingConsentLog = pgTable("recording_consent_log", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull(),
  userId: integer("user_id").notNull(),
  action: varchar("action", { length: 8 }).notNull(),
  consentedBy: varchar("consented_by", { length: 20 }).default("patient").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: varchar("user_agent", { length: 512 }),
  expiresAt: timestamp("expires_at"),
  autoRevoked: boolean("auto_revoked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_rcl_appointment").on(t.appointmentId),
  index("idx_rcl_user").on(t.userId),
]);

// ─── Recording Access Log ─────────────────────────────────────────────────────

export const recordingAccessLog = pgTable("recording_access_log", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull(),
  teleconsultationId: integer("teleconsultation_id"),
  accessedByUserId: integer("accessed_by_user_id").notNull(),
  accessedByRole: roleEnum("accessed_by_role").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  accessedAt: timestamp("accessed_at").defaultNow().notNull(),
}, (t) => [
  index("idx_ral_appointment").on(t.appointmentId),
  index("idx_ral_user").on(t.accessedByUserId),
]);

export type RecordingAccessLog = typeof recordingAccessLog.$inferSelect;

// ─── Deletion Requests ────────────────────────────────────────────────────────

export const deletionRequests = pgTable("deletion_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reason: text("reason"),
  status: varchar("status", { length: 16 }).notNull().default("pending"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  processedBy: integer("processed_by"),
  adminNotes: text("admin_notes"),
}, (t) => [
  index("idx_dr_user").on(t.userId),
  index("idx_dr_status").on(t.status),
]);

export type DeletionRequest = typeof deletionRequests.$inferSelect;

// ─── Platform Settings ────────────────────────────────────────────────────────

export const platformSettings = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: integer("updated_by"),
});

export type PlatformSetting = typeof platformSettings.$inferSelect;

// ─── Slot Holds ───────────────────────────────────────────────────────────────

export const slotHolds = pgTable("slot_holds", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  providerId: integer("provider_id").notNull(),
  slotStart: timestamp("slot_start").notNull(),
  slotEnd: timestamp("slot_end").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  status: varchar("status", { length: 16 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_sh_provider_slot").on(t.providerId, t.slotStart),
  index("idx_sh_expires").on(t.expiresAt),
]);

export type SlotHold = typeof slotHolds.$inferSelect;

// ─── No-Show Disputes ─────────────────────────────────────────────────────────

export const noShowDisputes = pgTable("no_show_disputes", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull(),
  patientId: integer("patient_id").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 16 }).default("pending").notNull(),
  adminNote: text("admin_note"),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: integer("resolved_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_nsd_patient").on(t.patientId),
  index("idx_nsd_status").on(t.status),
]);

export type NoShowDispute = typeof noShowDisputes.$inferSelect;

// ─── Appointment Summaries ────────────────────────────────────────────────────

export const appointmentSummaries = pgTable("appointment_summaries", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AppointmentSummary = typeof appointmentSummaries.$inferSelect;

// ─── Prescriptions ────────────────────────────────────────────────────────────

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull(),
  patientId: integer("patient_id").notNull(),
  providerId: integer("provider_id").notNull(),
  type: varchar("type", { length: 16 }).notNull().default("prescription"),
  diagnosis: text("diagnosis").notNull(),
  medications: jsonb("medications").notNull().$type<Array<{ name: string; dose: string; frequency: string; duration: string; instructions?: string }>>(),
  referralSpecialty: varchar("referral_specialty", { length: 120 }),
  referralReason: text("referral_reason"),
  notes: text("notes"),
  pdfUrl: varchar("pdf_url", { length: 500 }),
  pdfKey: varchar("pdf_key", { length: 300 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_rx_patient").on(t.patientId),
  index("idx_rx_provider").on(t.providerId),
]);

export type Prescription = typeof prescriptions.$inferSelect;

// ─── Visit Notes ──────────────────────────────────────────────────────────────

export const visitNotes = pgTable("visit_notes", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_vn_appointment").on(t.appointmentId),
  index("idx_vn_provider").on(t.providerId),
  index("idx_vn_patient").on(t.patientId),
]);

export type VisitNote = typeof visitNotes.$inferSelect;

// ─── Insurance Providers ──────────────────────────────────────────────────────

export const insuranceProviders = pgTable("insurance_providers", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  nameLocal: varchar("name_local", { length: 100 }),
  logoUrl: text("logo_url"),
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
});

// ─── Patient Insurance ────────────────────────────────────────────────────────

export const patientInsurance = pgTable("patient_insurance", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_pi_user").on(t.userId)]);

// ─── Provider Clinics ─────────────────────────────────────────────────────────

export const providerClinics = pgTable("provider_clinics", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_clinic_provider").on(t.providerId)]);

export type ProviderClinic = typeof providerClinics.$inferSelect;

// ─── Clinic Group Members ─────────────────────────────────────────────────────

export const clinicGroupMembers = pgTable("clinic_group_members", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").notNull(),
  providerId: integer("provider_id").notNull(),
  role: varchar("role", { length: 16 }).default("member").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_cgm_clinic").on(t.clinicId),
  index("idx_cgm_provider").on(t.providerId),
]);

// ─── Satisfaction Surveys ─────────────────────────────────────────────────────

export const satisfactionSurveys = pgTable("satisfaction_surveys", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_survey_patient").on(t.patientId),
  index("idx_survey_provider").on(t.providerId),
]);

export type SatisfactionSurvey = typeof satisfactionSurveys.$inferSelect;

// ─── Provider Badges ──────────────────────────────────────────────────────────

export const providerBadges = pgTable("provider_badges", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  badgeType: varchar("badge_type", { length: 32 }).notNull(),
  awardedAt: timestamp("awarded_at").defaultNow().notNull(),
  metadata: jsonb("metadata"),
}, (t) => [
  index("idx_badge_provider").on(t.providerId),
  uniqueIndex("idx_badge_provider_type").on(t.providerId, t.badgeType),
]);

// ─── Provider Trust Scores ────────────────────────────────────────────────────

export const providerTrustScores = pgTable("provider_trust_scores", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_trust_score").on(t.score)]);

export type ProviderTrustScore = typeof providerTrustScores.$inferSelect;

// ─── Prescription Refills ─────────────────────────────────────────────────────

export const prescriptionRefills = pgTable("prescription_refills", {
  id: serial("id").primaryKey(),
  prescriptionId: integer("prescription_id").notNull(),
  patientId: integer("patient_id").notNull(),
  providerId: integer("provider_id").notNull(),
  status: varchar("status", { length: 16 }).default("pending").notNull(),
  patientNote: text("patient_note"),
  providerNote: text("provider_note"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
}, (t) => [
  index("idx_refill_prescription").on(t.prescriptionId),
  index("idx_refill_patient").on(t.patientId),
]);

export type PrescriptionRefill = typeof prescriptionRefills.$inferSelect;

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  patientId: integer("patient_id").notNull(),
  slotDate: varchar("slot_date", { length: 10 }).notNull(),
  slotTime: varchar("slot_time", { length: 5 }).notNull(),
  consultationType: varchar("consultation_type", { length: 16 }).default("in_clinic"),
  status: varchar("status", { length: 16 }).default("waiting").notNull(),
  notifiedAt: timestamp("notified_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_waitlist_provider").on(t.providerId),
  index("idx_waitlist_patient").on(t.patientId),
]);

export type Waitlist = typeof waitlist.$inferSelect;

// ─── Waiting Room Status ──────────────────────────────────────────────────────

export const waitingRoomStatus = pgTable("waiting_room_status", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull().unique(),
  patientReady: boolean("patient_ready").default(false).notNull(),
  providerReady: boolean("provider_ready").default(false).notNull(),
  patientReadyAt: timestamp("patient_ready_at"),
  providerReadyAt: timestamp("provider_ready_at"),
  callStartedAt: timestamp("call_started_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type WaitingRoomStatus = typeof waitingRoomStatus.$inferSelect;

// ─── Appointment Packages ─────────────────────────────────────────────────────

export const appointmentPackages = pgTable("appointment_packages", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  sessionCount: integer("session_count").notNull().default(5),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  validityDays: integer("validity_days").notNull().default(180),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_pkg_provider").on(t.providerId)]);

export type AppointmentPackage = typeof appointmentPackages.$inferSelect;

export const patientPackages = pgTable("patient_packages", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").notNull(),
  patientId: integer("patient_id").notNull(),
  sessionsRemaining: integer("sessions_remaining").notNull(),
  sessionsTotal: integer("sessions_total").notNull().default(0),
  purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  renewalReminderOptOut: boolean("renewal_reminder_opt_out").default(false).notNull(),
}, (t) => [
  index("idx_patient_pkg_patient").on(t.patientId),
  index("idx_patient_pkg_package").on(t.packageId),
]);

export type PatientPackage = typeof patientPackages.$inferSelect;

// ─── Appointment Documents ────────────────────────────────────────────────────

export const appointmentDocuments = pgTable("appointment_documents", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull(),
  patientId: integer("patient_id").notNull(),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  fileKey: varchar("file_key", { length: 500 }).notNull(),
  fileName: varchar("file_name", { length: 300 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull().default("application/octet-stream"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  flagged: boolean("flagged").default(false).notNull(),
  flaggedAt: timestamp("flagged_at"),
  flaggedBy: integer("flagged_by"),
}, (t) => [
  index("idx_appt_doc_appointment").on(t.appointmentId),
  index("idx_appt_doc_patient").on(t.patientId),
]);

export type AppointmentDocument = typeof appointmentDocuments.$inferSelect;

// ─── Provider Blackout Dates ──────────────────────────────────────────────────

export const providerBlackoutDates = pgTable("provider_blackout_dates", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  reason: varchar("reason", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_blackout_provider").on(t.providerId),
  index("idx_blackout_date").on(t.date),
]);

export type ProviderBlackoutDate = typeof providerBlackoutDates.$inferSelect;

// ─── Referrals ────────────────────────────────────────────────────────────────

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull(),
  refereeId: integer("referee_id"),
  code: varchar("code", { length: 20 }).notNull().unique(),
  status: varchar("status", { length: 16 }).default("pending").notNull(),
  rewardGranted: boolean("reward_granted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (t) => [
  index("idx_referral_referrer").on(t.referrerId),
  index("idx_referral_code").on(t.code),
]);

export type Referral = typeof referrals.$inferSelect;

// ─── Provider Schedule Templates ──────────────────────────────────────────────

export const providerScheduleTemplates = pgTable("provider_schedule_templates", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 300 }),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_sched_tmpl_provider").on(t.providerId)]);

export type ProviderScheduleTemplate = typeof providerScheduleTemplates.$inferSelect;

export const providerScheduleTemplateSlots = pgTable("provider_schedule_template_slots", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: varchar("start_time", { length: 5 }).notNull(),
  endTime: varchar("end_time", { length: 5 }).notNull(),
}, (t) => [index("idx_sched_tmpl_slot_template").on(t.templateId)]);

// ─── Medications ──────────────────────────────────────────────────────────────

export const medications = pgTable("medications", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_med_user").on(t.userId)]);

export type Medication = typeof medications.$inferSelect;

export const medicationLogs = pgTable("medication_logs", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_medlog_patient").on(t.patientId),
  index("idx_medlog_date").on(t.scheduledDate),
]);

export type MedicationLog = typeof medicationLogs.$inferSelect;

// ─── Provider Peer Referrals ──────────────────────────────────────────────────

export const providerPatientReferrals = pgTable("provider_patient_referrals", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_ppr_from").on(t.fromProviderId),
  index("idx_ppr_to").on(t.toProviderId),
  index("idx_ppr_patient").on(t.patientId),
]);

export type ProviderPatientReferral = typeof providerPatientReferrals.$inferSelect;

// ─── Health Goals ─────────────────────────────────────────────────────────────

export const healthGoals = pgTable("health_goals", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_hg_user").on(t.userId)]);

export type HealthGoal = typeof healthGoals.$inferSelect;

// ─── Deals & Offers ───────────────────────────────────────────────────────────

export const deals = pgTable("deals", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_deal_provider").on(t.providerId),
  index("idx_deal_status").on(t.status),
  index("idx_deal_country").on(t.countryCode),
  index("idx_deal_valid").on(t.validFrom, t.validUntil),
]);

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;

// ─── Deal Claims ──────────────────────────────────────────────────────────────

export const dealClaims = pgTable("deal_claims", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").notNull(),
  patientId: integer("patient_id").notNull(),
  claimCode: varchar("claim_code", { length: 20 }).notNull().unique(),
  status: varchar("status", { length: 16 }).default("claimed").notNull(),
  redeemedAt: timestamp("redeemed_at"),
  appointmentId: integer("appointment_id"),
  platformCommissionAmount: decimal("platform_commission_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_claim_deal").on(t.dealId),
  index("idx_claim_patient").on(t.patientId),
  uniqueIndex("idx_claim_unique").on(t.dealId, t.patientId),
]);

export type DealClaim = typeof dealClaims.$inferSelect;

// ─── Loyalty Points ───────────────────────────────────────────────────────────

export const loyaltyPoints = pgTable("loyalty_points", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  balance: integer("balance").default(0).notNull(),
  lifetimeEarned: integer("lifetime_earned").default(0).notNull(),
  lifetimeRedeemed: integer("lifetime_redeemed").default(0).notNull(),
  tier: loyaltyTierEnum("tier").default("bronze").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("idx_loyalty_user").on(t.userId)]);

export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;

export const loyaltyTransactions = pgTable("loyalty_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  points: integer("points").notNull(),
  action: varchar("action", { length: 32 }).notNull(),
  referenceId: integer("reference_id"),
  description: varchar("description", { length: 300 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_loyalty_tx_user").on(t.userId)]);

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;

// ─── Sponsored Listings ───────────────────────────────────────────────────────

export const sponsoredListings = pgTable("sponsored_listings", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_sponsored_provider").on(t.providerId),
  index("idx_sponsored_status").on(t.status),
]);

export type SponsoredListing = typeof sponsoredListings.$inferSelect;

// ─── Provider Credits ─────────────────────────────────────────────────────────

export const providerCredits = pgTable("provider_credits", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  balance: integer("balance").default(0).notNull(),
  lifetimeEarned: integer("lifetime_earned").default(0).notNull(),
  lifetimeSpent: integer("lifetime_spent").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_prov_credits_provider").on(t.providerId)]);

export type ProviderCredits = typeof providerCredits.$inferSelect;

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  type: varchar("type", { length: 16 }).notNull(),
  amount: integer("amount").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  description: varchar("description", { length: 255 }),
  referenceId: varchar("reference_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_credit_tx_provider").on(t.providerId)]);

export type CreditTransaction = typeof creditTransactions.$inferSelect;

// ─── User Credits ─────────────────────────────────────────────────────────────

export const userCredits = pgTable("user_credits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  balance: integer("balance").default(0).notNull(),
  lifetimeEarned: integer("lifetime_earned").default(0).notNull(),
  lifetimeSpent: integer("lifetime_spent").default(0).notNull(),
  lastLoginStreakAt: timestamp("last_login_streak_at"),
  streakDays: integer("streak_days").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_user_credits_user").on(t.userId)]);

export type UserCredits = typeof userCredits.$inferSelect;

export const userCreditTransactions = pgTable("user_credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  type: varchar("type", { length: 32 }).notNull(),
  description: varchar("description", { length: 255 }),
  referenceId: varchar("reference_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_uct_user").on(t.userId)]);

export type UserCreditTransaction = typeof userCreditTransactions.$inferSelect;

// ─── Credit Packs ─────────────────────────────────────────────────────────────

export const creditPacks = pgTable("credit_packs", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CreditPack = typeof creditPacks.$inferSelect;

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const coupons = pgTable("coupons", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_coupon_code").on(t.code),
  index("idx_coupon_provider").on(t.providerId),
]);

export type Coupon = typeof coupons.$inferSelect;

export const userCoupons = pgTable("user_coupons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  couponId: integer("coupon_id").notNull(),
  status: varchar("status", { length: 16 }).default("claimed").notNull(),
  appointmentId: integer("appointment_id"),
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
  usedAt: timestamp("used_at"),
}, (t) => [
  index("idx_uc_user").on(t.userId),
  index("idx_uc_coupon").on(t.couponId),
]);

export type UserCoupon = typeof userCoupons.$inferSelect;

// ─── Events & Conferences ─────────────────────────────────────────────────────

export const events = pgTable("events", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_event_status").on(t.status),
  index("idx_event_type").on(t.type),
]);

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ─── Event Registrations ──────────────────────────────────────────────────────

export const eventRegistrations = pgTable("event_registrations", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_event_reg_event").on(t.eventId),
  index("idx_event_reg_user").on(t.userId),
  index("idx_event_reg_email").on(t.email),
]);

export type EventRegistration = typeof eventRegistrations.$inferSelect;

// ─── Sponsor Inquiries ────────────────────────────────────────────────────────

export const sponsorInquiries = pgTable("sponsor_inquiries", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id"),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  contactEmail: varchar("contact_email", { length: 320 }),
  tierInterest: varchar("tier_interest", { length: 16 }).default("bronze").notNull(),
  message: text("message"),
  status: varchar("status", { length: 16 }).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_sponsor_inq_event").on(t.eventId),
  index("idx_sponsor_inq_status").on(t.status),
]);

export type SponsorInquiry = typeof sponsorInquiries.$inferSelect;

// ─── Market Waitlist ──────────────────────────────────────────────────────────

export const marketWaitlist = pgTable("market_waitlist", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  countryName: varchar("country_name", { length: 100 }),
  role: varchar("role", { length: 16 }).default("member").notNull(),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_mwl_email").on(t.email),
  index("idx_mwl_country").on(t.countryCode),
]);

export type MarketWaitlist = typeof marketWaitlist.$inferSelect;

// ─── Provider Profile Views ───────────────────────────────────────────────────

export const providerProfileViews = pgTable("provider_profile_views", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  viewerUserId: integer("viewer_user_id"),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
}, (t) => [
  index("idx_ppv_provider").on(t.providerId),
  index("idx_ppv_viewed_at").on(t.viewedAt),
]);

// ─── Flagged Reviews ──────────────────────────────────────────────────────────

export const flaggedReviews = pgTable("flagged_reviews", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull(),
  flaggedBy: integer("flagged_by").notNull(),
  reason: varchar("reason", { length: 500 }).notNull(),
  status: varchar("status", { length: 16 }).default("pending").notNull(),
  adminNote: text("admin_note"),
  resolvedBy: integer("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_flag_review").on(t.reviewId),
  index("idx_flag_status").on(t.status),
]);

export type FlaggedReview = typeof flaggedReviews.$inferSelect;

// ─── Reel Reports ─────────────────────────────────────────────────────────────

export const reelReports = pgTable("reel_reports", {
  id: serial("id").primaryKey(),
  reelId: integer("reel_id").notNull(),
  reportedBy: integer("reported_by").notNull(),
  reason: varchar("reason", { length: 32 }).notNull(),
  details: text("details"),
  status: varchar("status", { length: 16 }).default("pending").notNull(),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_reel_report_reel").on(t.reelId),
  index("idx_reel_report_status").on(t.status),
]);

export type ReelReport = typeof reelReports.$inferSelect;

// ─── Payout Requests ──────────────────────────────────────────────────────────

export const payoutRequests = pgTable("payout_requests", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("JOD").notNull(),
  status: varchar("status", { length: 16 }).default("pending").notNull(),
  bankDetails: text("bank_details"),
  adminNotes: text("admin_notes"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
}, (t) => [
  index("idx_pr_provider").on(t.providerId),
  index("idx_pr_status").on(t.status),
]);

export type PayoutRequest = typeof payoutRequests.$inferSelect;

// ─── Push Tokens ──────────────────────────────────────────────────────────────

export const pushTokens = pgTable("push_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token").notNull(),
  platform: varchar("platform", { length: 20 }).default("web").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_push_token_user").on(t.userId)]);

export type PushToken = typeof pushTokens.$inferSelect;

// ─── Provider Insurances ──────────────────────────────────────────────────────

export const providerInsurances = pgTable("provider_insurances", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  insuranceProviderId: integer("insurance_provider_id").notNull(),
  isActive: boolean("is_active").default(true),
  acceptedSince: timestamp("accepted_since").defaultNow(),
}, (t) => [index("idx_prov_ins_provider").on(t.providerId)]);

export type ProviderInsurance = typeof providerInsurances.$inferSelect;

// ─── Appointment Surveys ──────────────────────────────────────────────────────

export const appointmentSurveys = pgTable("appointment_surveys", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull(),
  patientId: integer("patient_id").notNull(),
  providerId: integer("provider_id").notNull(),
  rating: integer("rating").notNull(),
  feedback: text("feedback"),
  providerReply: text("provider_reply"),
  repliedAt: timestamp("replied_at"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
}, (t) => [
  index("idx_appt_survey_appointment").on(t.appointmentId),
  index("idx_appt_survey_patient").on(t.patientId),
]);

export type AppointmentSurvey = typeof appointmentSurveys.$inferSelect;

// ─── Epidemic Alerts Cache ────────────────────────────────────────────────────

export const epidemicAlertsCache = pgTable("epidemic_alerts_cache", {
  id: serial("id").primaryKey(),
  countryCode: varchar("country_code", { length: 10 }).notNull(),
  lang: varchar("lang", { length: 5 }).notNull().default("en"),
  payload: text("payload").notNull(),
  cachedAt: timestamp("cached_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
}, (t) => [index("idx_epidemic_cache_country_lang").on(t.countryCode, t.lang)]);

// ─── Stock Watchlist ──────────────────────────────────────────────────────────

export const stockWatchlist = pgTable("stock_watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (t) => [index("idx_stock_user").on(t.userId)]);

// ─── Search Logs ──────────────────────────────────────────────────────────────

export const searchLogs = pgTable("search_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  queryText: text("query_text"),
  filters: jsonb("filters"),
  resultsCount: integer("results_count"),
  countryCode: varchar("country_code", { length: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Provider Calendar Tokens ─────────────────────────────────────────────────

export const providerCalendarTokens = pgTable("provider_calendar_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  calendarId: varchar("calendar_id", { length: 200 }).default("primary"),
  syncEnabled: boolean("sync_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ProviderCalendarToken = typeof providerCalendarTokens.$inferSelect;

// ─── Availability Templates ───────────────────────────────────────────────────

export const availabilityTemplates = pgTable("availability_templates", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  slots: jsonb("slots").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_at_provider").on(t.providerId)]);

export type AvailabilityTemplate = typeof availabilityTemplates.$inferSelect;
