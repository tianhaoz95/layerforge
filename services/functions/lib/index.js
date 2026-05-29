"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPortalSession = exports.stripeWebhook = exports.createCheckoutSession = exports.runCode = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const CLOUD_RUN_SANDBOX_URL = 'https://sandbox-li4rwaueia-uc.a.run.app';
const METADATA_TOKEN_URL = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity';
async function getIdentityToken(audience) {
    const url = `${METADATA_TOKEN_URL}?audience=${encodeURIComponent(audience)}`;
    const res = await fetch(url, { headers: { 'Metadata-Flavor': 'Google' } });
    if (!res.ok) {
        throw new Error(`Metadata server returned HTTP ${res.status} fetching identity token`);
    }
    return res.text();
}
async function callSandbox(baseUrl, code, language, useAuth) {
    const headers = { 'Content-Type': 'application/json' };
    if (useAuth) {
        const token = await getIdentityToken(baseUrl);
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${baseUrl}/run`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code, language }),
    });
    if (!res.ok) {
        const body = await res.text();
        const msg = `Sandbox returned HTTP ${res.status}: ${body}`;
        console.error(msg);
        throw new Error(msg);
    }
    return res.json();
}
exports.runCode = functions.https.onCall(async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    const { code, language } = request.data;
    if (!code || typeof code !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid code string.');
    }
    if (language !== 'python' && language !== 'rust') {
        throw new functions.https.HttpsError('invalid-argument', 'Supported languages are only "python" and "rust".');
    }
    const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';
    const sandboxUrl = isEmulator
        ? (process.env.SANDBOX_URL ?? 'http://127.0.0.1:3001')
        : (process.env.SANDBOX_URL ?? CLOUD_RUN_SANDBOX_URL);
    try {
        const result = await callSandbox(sandboxUrl, code, language, !isEmulator);
        return result;
    }
    catch (err) {
        console.error('runCode error:', err);
        if (err instanceof functions.https.HttpsError)
            throw err;
        throw new functions.https.HttpsError('unavailable', err instanceof Error ? err.message : 'Failed to communicate with sandbox');
    }
});
var checkout_1 = require("./stripe/checkout");
Object.defineProperty(exports, "createCheckoutSession", { enumerable: true, get: function () { return checkout_1.createCheckoutSession; } });
var webhook_1 = require("./stripe/webhook");
Object.defineProperty(exports, "stripeWebhook", { enumerable: true, get: function () { return webhook_1.stripeWebhook; } });
var portal_1 = require("./stripe/portal");
Object.defineProperty(exports, "createPortalSession", { enumerable: true, get: function () { return portal_1.createPortalSession; } });
//# sourceMappingURL=index.js.map