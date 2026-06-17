CREATE TYPE "public"."appointment_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."appointment_type" AS ENUM('in_clinic', 'teleconsultation');--> statement-breakpoint
CREATE TYPE "public"."billing_period" AS ENUM('monthly', 'annual');--> statement-breakpoint
CREATE TYPE "public"."channel" AS ENUM('in_app', 'email', 'sms', 'push', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."compliance_framework" AS ENUM('gdpr', 'uk_gdpr', 'pdpl_jordan', 'hipaa', 'generic');--> statement-breakpoint
CREATE TYPE "public"."consent_status" AS ENUM('granted', 'withdrawn', 'pending');--> statement-breakpoint
CREATE TYPE "public"."consent_type" AS ENUM('data_processing', 'marketing', 'telemedicine', 'data_sharing_third_party', 'analytics', 'push_notifications', 'sms_notifications', 'whatsapp_notifications', 'health_records_access', 'ai_processing');--> statement-breakpoint
CREATE TYPE "public"."deal_category" AS ENUM('consultation', 'lab_test', 'imaging', 'dental', 'physiotherapy', 'wellness', 'cosmetic', 'pharmacy', 'vaccination', 'checkup', 'other');--> statement-breakpoint
CREATE TYPE "public"."deal_status" AS ENUM('draft', 'active', 'paused', 'expired', 'sold_out');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('pending', 'sent', 'delivered', 'failed');--> statement-breakpoint
CREATE TYPE "public"."frequency" AS ENUM('once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'weekly', 'as_needed');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."legal_basis" AS ENUM('consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests');--> statement-breakpoint
CREATE TYPE "public"."loyalty_tier" AS ENUM('bronze', 'silver', 'gold', 'platinum');--> statement-breakpoint
CREATE TYPE "public"."moderation_status" AS ENUM('pending', 'approved', 'flagged', 'removed');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('booking_confirmed', 'booking_reminder', 'booking_cancelled', 'review_request', 'message_received', 'system_announcement', 'provider_update', 'subscription_update', 'new_booking', 'package_expiry', 'package_renewal_reminder', 'refill_request', 'refill_response', 'monthly_earnings_summary');--> statement-breakpoint
CREATE TYPE "public"."payment_gateway" AS ENUM('stripe', 'stripe_plus_hyperpay');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('unpaid', 'pending', 'paid', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."provider_type" AS ENUM('doctor', 'clinic', 'hospital', 'pharmacy', 'drug_store', 'medical_supplier', 'lab', 'physiotherapy_center', 'nutrition_center', 'dental_clinic', 'optical_center', 'home_care', 'ambulance', 'medical_device', 'insurance', 'other');--> statement-breakpoint
CREATE TYPE "public"."recording_status" AS ENUM('none', 'processing', 'ready', 'failed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'provider', 'admin');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'past_due', 'cancelled', 'trialing');--> statement-breakpoint
CREATE TYPE "public"."trust_tier" AS ENUM('standard', 'verified', 'elite');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TABLE "ai_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"interaction_type" varchar(32) NOT NULL,
	"input_text" text NOT NULL,
	"response_text" text,
	"recommended_specialties" jsonb,
	"recommended_providers" jsonb,
	"tokens_used" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"file_url" varchar(1000) NOT NULL,
	"file_key" varchar(500) NOT NULL,
	"file_name" varchar(300) NOT NULL,
	"mime_type" varchar(100) DEFAULT 'application/octet-stream' NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"flagged" boolean DEFAULT false NOT NULL,
	"flagged_at" timestamp,
	"flagged_by" integer
);
--> statement-breakpoint
CREATE TABLE "appointment_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"session_count" integer DEFAULT 5 NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"validity_days" integer DEFAULT 180 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"subjective" text NOT NULL,
	"objective" text NOT NULL,
	"assessment" text NOT NULL,
	"plan" text NOT NULL,
	"raw_summary" text,
	"email_sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "appointment_summaries_appointment_id_unique" UNIQUE("appointment_id")
);
--> statement-breakpoint
CREATE TABLE "appointment_surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"feedback" text,
	"provider_reply" text,
	"replied_at" timestamp,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"slot_start" timestamp NOT NULL,
	"slot_end" timestamp NOT NULL,
	"status" "appointment_status" DEFAULT 'pending',
	"type" "appointment_type" DEFAULT 'in_clinic',
	"booking_source" varchar(16) DEFAULT 'web',
	"patient_timezone" varchar(64),
	"provider_timezone" varchar(64),
	"cancellation_reason" text,
	"cancelled_by" varchar(16),
	"reschedule_reason" text,
	"rescheduled_from" integer,
	"reminder_24h_sent" boolean DEFAULT false,
	"reminder_24h_sent_at" timestamp,
	"reminder_1h_sent" boolean DEFAULT false,
	"reminder_1h_sent_at" timestamp,
	"video_call_url" varchar(512),
	"notes" text,
	"payment_status" "payment_status" DEFAULT 'unpaid',
	"stripe_payment_intent_id" varchar(255),
	"stripe_session_id" varchar(255),
	"stripe_receipt_url" varchar(1024),
	"family_member_id" integer,
	"patient_consented_to_recording" boolean DEFAULT false,
	"consented_at" timestamp,
	"reminder_lead_time" varchar(8) DEFAULT '24h',
	"smart_reminder_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" varchar(64) NOT NULL,
	"resource_type" varchar(64),
	"resource_id" varchar(64),
	"ip_address" varchar(64),
	"user_agent" text,
	"metadata" jsonb,
	"country_code" varchar(2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"clinic_id" integer,
	"day_of_week" smallint,
	"specific_date" varchar(10),
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL,
	"slot_duration_min" integer DEFAULT 30,
	"is_blocked" boolean DEFAULT false,
	"is_recurring" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"name" varchar(128) NOT NULL,
	"slots" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinic_group_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"clinic_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"role" varchar(16) DEFAULT 'member' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consent_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"supabase_uid" varchar(64),
	"consent_type" "consent_type" NOT NULL,
	"status" "consent_status" DEFAULT 'pending' NOT NULL,
	"legal_basis" "legal_basis" DEFAULT 'consent' NOT NULL,
	"policy_version" varchar(32) DEFAULT '1.0' NOT NULL,
	"description" text,
	"ip_address" varchar(64),
	"user_agent" text,
	"country_code" varchar(2),
	"market" varchar(10),
	"granted" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"withdrawn_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"last_message_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(32) NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text,
	"scope" varchar(16) DEFAULT 'provider' NOT NULL,
	"discount_type" varchar(16) DEFAULT 'percent' NOT NULL,
	"discount_value" integer DEFAULT 0 NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"provider_id" integer,
	"max_uses" integer DEFAULT 100 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"min_booking_fee" integer DEFAULT 0,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "credit_packs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"credits" integer NOT NULL,
	"price_usd" numeric(10, 2) NOT NULL,
	"stripe_price_id" varchar(100),
	"badge" varchar(50),
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"type" varchar(16) NOT NULL,
	"amount" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"description" varchar(255),
	"reference_id" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cron_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_name" varchar(100) NOT NULL,
	"ran_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(16) NOT NULL,
	"duration_ms" integer,
	"result" jsonb,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE "deal_claims" (
	"id" serial PRIMARY KEY NOT NULL,
	"deal_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"claim_code" varchar(20) NOT NULL,
	"status" varchar(16) DEFAULT 'claimed' NOT NULL,
	"redeemed_at" timestamp,
	"appointment_id" integer,
	"platform_commission_amount" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "deal_claims_claim_code_unique" UNIQUE("claim_code")
);
--> statement-breakpoint
CREATE TABLE "deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"title_ar" varchar(200),
	"description" text,
	"description_ar" text,
	"original_price" numeric(10, 2) NOT NULL,
	"discounted_price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"discount_pct" numeric(5, 2) NOT NULL,
	"commission_pct" numeric(5, 2) DEFAULT '10.00' NOT NULL,
	"category" "deal_category" DEFAULT 'consultation' NOT NULL,
	"image_url" text,
	"max_claims" integer,
	"claims_count" integer DEFAULT 0 NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"status" "deal_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"country_code" varchar(2),
	"specialty_id" integer,
	"terms_and_conditions" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deletion_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"reason" text,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"processed_by" integer,
	"admin_notes" text
);
--> statement-breakpoint
CREATE TABLE "epidemic_alerts_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_code" varchar(10) NOT NULL,
	"lang" varchar(5) DEFAULT 'en' NOT NULL,
	"payload" text NOT NULL,
	"cached_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer,
	"name" varchar(200) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(32),
	"organization" varchar(200),
	"role" varchar(100),
	"message" text,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"reminder_sent_at" timestamp,
	"check_in_token" varchar(64),
	"checked_in_at" timestamp,
	"checked_in_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_registrations_check_in_token_unique" UNIQUE("check_in_token")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(300) NOT NULL,
	"title_ar" varchar(300),
	"description" text,
	"description_ar" text,
	"type" varchar(32) DEFAULT 'conference' NOT NULL,
	"organizer" varchar(200) NOT NULL,
	"organizer_user_id" integer,
	"location" varchar(300),
	"country" varchar(100),
	"country_code" varchar(2),
	"start_date" varchar(20) NOT NULL,
	"end_date" varchar(20),
	"attendee_count" integer DEFAULT 0,
	"seeking_sponsors" boolean DEFAULT false NOT NULL,
	"sponsorship_details" text,
	"image_url" text,
	"website_url" varchar(500),
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"specialty_tags" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"primary_user_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"relationship" varchar(16) NOT NULL,
	"date_of_birth" varchar(10),
	"gender" "gender",
	"medical_notes" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flagged_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" integer NOT NULL,
	"flagged_by" integer NOT NULL,
	"reason" varchar(500) NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"admin_note" text,
	"resolved_by" integer,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(32) DEFAULT 'custom' NOT NULL,
	"title" varchar(200) NOT NULL,
	"target_value" numeric(10, 2) NOT NULL,
	"current_value" numeric(10, 2) DEFAULT '0' NOT NULL,
	"unit" varchar(50) DEFAULT '',
	"deadline" varchar(10),
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"last_check_in_at" timestamp,
	"badge_earned" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"family_member_id" integer,
	"record_type" varchar(32) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"file_urls" jsonb,
	"file_keys" jsonb,
	"provider_id" integer,
	"record_date" varchar(10),
	"is_shared_with_provider" boolean DEFAULT false,
	"shared_with_providers" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"score" smallint DEFAULT 0,
	"breakdown" jsonb,
	"streak_days" integer DEFAULT 0,
	"level" "loyalty_tier" DEFAULT 'bronze',
	"answers_json" jsonb,
	"calculated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "health_scores_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "insurance_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" varchar(100) NOT NULL,
	"name_local" varchar(100),
	"logo_url" text,
	"country_code" varchar(2) NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "loyalty_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"lifetime_earned" integer DEFAULT 0 NOT NULL,
	"lifetime_redeemed" integer DEFAULT 0 NOT NULL,
	"tier" "loyalty_tier" DEFAULT 'bronze' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyalty_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"points" integer NOT NULL,
	"action" varchar(32) NOT NULL,
	"reference_id" integer,
	"description" varchar(300),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"country_name_en" varchar(100) NOT NULL,
	"country_name_local" varchar(100),
	"default_locale" varchar(10) DEFAULT 'en',
	"currency_code" varchar(3) DEFAULT 'USD',
	"currency_symbol" varchar(5) DEFAULT '$',
	"timezone" varchar(64) DEFAULT 'UTC',
	"compliance_framework" "compliance_framework" DEFAULT 'gdpr',
	"notification_channels" jsonb,
	"payment_gateway" "payment_gateway" DEFAULT 'stripe',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "market_configs_country_code_unique" UNIQUE("country_code")
);
--> statement-breakpoint
CREATE TABLE "market_waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320) NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"country_name" varchar(100),
	"role" varchar(16) DEFAULT 'member' NOT NULL,
	"user_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medication_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"medication_name" varchar(200) NOT NULL,
	"dosage" varchar(100),
	"scheduled_date" varchar(10) NOT NULL,
	"scheduled_time" varchar(8),
	"taken" boolean DEFAULT false NOT NULL,
	"taken_at" timestamp,
	"skipped_reason" varchar(300),
	"notes" text,
	"prescription_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"dosage" varchar(100),
	"frequency" "frequency" DEFAULT 'once_daily' NOT NULL,
	"start_date" varchar(10),
	"end_date" varchar(10),
	"reminder_time" varchar(5) DEFAULT '08:00',
	"reminder_enabled" boolean DEFAULT true NOT NULL,
	"notes" text,
	"prescribed_by" varchar(200),
	"color" varchar(20) DEFAULT 'teal',
	"reminder_last_sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"content_type" varchar(8) DEFAULT 'text',
	"content" text,
	"file_url" text,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "no_show_disputes" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"reason" text NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"admin_note" text,
	"resolved_at" timestamp,
	"resolved_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"channel" "channel" NOT NULL,
	"category" varchar(32) NOT NULL,
	"enabled" boolean DEFAULT true,
	"remind_24h_opt_out" boolean DEFAULT false,
	"remind_1h_opt_out" boolean DEFAULT false,
	"provider_remind_24h_opt_out" boolean DEFAULT false,
	"provider_remind_1h_opt_out" boolean DEFAULT false,
	"whatsapp_opt_in_confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"body" text,
	"data" jsonb,
	"channel" "channel" DEFAULT 'in_app',
	"delivery_status" "delivery_status" DEFAULT 'pending',
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_insurance" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"insurance_provider_id" integer NOT NULL,
	"membership_number" varchar(100) NOT NULL,
	"holder_name" varchar(150),
	"expiry_date" varchar(10),
	"front_image_url" text,
	"back_image_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"sessions_remaining" integer NOT NULL,
	"sessions_total" integer DEFAULT 0 NOT NULL,
	"purchased_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"stripe_payment_intent_id" varchar(255),
	"renewal_reminder_opt_out" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payout_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'JOD' NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"bank_details" text,
	"admin_notes" text,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "platform_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(128) NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" integer,
	CONSTRAINT "platform_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "prescription_refills" (
	"id" serial PRIMARY KEY NOT NULL,
	"prescription_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"patient_note" text,
	"provider_note" text,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prescriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"type" varchar(16) DEFAULT 'prescription' NOT NULL,
	"diagnosis" text NOT NULL,
	"medications" jsonb NOT NULL,
	"referral_specialty" varchar(120),
	"referral_reason" text,
	"notes" text,
	"pdf_url" varchar(500),
	"pdf_key" varchar(300),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"badge_type" varchar(32) NOT NULL,
	"awarded_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "provider_blackout_dates" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"date" varchar(10) NOT NULL,
	"reason" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_calendar_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"expires_at" timestamp,
	"calendar_id" varchar(200) DEFAULT 'primary',
	"sync_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "provider_calendar_tokens_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "provider_clinics" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"address" text,
	"city" varchar(100),
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"phone" varchar(30),
	"email" varchar(150),
	"working_hours" text,
	"is_active" boolean DEFAULT true,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_credits" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"lifetime_earned" integer DEFAULT 0 NOT NULL,
	"lifetime_spent" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_insurances" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"insurance_provider_id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"accepted_since" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_patient_referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_provider_id" integer NOT NULL,
	"to_provider_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"reason" text NOT NULL,
	"urgency" varchar(16) DEFAULT 'routine' NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"notes" text,
	"appointment_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_profile_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"viewer_user_id" integer,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"specialty_id" integer,
	"license_number" varchar(50),
	"licence_jurisdiction" varchar(10),
	"npi_number" varchar(20),
	"scfhs_number" varchar(30),
	"dha_number" varchar(30),
	"moh_number" varchar(30),
	"eu_prof_qual_ref" varchar(60),
	"verification_status" "verification_status" DEFAULT 'pending',
	"display_name_ar" varchar(200),
	"bio" text,
	"bio_ar" text,
	"specialty_description_ar" text,
	"education" jsonb,
	"experience_years" integer DEFAULT 0,
	"consultation_fee" numeric(10, 2),
	"currency_code" varchar(3) DEFAULT 'USD',
	"languages" jsonb,
	"accepted_insurance" jsonb,
	"office_address" text,
	"city" varchar(100),
	"country_code" varchar(2),
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"working_hours" jsonb,
	"rating_avg" numeric(3, 2) DEFAULT '0',
	"review_count" integer DEFAULT 0,
	"provider_type" "provider_type" DEFAULT 'doctor',
	"is_featured" boolean DEFAULT false,
	"slug" varchar(200),
	"gallery_urls" jsonb,
	"offers_video" boolean DEFAULT false NOT NULL,
	"enable_recording" boolean DEFAULT true NOT NULL,
	"cancellation_window_hours" integer DEFAULT 24 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"completeness_email_sent" boolean DEFAULT false NOT NULL,
	"onboarding_completed_steps" jsonb,
	"avg_response_hours" numeric(6, 2),
	"monthly_earnings_goal" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "provider_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "provider_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "provider_reels" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"mux_upload_id" varchar(100),
	"mux_asset_id" varchar(100),
	"mux_playback_id" varchar(100),
	"upload_status" varchar(20) DEFAULT 'waiting',
	"video_url" text,
	"source_url" text,
	"source_platform" varchar(16) DEFAULT 'upload',
	"thumbnail_url" text,
	"caption" text,
	"caption_ar" text,
	"category" varchar(32) DEFAULT 'other',
	"duration_seconds" integer,
	"view_count" integer DEFAULT 0,
	"like_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"moderation_status" varchar(16) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_schedule_template_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_schedule_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(300),
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"stripe_subscription_id" varchar(100),
	"stripe_customer_id" varchar(100),
	"status" "subscription_status" DEFAULT 'trialing',
	"billing_period" "billing_period" DEFAULT 'monthly',
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_trust_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"review_score" integer DEFAULT 0 NOT NULL,
	"response_score" integer DEFAULT 0 NOT NULL,
	"completeness_score" integer DEFAULT 0 NOT NULL,
	"verification_score" integer DEFAULT 0 NOT NULL,
	"completion_score" integer DEFAULT 0 NOT NULL,
	"tier" "trust_tier" DEFAULT 'standard' NOT NULL,
	"calculated_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "provider_trust_scores_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
CREATE TABLE "provider_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"document_type" varchar(32) NOT NULL,
	"file_url" text NOT NULL,
	"status" varchar(16) DEFAULT 'pending',
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"rejection_reason" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"platform" varchar(20) DEFAULT 'web' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recording_access_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"teleconsultation_id" integer,
	"accessed_by_user_id" integer NOT NULL,
	"accessed_by_role" "role" NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"accessed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recording_consent_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"action" varchar(8) NOT NULL,
	"consented_by" varchar(20) DEFAULT 'patient' NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(512),
	"expires_at" timestamp,
	"auto_revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reel_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"reel_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reel_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"reel_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reel_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"reel_id" integer NOT NULL,
	"reported_by" integer NOT NULL,
	"reason" varchar(32) NOT NULL,
	"details" text,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"referrer_id" integer NOT NULL,
	"referee_id" integer,
	"code" varchar(20) NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"reward_granted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "referrals_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "reschedule_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"requested_by" integer NOT NULL,
	"new_date" varchar(10) NOT NULL,
	"new_time" varchar(8) NOT NULL,
	"reason" text,
	"status" varchar(16) DEFAULT 'pending',
	"responded_at" timestamp,
	"decline_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"rating" smallint NOT NULL,
	"comment" text,
	"aspects" jsonb,
	"provider_response" text,
	"provider_response_at" timestamp,
	"is_visible" boolean DEFAULT true,
	"moderation_status" "moderation_status" DEFAULT 'pending',
	"moderation_note" text,
	"moderated_at" timestamp,
	"moderated_by" integer,
	"ai_moderation_score" integer,
	"is_verified_appointment" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_appointment_id_unique" UNIQUE("appointment_id")
);
--> statement-breakpoint
CREATE TABLE "satisfaction_surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"q1_overall" smallint,
	"q2_communication" smallint,
	"q3_recommend" smallint,
	"comment" text,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"submitted_at" timestamp,
	"provider_reply" text,
	"replied_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "satisfaction_surveys_appointment_id_unique" UNIQUE("appointment_id")
);
--> statement-breakpoint
CREATE TABLE "saved_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"query_text" text,
	"filters" jsonb,
	"results_count" integer,
	"country_code" varchar(2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slot_holds" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"slot_start" timestamp NOT NULL,
	"slot_end" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL,
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "specialties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" varchar(100) NOT NULL,
	"name_ar" varchar(100),
	"slug" varchar(120) NOT NULL,
	"icon_url" text,
	"parent_id" integer,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "specialties_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sponsor_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer,
	"company_name" varchar(200) NOT NULL,
	"contact_email" varchar(320),
	"tier_interest" varchar(16) DEFAULT 'bronze' NOT NULL,
	"message" text,
	"status" varchar(16) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsored_listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"target_specialty_id" integer,
	"target_country_code" varchar(2),
	"credit_budget" numeric(10, 2) NOT NULL,
	"credits_spent" numeric(10, 2) DEFAULT '0' NOT NULL,
	"bid_per_click" numeric(6, 2) DEFAULT '0.50' NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_watchlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"symbol" varchar(20) NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"price_monthly" jsonb,
	"price_annual" jsonb,
	"features" jsonb,
	"limits" jsonb,
	"stripe_price_id_monthly" varchar(100),
	"stripe_price_id_annual" varchar(100),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "teleconsultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"room_url" text,
	"room_name" varchar(100),
	"started_at" timestamp,
	"ended_at" timestamp,
	"duration_minutes" integer,
	"recording_url" text,
	"recording_status" "recording_status" DEFAULT 'none',
	"recording_expires_at" timestamp,
	"recording_id" varchar(128),
	"status" varchar(16) DEFAULT 'scheduled',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teleconsultations_appointment_id_unique" UNIQUE("appointment_id")
);
--> statement-breakpoint
CREATE TABLE "user_coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"coupon_id" integer NOT NULL,
	"status" varchar(16) DEFAULT 'claimed' NOT NULL,
	"appointment_id" integer,
	"claimed_at" timestamp DEFAULT now() NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_credit_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"type" varchar(32) NOT NULL,
	"description" varchar(255),
	"reference_id" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"lifetime_earned" integer DEFAULT 0 NOT NULL,
	"lifetime_spent" integer DEFAULT 0 NOT NULL,
	"last_login_streak_at" timestamp,
	"streak_days" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"supabase_uid" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"phone" varchar(32),
	"avatar_url" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"country_code" varchar(2) DEFAULT 'JO',
	"locale" varchar(10) DEFAULT 'en',
	"timezone" varchar(64) DEFAULT 'Asia/Amman',
	"date_of_birth" varchar(10),
	"gender" "gender",
	"city" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"sms_opted_out" boolean DEFAULT false,
	"preferred_jurisdiction" varchar(10),
	"no_show_count" integer DEFAULT 0 NOT NULL,
	"referral_source" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_signed_in" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_supabase_uid_unique" UNIQUE("supabase_uid")
);
--> statement-breakpoint
CREATE TABLE "visit_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"chief_complaint" text,
	"diagnosis" text,
	"treatment_plan" text,
	"prescriptions" text,
	"follow_up_date" varchar(10),
	"follow_up_notes" text,
	"is_shared_with_patient" boolean DEFAULT false NOT NULL,
	"shared_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waiting_room_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"patient_ready" boolean DEFAULT false NOT NULL,
	"provider_ready" boolean DEFAULT false NOT NULL,
	"patient_ready_at" timestamp,
	"provider_ready_at" timestamp,
	"call_started_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waiting_room_status_appointment_id_unique" UNIQUE("appointment_id")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"slot_date" varchar(10) NOT NULL,
	"slot_time" varchar(5) NOT NULL,
	"consultation_type" varchar(16) DEFAULT 'in_clinic',
	"status" varchar(16) DEFAULT 'waiting' NOT NULL,
	"notified_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_ai_user" ON "ai_interactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_appt_doc_appointment" ON "appointment_documents" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "idx_appt_doc_patient" ON "appointment_documents" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_pkg_provider" ON "appointment_packages" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_appt_survey_appointment" ON "appointment_surveys" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "idx_appt_survey_patient" ON "appointment_surveys" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_appt_patient" ON "appointments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_appt_provider" ON "appointments" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_appt_status" ON "appointments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_appt_slot_start" ON "appointments" USING btree ("slot_start");--> statement-breakpoint
