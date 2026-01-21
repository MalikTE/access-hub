import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Mail, Lock } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import GoogleButton from "./GoogleButton";
import {
  loginWithGoogle,
  loginWithEmail,
  signupWithEmail,
} from "./firebaseAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* Email / Password Login */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await loginWithEmail(data.email, data.password);
      if (user) {
        navigate("/dashboard", { replace: true });
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* Google Login */
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const user = await loginWithGoogle();
      if (user) {
        navigate("/dashboard", { replace: true });
      } else {
        setErrorMessage("Google login failed.");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /* Signup */
  const handleSignup = async () => {
    const email = form.getValues("email");
    const password = form.getValues("password");

    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await signupWithEmail(email, password);
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      {/* Google Login */}
      <GoogleButton onClick={handleGoogleLogin} isLoading={isGoogleLoading} />

      {/* Divider */}
      <div className="relative text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <span className="relative bg-background px-4 text-muted-foreground text-sm">
          or continue with email
        </span>
      </div>

      {/* Email/Password Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-12"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-12 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {errorMessage && (
            <p className="flex items-center gap-2 text-destructive text-sm mt-1">
              <AlertCircle className="w-4 h-4" /> {errorMessage}
            </p>
          )}

          {/* Login Button */}
          <Button type="submit" disabled={isLoading} className="w-full h-12">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>

      {/* Signup */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
       <Button
  variant="outline"
  size="sm"
  className="ml-1"
  onClick={() => navigate("/signup")}
>
  Sign up
</Button>

      </p>
    </motion.div>
  );
};

export default LoginForm;
