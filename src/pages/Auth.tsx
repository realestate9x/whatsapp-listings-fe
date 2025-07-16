import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);
  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render auth form if user is already authenticated
  if (user) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        if (data.user) {
          navigate("/dashboard");
        }
      } else {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        if (data.user) {
          toast.success(
            "Account created successfully! Please check your email to verify your account."
          );
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          <Card className="border border-gray-200 rounded-lg bg-white shadow-lg">
            <CardHeader className="text-center p-8">
              <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
                {isLogin ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin
                  ? "Sign in to your account to continue"
                  : "Get started by creating your account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-base font-semibold text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="user@company.com"
                    required
                    disabled={submitLoading}
                    className="h-12 text-base rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                  />
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-base font-semibold text-gray-700"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    disabled={submitLoading}
                    className="h-12 text-base rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                  />
                </div>

                {/* Signup Additional Fields */}
                {!isLogin && (
                  <div className="space-y-3">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-base font-semibold text-gray-700"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      disabled={submitLoading}
                      className="h-12 text-base rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-lg transition-colors duration-200"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    "Please wait..."
                  ) : (
                    <div className="flex items-center justify-center">
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Toggle between login/signup */}
              <div className="mt-8 text-center">
                <p className="text-base text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                    disabled={submitLoading}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>

              {/* Additional text */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Secure authentication powered by Supabase
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
