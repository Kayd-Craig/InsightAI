"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/store";
import { IconLink, IconCheck } from "@tabler/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faXTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IntegrationsModal } from "@/app/components/IntegrationsModal";
import PaymentModal from "@/app/components/PaymentModal";
import SubscriptionManagement from "@/app/components/SubscriptionManagement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { subscriptionService } from "@/lib/subscriptionService";

export default function SettingsPage() {
  // Get data and state from Zustand store
  const { socialIntegrations, isLoading, isInitialized, error, initializeApp } =
    useAppStore();

  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);

  // Initialize app if not already initialized
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeApp();
    }
  }, [isInitialized]);

  // Check subscription status on component mount
  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    setCheckingSubscription(true);
    try {
      const { isSubscribed: subscribed } =
        await subscriptionService.checkSubscription();
      setIsSubscribed(subscribed);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsSubscribed(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleManageIntegrations = () => {
    if (!isSubscribed) {
      setIsPaymentModalOpen(true);
    } else {
      setIsIntegrationsModalOpen(true);
    }
  };

  const handleSubscriptionComplete = () => {
    setIsSubscribed(true);
    setIsIntegrationsModalOpen(true);
  };

  // Handle OAuth callback success messages and subscription success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const subscription = params.get("subscription");
    const sessionId = params.get("session_id");

    if (success === "facebook_connected" || success === "instagram_connected") {
      window.history.replaceState({}, "", "/settings");
    } else if (success === "true" && subscription === "created") {
      // Subscription was successfully created
      console.log(
        "Subscription created successfully, refreshing subscription status..."
      );

      // Store session ID for webhook simulation if needed
      if (sessionId) {
        setLastSessionId(sessionId);
        console.log("Stored session ID for webhook simulation:", sessionId);
      }

      checkSubscriptionStatus();
      // Show success message and open integrations modal after a short delay
      setTimeout(() => {
        setIsIntegrationsModalOpen(true);
      }, 1000);
      // Clean up URL
      window.history.replaceState({}, "", "/settings");
    }
  }, []);

  const socialPlatforms = [
    {
      key: "instagram",
      label: "Instagram",
      icon: faInstagram,
    },
    {
      key: "twitter",
      label: "X",
      icon: faXTwitter,
    },
    {
      key: "tiktok",
      label: "TikTok",
      icon: faTiktok,
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: faFacebook,
    },
  ];

  const getPlatformConfig = (platform: string) => {
    return socialPlatforms.find((p) => p.key === platform.toLowerCase());
  };

  if (isLoading && !isInitialized) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader page="Settings" />
          <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading settings...
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader page="Settings" />
          <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <Button onClick={initializeApp} variant="default">
                Retry
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader page="Settings" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col p-4">
              <div className="flex items-center justify-between">
                {process.env.NODE_ENV === "development" && lastSessionId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 border-blue-200 text-blue-700"
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          "/api/test/simulate-webhook",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              sessionId: lastSessionId,
                            }),
                          }
                        );
                        const result = await response.json();
                        if (result.success) {
                          console.log("Webhook simulated:", result);
                          alert(
                            "✅ Webhook simulated successfully! Subscription created."
                          );
                          checkSubscriptionStatus();
                          setLastSessionId(null); // Clear after use
                        } else {
                          console.error("Failed to simulate webhook:", result);
                          alert(
                            "❌ Failed to simulate webhook: " + result.error
                          );
                        }
                      } catch (error) {
                        console.error("Error simulating webhook:", error);
                        alert("❌ Error simulating webhook");
                      }
                    }}
                  >
                    🔄 Simulate Webhook for Last Payment
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-black rounded-lg">
                          <IconLink className="w-6 h-6 text-green-300 dark:text-gray-300" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">
                            Integrations
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Connect your social media accounts
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleManageIntegrations}
                        disabled={checkingSubscription}
                        className="bg-black text-white hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-black"
                      >
                        {checkingSubscription ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </div>
                        ) : (
                          "Manage/Add"
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {socialIntegrations.length > 0 ? (
                        socialIntegrations.map((integration) => {
                          const platformConfig = getPlatformConfig(
                            integration.platform
                          );
                          return (
                            <div
                              key={integration.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600/30 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                {platformConfig && (
                                  <FontAwesomeIcon
                                    icon={platformConfig.icon}
                                    className={`text-xl white`}
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium capitalize">
                                  {integration.platform}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {integration.platform_username}
                                </p>
                              </div>
                              <IconCheck className="w-5 h-5 text-green-600" />
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                          No integrations connected yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <SubscriptionManagement
                  isSubscribed={isSubscribed}
                  onSubscriptionChange={checkSubscriptionStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <IntegrationsModal
        open={isIntegrationsModalOpen}
        onOpenChange={setIsIntegrationsModalOpen}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubscriptionComplete={handleSubscriptionComplete}
      />
    </SidebarProvider>
  );
}
