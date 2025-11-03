import { pgTable, check, text, timestamp, unique, boolean, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("verification_id_not_null", sql`NOT NULL id`),
	check("verification_identifier_not_null", sql`NOT NULL identifier`),
	check("verification_value_not_null", sql`NOT NULL value`),
	check("verification_expires_at_not_null", sql`NOT NULL expires_at`),
	check("verification_created_at_not_null", sql`NOT NULL created_at`),
	check("verification_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	username: text(),
	displayUsername: text("display_username"),
	bio: text(),
	avatar: text(),
}, (table) => [
	unique("user_email_unique").on(table.email),
	unique("user_username_unique").on(table.username),
	check("user_id_not_null", sql`NOT NULL id`),
	check("user_name_not_null", sql`NOT NULL name`),
	check("user_email_not_null", sql`NOT NULL email`),
	check("user_email_verified_not_null", sql`NOT NULL email_verified`),
	check("user_created_at_not_null", sql`NOT NULL created_at`),
	check("user_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
	check("account_id_not_null", sql`NOT NULL id`),
	check("account_account_id_not_null", sql`NOT NULL account_id`),
	check("account_provider_id_not_null", sql`NOT NULL provider_id`),
	check("account_user_id_not_null", sql`NOT NULL user_id`),
	check("account_created_at_not_null", sql`NOT NULL created_at`),
	check("account_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
	check("session_id_not_null", sql`NOT NULL id`),
	check("session_expires_at_not_null", sql`NOT NULL expires_at`),
	check("session_token_not_null", sql`NOT NULL token`),
	check("session_created_at_not_null", sql`NOT NULL created_at`),
	check("session_updated_at_not_null", sql`NOT NULL updated_at`),
	check("session_user_id_not_null", sql`NOT NULL user_id`),
]);
