"use client";
import React, { useState } from "react";

import ChangePasswordContainer from "./changepassword/ChangePasswordContainer";

import { Button } from "@/components/ui/button";
import ClientDetails from "./detailsChange/ClientDetails";
import UserSidebar from "./common/UserSidebar";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  return (
    <main className="bg-[#0000001F] min-h-screen">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex gap-3 mb-5">
              <Button
                variant={activeTab === "Profile" ? "default" : "outline"}
                className={
                  activeTab === "Profile"
                    ? "bg-[#65A30D] cursor-pointer hover:bg-[#5a920c]"
                    : "cursor-pointer"
                }
                onClick={() => setActiveTab("Profile")}
              >
                Profile
              </Button>
              <Button
                variant={activeTab === "Password" ? "default" : "outline"}
                className={
                  activeTab === "Password"
                    ? "bg-[#65A30D] cursor-pointer hover:bg-[#5a920c]"
                    : "cursor-pointer"
                }
                onClick={() => setActiveTab("Password")}
              >
                Password
              </Button>
            </div>
            {activeTab === "Profile" && <ClientDetails />}
            {activeTab === "Password" && <ChangePasswordContainer />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
