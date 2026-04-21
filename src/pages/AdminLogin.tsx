/**
 * Admin Login Page
 * Dedicated sign-in for the admin account.
 * Only accepts the fixed admin email; auto-creates account on first login.
 */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

// Dedicated admin credentials
const ADMIN_EMAIL = "admin@wanderlust.com";
const ADMIN_PASSWORD = "Admin@12345";

const AdminLogin = () => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signIn, signUp, user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) navigate("/admin", { replace: true });
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setError("Invalid admin credentials");
      return;
    }

    setIsLoading(true);
    try {
      // Try to sign in first
      const { error: signInError } = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD);
      if (signInError) {
        // Account doesn't exist yet — create it (trigger auto-grants admin role)
        const { error: signUpError } = await signUp(ADMIN_EMAIL, ADMIN_PASSWORD, "Administrator");
        if (signUpError) {
          setError(signUpError);
          setIsLoading(false);
          return;
        }
        const { error: retryError } = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD);
        if (retryError) {
          setError(retryError);
          setIsLoading(false);
          return;
        }
      }
      toast.success("Welcome, Admin!");
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.3),transparent_50%)]" />
      </div>

      <div className="w-full max-w-md space-y-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Restricted access — administrators only
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white/10 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-white/10 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full btn-gradient py-6 text-base font-semibold" disabled={isLoading}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Sign In as Admin
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="rounded-xl bg-muted/30 backdrop-blur-sm border border-white/10 p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Default Credentials:</p>
          <p>Email: <code className="text-primary">{ADMIN_EMAIL}</code></p>
          <p>Password: <code className="text-primary">{ADMIN_PASSWORD}</code></p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Not an admin?{" "}
          <Link to="/auth" className="text-primary font-medium hover:underline">
            User sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
