import crypto from 'crypto';
import type { Request } from 'express';
import { config } from '../config/env.js';

const STACKS_STANDARD_PRINCIPAL_REGEX = /^S[TPM][0-9A-HJ-NP-Za-km-z]{33,41}$/;

/**
 * Validates whether a given string is a valid Stacks address format.
 * 
 * @param address - The Stacks address to validate
 * @returns True if the address is a valid Stacks format, false otherwise
 */
export function isValidStacksAddress(address: string): boolean {
    return STACKS_STANDARD_PRINCIPAL_REGEX.test(address);
}

/**
 * Safely compares two strings in constant time to prevent timing attacks.
 * 
 * @param provided - The provided secret/token
 * @param expected - The expected secret/token
 * @returns True if the strings match perfectly, false otherwise
 */
export function safeSecretCompare(provided: string | null | undefined, expected: string): boolean {
    if (!provided || provided.length !== expected.length) {
        return false;
    }

    const providedBuffer = Buffer.from(provided);
    const expectedBuffer = Buffer.from(expected);

    return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

/**
 * Checks whether an incoming webhook request has the valid authorization secret.
 * It checks both the 'x-webhook-secret' header and the 'secret' query parameter.
 * 
 * @param req - The Express request object containing the webhook payload
 * @returns True if the webhook is authorized or if no secret is configured
 */
export function isWebhookAuthorized(req: Request): boolean {
    const webhookSecret = config.webhooks.secret;
    if (!webhookSecret) {
        return true;
    }

    const secretFromHeader = req.header('x-webhook-secret');
    const secretFromQuery = typeof req.query.secret === 'string' ? req.query.secret : null;

    return safeSecretCompare(secretFromHeader, webhookSecret) || safeSecretCompare(secretFromQuery, webhookSecret);
}

/**
 * Parses a limit value from an unknown input and enforces bounds.
 * 
 * @param rawLimit - The raw input value for limit (usually from query params)
 * @param fallback - The default limit if the input is invalid
 * @param max - The absolute maximum allowed limit
 * @returns The parsed and bounded limit integer
 */
export function parseLimit(rawLimit: unknown, fallback = 50, max = 200): number {
    const parsed = Number.parseInt(String(rawLimit ?? fallback), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
    }
    return Math.min(parsed, max);
}


export type {};
