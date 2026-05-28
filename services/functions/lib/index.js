"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCode = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.runCode = functions.https.onCall(async (request) => {
    // Validate authentication
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    const { code, language } = request.data;
    // Basic validation
    if (!code || typeof code !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid code string.');
    }
    if (language !== 'python' && language !== 'rust') {
        throw new functions.https.HttpsError('invalid-argument', 'Supported languages are only "python" and "rust".');
    }
    // Get Sandbox URL (default to local sandbox in emulator mode)
    const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';
    const sandboxUrl = process.env.SANDBOX_URL || (isEmulator ? 'http://127.0.0.1:3001' : '');
    if (!sandboxUrl) {
        throw new functions.https.HttpsError('failed-precondition', 'Sandbox URL is not configured.');
    }
    try {
        const res = await fetch(`${sandboxUrl}/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new functions.https.HttpsError('internal', errBody.message || `Sandbox error: HTTP ${res.status}`);
        }
        const result = (await res.json());
        return result;
    }
    catch (err) {
        if (err instanceof functions.https.HttpsError) {
            throw err;
        }
        throw new functions.https.HttpsError('internal', err instanceof Error ? err.message : 'Failed to communicate with sandbox');
    }
});
//# sourceMappingURL=index.js.map