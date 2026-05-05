"use client";

import React, { useState, useEffect } from 'react';

export default function DesktopIdentitySetup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Try to load existing identity
    if (typeof window !== "undefined" && window.dcfDesktop) {
      window.dcfDesktop.getIdentity().then(identity => {
        if (identity) {
          setFullName(identity.fullName || "");
          setEmail(identity.email || "");
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError("Please provide both full name and email.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (typeof window !== "undefined" && window.dcfDesktop) {
        await window.dcfDesktop.saveIdentity({ fullName: fullName.trim(), email: email.trim() });
        // The electron main process will reload the window to the main app
      } else {
        setError("Desktop API not found. Are you running in Electron?");
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save identity";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg-app) p-4 font-sans text-(--text-primary)">
      <div className="w-full max-w-md rounded-xl border border-(--border-subtle) bg-(--bg-card) p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight">DCF Builder Pro</h1>
          <p className="mt-2 text-sm text-(--text-secondary)">
            Identity Configuration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="mb-4 text-sm text-(--text-secondary) leading-relaxed">
              DCF Builder Pro needs your full name and email to identify requests to SEC EDGAR. This is stored locally on your device.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-(--text-secondary)">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-4 py-2.5 text-sm outline-none transition-colors focus:border-(--border-subtle) focus:ring-1 focus:ring-(--border-subtle) text-(--text-primary)"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-(--text-secondary)">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-4 py-2.5 text-sm outline-none transition-colors focus:border-(--border-subtle) focus:ring-1 focus:ring-(--border-subtle) text-(--text-primary)"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-(--text-primary) px-4 py-3 text-sm font-bold text-(--bg-app) transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
