"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, RefreshCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthDiagnostics() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [envCheck, setEnvCheck] = useState<{ url: boolean; key: boolean }>({ url: false, key: false });
    const [message, setMessage] = useState<string>("");

    const checkConnection = async () => {
        setStatus("loading");
        setMessage("Checking connection...");

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        setEnvCheck({
            url: !!url && url.length > 0,
            key: !!key && key.length > 0,
        });

        if (!url || !key) {
            setStatus("error");
            setMessage("Missing Environment Variables");
            return;
        }

        try {
            // Just a simple ping to check if we can reach Supabase
            const { error } = await supabase.from('test_connection').select('*').limit(1);

            // We expect an error because 'test_connection' table likely doesn't exist, 
            // but a specific error (PGRST204 or 404) means we REACHED Supabase.
            // A generic "Failed to fetch" means we didn't reach it.

            if (error && error.message.includes("Failed to fetch")) {
                throw new Error("Network Error: Could not reach Supabase");
            }

            setStatus("success");
            setMessage("Connection Valid (Auth is ready)");

        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "Connection Failed");
        }
    };

    useEffect(() => {
        checkConnection();
    }, []);

    return (
        <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10 text-sm">
            <h3 className="text-gray-400 font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={16} /> Connection Diagnostics
            </h3>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Supabase URL</span>
                    {envCheck.url ? (
                        <span className="text-emerald-500 flex items-center gap-1"><CheckCircle size={14} /> Set</span>
                    ) : (
                        <span className="text-red-500 flex items-center gap-1"><XCircle size={14} /> Missing</span>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Supabase Key</span>
                    {envCheck.key ? (
                        <span className="text-emerald-500 flex items-center gap-1"><CheckCircle size={14} /> Set</span>
                    ) : (
                        <span className="text-red-500 flex items-center gap-1"><XCircle size={14} /> Missing</span>
                    )}
                </div>

                <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between">
                    <span className={`font-medium ${status === 'success' ? 'text-emerald-400' : status === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {status === 'loading' ? 'Testing...' : message}
                    </span>
                    <button onClick={checkConnection} className="text-gray-400 hover:text-white transition-colors">
                        <RefreshCcw size={14} />
                    </button>
                </div>
            </div>

            {status === 'error' && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-300 text-xs">
                    <strong>Fix Required:</strong> Check your <code>.env.local</code> file. Ensure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are correct and you typically need to restart the server after changing them.
                </div>
            )}
        </div>
    );
}
