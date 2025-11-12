"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
require("dotenv/config");
const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
// Prefer service role key on server; fallback to anon if needed
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';
const KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !KEY) {
    // eslint-disable-next-line no-console
    console.warn('[supabase] Missing SUPABASE_URL or server key (SERVICE_ROLE or ANON)');
}
exports.supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});
/**
 * Test the database connection
 * @returns Promise<void>
 */
const testConnection = async () => {
    try {
        // Simple query to test connection - queries the users table
        const { error } = await exports.supabase
            .from('users')
            .select('id')
            .limit(1);
        if (error) {
            console.error('[Supabase] Connection test failed:', error.message);
            throw new Error(`Database connection failed: ${error.message}`);
        }
        console.log('[Supabase] Database connection successful');
    }
    catch (error) {
        console.error('[Supabase] Connection test error:', error);
        throw error;
    }
};
exports.testConnection = testConnection;
exports.default = exports.supabase;
//# sourceMappingURL=supabase.js.map