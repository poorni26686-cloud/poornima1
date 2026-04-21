/**
 * Authentication Page Component
 * 
 * Handles both user registration (signup) and login flows.
 * Integrates with Supabase Auth for secure authentication.
 * 
 * Features:
 * - Email/password registration with full name
 * - Secure login with email as unique identifier
 * - Form validation with user-friendly error messages
 * - Password visibility toggle
 * - Automatic redirect after successful authentication
 * 
 * @author Tourist Guiding System
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, signupSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

// Dedicated admin credentials
const ADMIN_EMAIL = "admin@wanderlust.com";
const ADMIN_PASSWORD = "Admin@12345";

const Auth = () => {
  // Mode: user vs admin
  const [mode, setMode] = useState<"user" | "admin">("user");
  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Hooks
  const navigate = useNavigate();
  const { signIn, signUp, user, isLoading: authLoading } = useAuth();

  // Redirect authenticated users
  useEffect(() => {
    if (user && !authLoading) {
      navigate(mode === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [user, authLoading, navigate, mode]);

  // Switch mode resets form
  const switchMode = (newMode: "user" | "admin") => {
    setMode(newMode);
    setError(null);
    setIsLogin(true);
    if (newMode === "admin") {
      setFormData({ name: "", email: ADMIN_EMAIL, password: "" });
    } else {
      setFormData({ name: "", email: "", password: "" });
    }
  };

  /**
   * Handle form submission for both login and signup
   * Validates input and calls appropriate auth method
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ADMIN MODE: validate fixed credentials, auto-create on first attempt
    if (mode === "admin") {
      if (formData.email.trim().toLowerCase() !== ADMIN_EMAIL || formData.password !== ADMIN_PASSWORD) {
        setError("Invalid admin credentials");
        return;
      }
      setIsLoading(true);
      try {
        const { error: signInError } = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD);
        if (signInError) {
          // Account doesn't exist yet — create it (DB trigger grants admin role)
          const { error: signUpError } = await signUp(ADMIN_EMAIL, ADMIN_PASSWORD, "Administrator");
          if (signUpError) { setError(signUpError); setIsLoading(false); return; }
          const { error: retry } = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD);
          if (retry) { setError(retry); setIsLoading(false); return; }
        }
        toast.success("Welcome, Admin!");
        navigate("/admin", { replace: true });
      } catch (err) {
        console.error(err);
        setError("Unexpected error. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // USER MODE: standard flow
    const schema = isLogin ? loginSchema : signupSchema;
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid input";
      setError(firstError);
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login flow - verify credentials against stored bcrypt hash
        const { error: signInError } = await signIn(
          formData.email,
          formData.password
        );

        if (signInError) {
          setError(signInError);
          setIsLoading(false);
          return;
        }

        toast.success("Welcome back! You've successfully signed in.");
        navigate("/", { replace: true });
      } else {
        // Signup flow - create new user with hashed password
        const { error: signUpError } = await signUp(
          formData.email,
          formData.password,
          formData.name
        );

        if (signUpError) {
          setError(signUpError);
          setIsLoading(false);
          return;
        }

        // Auto-confirm is enabled — sign the user in immediately
        const { error: signInError } = await signIn(
          formData.email,
          formData.password
        );

        if (signInError) {
          toast.success("Account created! Please sign in.");
          setIsLogin(true);
          setFormData({ name: "", email: formData.email, password: "" });
          setIsLoading(false);
          return;
        }

        toast.success("Account created successfully! Welcome aboard.");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle input field changes
   * Updates form state and clears any existing errors
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear error when user starts typing
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Toggle between login and signup modes
   * Clears form data and errors when switching
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ name: "", email: "", password: "" });
  };

  // Show loading state while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative">
      {/* Background image covers entire page so the auth card can be transparent */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1280&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/60" />
      </div>

      {/* Left Side - Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
          {/* Logo - Links back to home */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Wanderlust
            </span>
          </Link>

          {/* Header - Changes based on mode */}
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Start your journey with us today"}
            </p>
          </div>

          {/* Error Alert - Shows authentication errors */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field - Only shown during signup */}
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white/10 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required={!isLogin}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Email Field - Used as unique identifier */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white/10 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field - With visibility toggle */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-white/10 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground mt-2">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Forgot Password Link - Only shown during login */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full btn-gradient py-6 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons (Placeholder for future implementation) */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="py-6" disabled>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="py-6" disabled>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>

          {/* Toggle Between Login and Signup */}
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90" />
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1600&fit=crop"
          alt="Beautiful mountain landscape"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground">
            <h2 className="font-display text-4xl font-bold mb-4">
              Start Your Adventure
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-md">
              Join thousands of travelers exploring the world with Wanderlust.
              Your next unforgettable journey awaits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
