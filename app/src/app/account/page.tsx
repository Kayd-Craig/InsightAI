"use client";

import { useEffect, useState } from "react";
import { IconUser } from "@tabler/icons-react";
import { useAppStore } from "@/stores/store";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProfileModal } from "@/app/components/ProfileModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function AccountPage() {
  // Get data and state from the Zustand store
  const { user, isLoading, isInitialized, error, initializeApp } =
    useAppStore();

  const [showProfileModal, setShowProfileModal] = useState(false);

  // Initialize app if not already initialized
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeApp();
    }
  }, [isInitialized, isLoading, initializeApp]);

  // loading spinner
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
          <SiteHeader page="Account" />
          <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading account...
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // error message
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
          <SiteHeader page="Account" />
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
        <SiteHeader page="Account" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div className="space-y-6">
                <Card className="p-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-black rounded-lg">
                          <IconUser className="w-6 h-6 text-blue-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">Profile</h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Manage your personal information
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowProfileModal(true)}
                        className="bg-black text-white hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-black"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {user && (
                      <div className="space-y-4">
                        {/* Avatar Section */}
                        {user.avatar_url && (
                          <div className="flex justify-center md:justify-start mb-4">
                            <Image
                              src={user.avatar_url}
                              alt="Profile picture"
                              width={96}
                              height={96}
                              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        )}

                        {/* User Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 dark:bg-gray-600/30 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              First Name
                            </p>
                            <p className="font-medium">
                              {user.first_name || "Not set"}
                            </p>
                          </div>

                          <div className="p-3 bg-gray-50 dark:bg-gray-600/30 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              Last Name
                            </p>
                            <p className="font-medium">
                              {user.last_name || "Not set"}
                            </p>
                          </div>

                          <div className="p-3 bg-gray-50 dark:bg-gray-600/30 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              Phone Number
                            </p>
                            <p
                              className={`font-medium ${
                                !user.phone
                                  ? "text-gray-400 dark:text-gray-500"
                                  : ""
                              }`}
                            >
                              {user.phone || "None"}
                            </p>
                          </div>

                          <div className="p-3 bg-gray-50 dark:bg-gray-600/30 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              Email
                            </p>
                            <p
                              className={`font-medium ${
                                !user.email
                                  ? "text-gray-400 dark:text-gray-500"
                                  : ""
                              }`}
                            >
                              {user.email || "None"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Profile Modal */}
      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
    </SidebarProvider>
  );
}
