import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogIn } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from location state or use welcome as default
  const from = (location.state as any)?.from?.pathname || "/welcome";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting login with:", values.email);
      await login(values.email, values.password);
      // Success handled by auth context
      console.log("Login successful, navigating to:", from);
      navigate(from);
    } catch (error: any) {
      console.error("Login error in form:", error);
      // Error handling is done in the login function
      setIsLoading(false);
    }
  };

  // Special handling for demo accounts for easier login
  const loginAsDemoBasic = async () => {
    try {
      setIsLoading(true);
      await login("demo.basic@healthproassist.com", "demoBasic123");
      // The redirection is now handled in the login function itself
    } catch (error) {
      setIsLoading(false);
    }
  };

  const loginAsDemoPremium = async () => {
    try {
      setIsLoading(true);
      await login("demo.premium@healthproassist.com", "demoPremium123");
      // The redirection is now handled in the login function itself
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-md glass-card p-8 rounded-xl animate-zoom-in">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-md bg-healthcare-600 flex items-center justify-center">
            <LogIn className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 bg-healthcare-600 hover:bg-healthcare-700 mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        {/* Demo account login buttons */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or use demo accounts</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={loginAsDemoBasic}
              disabled={isLoading}
              className="h-12"
            >
              Demo Basic
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={loginAsDemoPremium}
              disabled={isLoading}
              className="h-12"
            >
              Demo Premium
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-healthcare-600 hover:text-healthcare-500"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
