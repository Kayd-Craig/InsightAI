"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionComplete: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro">("basic");
  const [loading, setLoading] = useState(false);

  const plans = {
    basic: {
      name: "Basic Plan",
      price: "$9.99",
      period: "month",
      features: [
        "Connect up to 2 social accounts",
        "Basic analytics dashboard",
        "AI insights and recommendations",
        "Email support",
      ],
    },
    pro: {
      name: "Pro Plan",
      price: "$19.99",
      period: "month",
      features: [
        "Connect unlimited social accounts",
        "Advanced analytics dashboard",
        "Premium AI insights",
        "Custom reporting",
        "Priority support",
        "API access",
      ],
    },
  };

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start checkout process. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 border-b dark:border-gray-700">
          <DialogTitle className="text-2xl font-bold">
            Unlock Premium Features
          </DialogTitle>
          <DialogDescription>
            Choose a plan to connect your social media accounts and access
            advanced analytics
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(plans).map(([planKey, plan]) => (
              <div
                key={planKey}
                className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedPlan === planKey
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedPlan(planKey as "basic" | "pro")}
              >
                {planKey === "pro" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedPlan === planKey
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {selectedPlan === planKey && (
                      <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{plan.period}
                  </span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row justify-between items-center p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div>
            <Button onClick={handleSubscribe} disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                `Subscribe to ${plans[selectedPlan].name}`
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
