import { createHash, timingSafeEqual } from "crypto";

/**
 * In-process OTP store for the custom email-verification flow.
 *
 * Codes are kept hashed (sha256), single-use, TTL-bound, and attempt-limited.
 * The Map is pinned to `globalThis` so it survives Next dev HMR / route module
 * reloads within one Node process. This is deliberately infra-free to match the
 * app's lightweight stage; to scale across instances, swap the three store
 * operations below for a shared backend (Postgres table or Redis) — the public
 * API (`setOtp` / `verifyOtp`) stays the same.
 */

interface OtpRecord {
    hash: string;
    expiresAt: number;
    attempts: number;
}

const TTL_MS = 10 * 60 * 1000; // 10 minutes, matches the email copy + UI
const MAX_ATTEMPTS = 5;

declare global {
    var __triplitOtpStore: Map<string, OtpRecord> | undefined;
}

const store: Map<string, OtpRecord> =
    globalThis.__triplitOtpStore ?? new Map<string, OtpRecord>();
globalThis.__triplitOtpStore = store;

const normalize = (email: string) => email.trim().toLowerCase();
const hashCode = (code: string) => createHash("sha256").update(code).digest("hex");

export function setOtp(email: string, code: string): void {
    store.set(normalize(email), {
        hash: hashCode(code),
        expiresAt: Date.now() + TTL_MS,
        attempts: 0,
    });
}

export type VerifyResult = "ok" | "invalid" | "expired" | "too_many";

export function verifyOtp(email: string, code: string): VerifyResult {
    const key = normalize(email);
    const record = store.get(key);

    if (!record) return "invalid";
    if (Date.now() > record.expiresAt) {
        store.delete(key);
        return "expired";
    }
    if (record.attempts >= MAX_ATTEMPTS) {
        store.delete(key);
        return "too_many";
    }

    const candidate = Buffer.from(hashCode(code));
    const expected = Buffer.from(record.hash);
    const match = candidate.length === expected.length && timingSafeEqual(candidate, expected);

    if (!match) {
        record.attempts += 1;
        return "invalid";
    }

    store.delete(key); // single-use
    return "ok";
}
