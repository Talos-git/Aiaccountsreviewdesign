// Reference copy of the Drizzle/Postgres schema for the Command Centre review feature.
// Nothing in this codebase imports from this file yet — it is here for cross-referencing
// field names, types, and constraints while the mock layer is being aligned.

import { pgTable, uuid, text, timestamp, numeric, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const findingSeverityEnum = pgEnum('finding_severity', ['critical', 'warning', 'info']);

export const findingStatusEnum = pgEnum('finding_status', [
  'open',
  'noted',
  'resolved',
  'sent_to_bookkeeper',
  'irrelevant',
]);

export const findingSourceEnum = pgEnum('finding_source', ['ai', 'code']);

// ---------------------------------------------------------------------------
// Review sessions
// ---------------------------------------------------------------------------

export const reviewSessions = pgTable('review_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull(),
  periodStart: text('period_start').notNull(),  // ISO date string e.g. '2024-01-01'
  periodEnd: text('period_end').notNull(),        // ISO date string e.g. '2024-09-30'
  version: text('version').notNull(),             // e.g. 'v2'
  status: text('status').notNull().default('open'),
  branch: text('branch'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// TODO: A `review_finding_messages` table (or a `messages jsonb` column on
// `review_findings`) is needed to back the conversation thread UI.
//
// Proposed approach — separate table (preferred for queryability):
//
//   export const reviewFindingMessages = pgTable('review_finding_messages', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     findingId: uuid('finding_id').notNull().references(() => reviewFindings.id),
//     author: text('author').notNull(),  // 'ai' | 'accountant' | 'bookkeeper'
//     text: text('text').notNull(),
//     timestamp: timestamp('timestamp').notNull().defaultNow(),
//   });
//
// Alternative — embed as jsonb on the finding row (simpler, less queryable):
//   messages: jsonb('messages').notNull().default([]),
//
// Schema TBD — the UI uses `messages: ConversationMessage[]` on the Finding
// type for now and will be wired to the real table once designed.
// ---------------------------------------------------------------------------

export const reviewFindings = pgTable('review_findings', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => reviewSessions.id),
  checkId: text('check_id'),                     // identifier of the check rule that fired
  title: text('title').notNull(),
  severity: findingSeverityEnum('severity').notNull(),
  status: findingStatusEnum('status').notNull().default('open'),
  source: findingSourceEnum('source').notNull(),
  section: text('section').notNull(),            // top-level grouping e.g. 'Balance Sheet'
  accountName: text('account_name').notNull(),   // e.g. 'Accounts Receivable'
  category: text('category').notNull(),          // full path e.g. 'Current Assets > Accounts Receivable'
  assertion: text('assertion'),                  // freeform assertion text (not an enum)
  findingType: text('finding_type'),             // e.g. 'discrepancy', 'timing', 'classification'
  amount: numeric('amount'),
  description: text('description'),             // AI-generated prose description
  actionRequired: text('action_required'),       // short fix instruction
  accountantNote: text('accountant_note'),       // single editable note from the accountant
  evidence: jsonb('evidence'),                   // { refs: string[], note?: string }
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
