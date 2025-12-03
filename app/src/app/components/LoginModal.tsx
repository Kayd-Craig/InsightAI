"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { z } from "zod";
import { useAppStore } from "@/stores/store";
import { useRouter } from "next/navigation";
import { Phone, Mail, Loader2, AlertCircle } from "lucide-react";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthMethod = "phone" | "email" | "google";

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const phoneSchema = z.object({
    phone: z.string().min(1, "Phone number is required"),
  });

  const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  const { user } = useAppStore();

  // Local state for phone during login (before user is authenticated)
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("phone");
  const [otpValue, setOtpValue] = useState<string>("");
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(false);
  const router = useRouter();

  // Pre-fill phone from user metadata or localStorage when modal opens
  useEffect(() => {
    if (open) {
      // Try to get phone from user metadata first, then localStorage
      const savedPhone = user?.phone || localStorage.getItem("phone") || "";
      setPhone(savedPhone);
    }
  }, [open, user]);

  useEffect(() => {
    const checkAuth = async () => {
      if (open) {
        setIsCheckingAuth(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setTimeout(() => {
            onOpenChange(false);
            router.push("/dashboard");
          }, 800);
        } else {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();
  }, [open, router, onOpenChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (authMethod === "phone") {
        const result = phoneSchema.safeParse({ phone });

        if (!result.success) {
          const errors = result.error.flatten().fieldErrors;
          setFormError(errors.phone?.[0] || "Invalid phone number");
          setIsSubmitting(false);
          return;
        }

        const formattedPhone = phone.startsWith("+1") ? phone : "+1" + phone;

        localStorage.setItem("phone", phone);

        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });

        if (error) {
          setFormError(error.message);
          setIsSubmitting(false);
          return;
        }

        setShowOtpInput(true);
      } else if (authMethod === "email") {
        const result = emailSchema.safeParse({ email });

        if (!result.success) {
          const errors = result.error.flatten().fieldErrors;
          setFormError(errors.email?.[0] || "Invalid email");
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false,
          },
        });

        if (error) {
          setFormError(error.message);
          setIsSubmitting(false);
          return;
        }

        setShowOtpInput(true);
      } else if (authMethod === "google") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) {
          console.error("Google OAuth error:", error);
          setFormError(error.message);
        }
      }
    } catch (error) {
      console.error("Error sending verification:", error);
      setFormError("Failed to send verification code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (authMethod === "phone") {
        const formattedPhone = phone.startsWith("+1") ? phone : "+1" + phone;
        const { error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otpValue,
          type: "sms",
        });

        if (error) {
          if (error.message.includes("expired")) {
            setFormError(
              "Verification code has expired. Please request a new one."
            );
            setShowOtpInput(false);
            setOtpValue("");
          } else if (error.message.includes("invalid")) {
            setFormError(
              "Invalid verification code. Please check and try again."
            );
            setOtpValue("");
          } else {
            setFormError(error.message);
          }
          setIsSubmitting(false);
          return;
        }
      } else if (authMethod === "email") {
        const { error } = await supabase.auth.verifyOtp({
          email: email,
          token: otpValue,
          type: "email",
        });

        if (error) {
          if (error.message.includes("expired")) {
            setFormError(
              "Verification code has expired. Please request a new one."
            );
            setShowOtpInput(false);
            setOtpValue("");
          } else if (error.message.includes("invalid")) {
            setFormError(
              "Invalid verification code. Please check and try again."
            );
            setOtpValue("");
          } else {
            setFormError(error.message);
          }
          setIsSubmitting(false);
          return;
        }
      }
      onOpenChange(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setFormError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleAuthMethodChange = (value: string) => {
    if (value) {
      setAuthMethod(value as AuthMethod);
      setShowOtpInput(false);
      setOtpValue("");
      setFormError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden rounded-2xl">
        {isCheckingAuth ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <DialogTitle className="text-gray-500">Logging in...</DialogTitle>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1">
            <div className="p-8 md:p-12">
              <DialogHeader className="text-left mb-8">
                <DialogTitle className="text-3xl font-bold mb-2">
                  {showOtpInput ? "Verify Code" : "Log in"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-6">
                {formError && (
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-800 dark:text-red-200 flex-shrink-0" />
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {formError}
                    </p>
                  </div>
                )}

                {!showOtpInput ? (
                  <>
                    <div className="flex justify-between gap-3">
                      <Button
                        variant={authMethod === "phone" ? "default" : "outline"}
                        onClick={() => handleAuthMethodChange("phone")}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Phone
                      </Button>
                      <Button
                        variant={authMethod === "email" ? "default" : "outline"}
                        onClick={() => handleAuthMethodChange("email")}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {authMethod === "phone" && (
                        <Input
                          type="tel"
                          placeholder="555-555-5555"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      )}
                      {authMethod === "email" && (
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? authMethod === "google"
                          ? "Redirecting..."
                          : "Sending..."
                        : authMethod === "google"
                        ? "Continue with Google"
                        : "Send verification code"}
                    </Button>

                    {/* <div className="relative">
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 text-gray-500">
                          Or log in with
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleAuthMethodChange("google")}
                      >
                        <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                        Google
                      </Button>
                    </div> */}
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-md text-gray-500 text-center">
                      {authMethod === "phone"
                        ? `Enter the code sent to ${phone}`
                        : `Enter the code sent to ${email}`}
                    </p>

                    <div className="flex justify-center my-4">
                      <InputOTP
                        maxLength={6}
                        value={otpValue}
                        onChange={setOtpValue}
                      >
                        <InputOTPGroup className="w-full">
                          <InputOTPSlot index={0} className="w-12 h-12" />
                          <InputOTPSlot index={1} className="w-12 h-12" />
                          <InputOTPSlot index={2} className="w-12 h-12" />
                          <InputOTPSlot index={3} className="w-12 h-12" />
                          <InputOTPSlot index={4} className="w-12 h-12" />
                          <InputOTPSlot index={5} className="w-12 h-12" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      className="w-full mt-8"
                      onClick={handleVerifyOtp}
                      disabled={otpValue.length !== 6 || isSubmitting}
                    >
                      {isSubmitting ? "Verifying..." : "Verify code"}
                    </Button>

                    <div className="flex justify-center items-center">
                      <Button
                        variant="link"
                        className="text-sm text-gray-500"
                        onClick={() => {
                          setShowOtpInput(false);
                          setFormError(null);
                          setOtpValue("");
                        }}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isCheckingAuth && (
              <div className="text-center text-sm text-muted-foreground px-8 pb-8">
                <a
                  href="#"
                  className="underline cursor-pointer hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/terms-of-service");
                  }}
                >
                  Terms of Service
                </a>
                {" · "}
                <a
                  href="#"
                  className="underline cursor-pointer hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/privacy-policy");
                  }}
                >
                  Privacy Policy
                </a>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
