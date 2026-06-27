"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dot-grid-bg px-4">
      <div className="w-full max-w-md rounded-card border border-hairline/20 bg-surface p-8 shadow-2xl">
        <h1
          className="font-display text-heading text-center mb-2"
          style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
        >
          Admin Login
        </h1>
        <p className="text-center text-sm font-medium text-body/60 mb-8">
          Sign in to manage portfolio content
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-card bg-red-900/30 border border-red-800/50 px-4 py-3 text-sm text-red-200 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block font-sans text-sm font-bold text-heading mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-card border border-hairline/30 bg-background px-4 py-3 text-body font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-[44px]"
            />
          </div>

          <div>
            <label className="block font-sans text-sm font-bold text-heading mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-card border border-hairline/30 bg-background px-4 py-3 text-body font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-[44px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