CREATE INDEX "idx_audit_user" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_audit_created" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_slot_provider" ON "availability_slots" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_at_provider" ON "availability_templates" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_cgm_clinic" ON "clinic_group_members" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX "idx_cgm_provider" ON "clinic_group_members" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_consent_user" ON "consent_records" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_consent_type" ON "consent_records" USING btree ("consent_type","status");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_conv_unique" ON "conversations" USING btree ("patient_id","provider_id");--> statement-breakpoint
CREATE INDEX "idx_coupon_code" ON "coupons" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_coupon_provider" ON "coupons" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_credit_tx_provider" ON "credit_transactions" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_cron_logs_job" ON "cron_logs" USING btree ("job_name");--> statement-breakpoint
CREATE INDEX "idx_cron_logs_ran" ON "cron_logs" USING btree ("ran_at");--> statement-breakpoint
CREATE INDEX "idx_claim_deal" ON "deal_claims" USING btree ("deal_id");--> statement-breakpoint
CREATE INDEX "idx_claim_patient" ON "deal_claims" USING btree ("patient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_claim_unique" ON "deal_claims" USING btree ("deal_id","patient_id");--> statement-breakpoint
CREATE INDEX "idx_deal_provider" ON "deals" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_deal_status" ON "deals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_deal_country" ON "deals" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "idx_deal_valid" ON "deals" USING btree ("valid_from","valid_until");--> statement-breakpoint
CREATE INDEX "idx_dr_user" ON "deletion_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_dr_status" ON "deletion_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_epidemic_cache_country_lang" ON "epidemic_alerts_cache" USING btree ("country_code","lang");--> statement-breakpoint
CREATE INDEX "idx_event_reg_event" ON "event_registrations" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_event_reg_user" ON "event_registrations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_event_reg_email" ON "event_registrations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_event_status" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_event_type" ON "events" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_family_primary" ON "family_members" USING btree ("primary_user_id");--> statement-breakpoint
CREATE INDEX "idx_flag_review" ON "flagged_reviews" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX "idx_flag_status" ON "flagged_reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_hg_user" ON "health_goals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_record_user" ON "health_records" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_loyalty_user" ON "loyalty_points" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_loyalty_tx_user" ON "loyalty_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_mwl_email" ON "market_waitlist" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_mwl_country" ON "market_waitlist" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "idx_medlog_patient" ON "medication_logs" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_medlog_date" ON "medication_logs" USING btree ("scheduled_date");--> statement-breakpoint
CREATE INDEX "idx_med_user" ON "medications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_msg_conv" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_nsd_patient" ON "no_show_disputes" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_nsd_status" ON "no_show_disputes" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_notif_pref_unique" ON "notification_preferences" USING btree ("user_id","channel","category");--> statement-breakpoint
CREATE INDEX "idx_notif_user" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_pi_user" ON "patient_insurance" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_patient_pkg_patient" ON "patient_packages" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_patient_pkg_package" ON "patient_packages" USING btree ("package_id");--> statement-breakpoint
CREATE INDEX "idx_pr_provider" ON "payout_requests" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_pr_status" ON "payout_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_refill_prescription" ON "prescription_refills" USING btree ("prescription_id");--> statement-breakpoint
CREATE INDEX "idx_refill_patient" ON "prescription_refills" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_rx_patient" ON "prescriptions" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_rx_provider" ON "prescriptions" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_badge_provider" ON "provider_badges" USING btree ("provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_badge_provider_type" ON "provider_badges" USING btree ("provider_id","badge_type");--> statement-breakpoint
CREATE INDEX "idx_blackout_provider" ON "provider_blackout_dates" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_blackout_date" ON "provider_blackout_dates" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_clinic_provider" ON "provider_clinics" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_prov_credits_provider" ON "provider_credits" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_prov_ins_provider" ON "provider_insurances" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_ppr_from" ON "provider_patient_referrals" USING btree ("from_provider_id");--> statement-breakpoint
CREATE INDEX "idx_ppr_to" ON "provider_patient_referrals" USING btree ("to_provider_id");--> statement-breakpoint
CREATE INDEX "idx_ppr_patient" ON "provider_patient_referrals" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_ppv_provider" ON "provider_profile_views" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_ppv_viewed_at" ON "provider_profile_views" USING btree ("viewed_at");--> statement-breakpoint
CREATE INDEX "idx_provider_country" ON "provider_profiles" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "idx_provider_specialty" ON "provider_profiles" USING btree ("specialty_id");--> statement-breakpoint
CREATE INDEX "idx_reel_provider" ON "provider_reels" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_sched_tmpl_slot_template" ON "provider_schedule_template_slots" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "idx_sched_tmpl_provider" ON "provider_schedule_templates" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_trust_score" ON "provider_trust_scores" USING btree ("score");--> statement-breakpoint
CREATE INDEX "idx_push_token_user" ON "push_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ral_appointment" ON "recording_access_log" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "idx_ral_user" ON "recording_access_log" USING btree ("accessed_by_user_id");--> statement-breakpoint
CREATE INDEX "idx_rcl_appointment" ON "recording_consent_log" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "idx_rcl_user" ON "recording_consent_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_reel_comment" ON "reel_comments" USING btree ("reel_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_reel_like_unique" ON "reel_likes" USING btree ("reel_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_reel_report_reel" ON "reel_reports" USING btree ("reel_id");--> statement-breakpoint
CREATE INDEX "idx_reel_report_status" ON "reel_reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_referral_referrer" ON "referrals" USING btree ("referrer_id");--> statement-breakpoint
CREATE INDEX "idx_referral_code" ON "referrals" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_reschedule_appt" ON "reschedule_requests" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "idx_reschedule_patient" ON "reschedule_requests" USING btree ("requested_by");--> statement-breakpoint
CREATE INDEX "idx_review_provider" ON "reviews" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_survey_patient" ON "satisfaction_surveys" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_survey_provider" ON "satisfaction_surveys" USING btree ("provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_saved_unique" ON "saved_providers" USING btree ("user_id","provider_id");--> statement-breakpoint
CREATE INDEX "idx_sh_provider_slot" ON "slot_holds" USING btree ("provider_id","slot_start");--> statement-breakpoint
CREATE INDEX "idx_sh_expires" ON "slot_holds" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_sponsor_inq_event" ON "sponsor_inquiries" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_sponsor_inq_status" ON "sponsor_inquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_sponsored_provider" ON "sponsored_listings" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_sponsored_status" ON "sponsored_listings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_stock_user" ON "stock_watchlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_uc_user" ON "user_coupons" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_uc_coupon" ON "user_coupons" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX "idx_uct_user" ON "user_credit_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_credits_user" ON "user_credits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_vn_appointment" ON "visit_notes" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "idx_vn_provider" ON "visit_notes" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_vn_patient" ON "visit_notes" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_waitlist_provider" ON "waitlist" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_waitlist_patient" ON "waitlist" USING btree ("patient_id");