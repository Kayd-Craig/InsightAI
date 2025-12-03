"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Logo } from "./Logo";
import { ParticleNetwork } from "./ParticleNetwork";
import { Mail, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginModal } from "@/app/components/LoginModal";

export const SocialSignUp = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [signUpMethod, setSignUpMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (signUpMethod === "phone") {
        const formattedPhone = `+1${phone.replace(/\D/g, "")}`;
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });

        if (error) {
          setError(error.message);
          setIsSubmitting(false);
          return;
        }

        setPhone(formattedPhone);
        setShowOtpInput(true);
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) {
          setError(error.message);
          setIsSubmitting(false);
          return;
        }

        setShowOtpInput(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (signUpMethod === "phone") {
        console.log("Verifying phone OTP for:", phone);

        const { data, error } = await supabase.auth.verifyOtp({
          phone: phone,
          token: otpValue,
          type: "sms",
        });

        if (error) {
          console.error("Phone OTP verification error:", error);

          if (error.message.includes("expired")) {
            setError(
              "Verification code has expired. Please request a new one."
            );
            setShowOtpInput(false);
            setOtpValue("");
          } else if (error.message.includes("invalid")) {
            setError("Invalid verification code. Please check and try again.");
            setOtpValue("");
          } else {
            setError(error.message);
          }

          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          console.log("Phone verification successful:", data.user);
          router.push("/dashboard");
        }
      } else {
        console.log("Verifying email OTP for:", email);

        const { data, error } = await supabase.auth.verifyOtp({
          email: email,
          token: otpValue,
          type: "email",
        });

        if (error) {
          console.error("Email OTP verification error:", error);

          if (error.message.includes("expired")) {
            setError(
              "Verification code has expired. Please request a new one."
            );
            setShowOtpInput(false);
            setOtpValue("");
          } else if (error.message.includes("invalid")) {
            setError("Invalid verification code. Please check and try again.");
            setOtpValue("");
          } else {
            setError(error.message);
          }

          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          console.log("Email verification successful:", data.user);
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // const handleResendOtp = async () => {
  //   setOtpValue('')
  //   setError(null)
  //   await handleSendOtp(new Event('submit') as any)
  // }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleNetwork />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center w-full p-6 md:p-8">
        <div
          className={cn(
            "flex flex-col gap-6 w-full max-w-md backdrop-blur-xl bg-background/80 rounded-2xl shadow-2xl border border-white/10",
            className
          )}
          {...props}
        >
          <div className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex flex-row items-center gap-2 mb-2">
                  <Logo />
                  <h1 className="text-2xl font-bold">insightAI</h1>
                </div>
                <p className="text-muted-foreground text-sm text-balance">
                  Create your account and start growing
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant={signUpMethod === "email" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => {
                    setSignUpMethod("email");
                    setShowOtpInput(false);
                    setOtpValue("");
                    setError(null);
                  }}
                  disabled={showOtpInput}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={signUpMethod === "phone" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => {
                    setSignUpMethod("phone");
                    setShowOtpInput(false);
                    setOtpValue("");
                    setError(null);
                  }}
                  disabled={showOtpInput}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </Button>
              </div>

              <div
                className={`transition-all duration-300 ${
                  showOtpInput ? "opacity-50" : "opacity-100"
                }`}
              >
                {signUpMethod === "email" ? (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={showOtpInput}
                      required
                    />
                  </Field>
                ) : (
                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="555-555-5555"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={showOtpInput}
                      required
                    />
                  </Field>
                )}
              </div>

              {!showOtpInput && (
                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={handleSendOtp}
                    disabled={
                      isSubmitting ||
                      (signUpMethod === "email" ? !email : !phone)
                    }
                  >
                    {isSubmitting ? "Sending..." : "Send verification code"}
                  </Button>
                </Field>
              )}

              <div
                className={`transition-all duration-500 ease-in-out transform ${
                  showOtpInput
                    ? "max-h-96 opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-4 overflow-hidden"
                }`}
              >
                <div className="rounded-lg">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Enter the code sent to{" "}
                    {signUpMethod === "email" ? email : phone}
                  </p>

                  <div className="flex justify-center my-4">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={setOtpValue}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    className="w-full mt-2"
                    onClick={handleVerifyOtp}
                    disabled={otpValue.length !== 6 || isSubmitting}
                  >
                    {isSubmitting ? "Verifying..." : "Verify code"}
                  </Button>

                  <div className="flex justify-center items-center mt-4">
                    <Button
                      variant="link"
                      className="text-sm text-muted-foreground cursor-pointer"
                      onClick={() => {
                        setShowOtpInput(false);
                        setOtpValue("");
                        setError(null);
                      }}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </div>

              {/* {!showOtpInput && (
                <>
                  <FieldSeparator>Or continue with</FieldSeparator>
                  <Field className='grid grid-cols-3 gap-4'>
                    <Button variant='outline' type='button' disabled>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                      >
                        <path
                          d='M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701'
                          fill='currentColor'
                        />
                      </svg>
                      <span className='sr-only'>Sign up with Apple</span>
                    </Button>
                    <Button variant='outline' type='button'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                      >
                        <path
                          d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                          fill='currentColor'
                        />
                      </svg>
                      <span className='sr-only'>Sign up with Google</span>
                    </Button>
                    <Button variant='outline' type='button' disabled>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                      >
                        <path
                          d='M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z'
                          fill='currentColor'
                        />
                      </svg>
                      <span className='sr-only'>Sign up with Meta</span>
                    </Button>
                  </Field>
                </>
              )} */}
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  href="#"
                  className="underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLoginModal(true);
                  }}
                >
                  Log in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </div>
          <FieldDescription className="text-center px-6 pb-6">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                router.push("/terms-of-service");
              }}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                router.push("/privacy-policy");
              }}
            >
              Privacy Policy
            </a>
            .
          </FieldDescription>
          <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
        </div>
      </div>
    </div>
  );
};
