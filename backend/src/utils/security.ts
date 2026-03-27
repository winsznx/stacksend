import crypto from 'crypto';
import type { Request } from 'express';
import { config } from '../config/env.js';

const STACKS_STANDARD_PRINCIPAL_REGEX = /^S[TPM][0-9A-HJ-NP-Za-km-z]{33,41}$/;

export function isValidStacksAddress(address: string): boolean {
    return STACKS_STANDARD_PRINCIPAL_REGEX.test(address);
}

export function safeSecretCompare(provided: string | null | undefined, expected: string): boolean {
    if (!provided || provided.length !== expected.length) {
        return false;
    }

    const providedBuffer = Buffer.from(provided);
    const expectedBuffer = Buffer.from(expected);

    return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

export function isWebhookAuthorized(req: Request): boolean {
    const webhookSecret = config.webhooks.secret;
    if (!webhookSecret) {
        return true;
    }

    const secretFromHeader = req.header('x-webhook-secret');
    const secretFromQuery = typeof req.query.secret === 'string' ? req.query.secret : null;

    return safeSecretCompare(secretFromHeader, webhookSecret) || safeSecretCompare(secretFromQuery, webhookSecret);
}

export function parseLimit(rawLimit: unknown, fallback = 50, max = 200): number {
    const parsed = Number.parseInt(String(rawLimit ?? fallback), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
    }
    return Math.min(parsed, max);
}


export type {};
