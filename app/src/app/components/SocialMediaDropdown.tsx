import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  faInstagram,
  faTiktok,
  faXTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SocialMediaDropdown = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (arg0: string) => void;
}) => {
  const socialPlatforms = [
    { key: "instagram", label: "Instagram", icon: faInstagram },
    { key: "twitter", label: "X", icon: faXTwitter },
    { key: "tiktok", label: "TikTok", icon: faTiktok },
    { key: "facebook", label: "Facebook", icon: faFacebook },
  ];

  const currentPlatform = socialPlatforms.find(
    (platform) => platform.key === activeTab
  );

  return (
    <div className="flex justify-between items-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-between items-center space-x-2 px-4 py-2 text-white w-40">
          <FontAwesomeIcon icon={currentPlatform!.icon} />
          <span>{currentPlatform?.label || "Select Platform"}</span>
          <ChevronDown className="relative h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {socialPlatforms.map((platform) => (
            <DropdownMenuItem
              key={platform.key}
              onClick={() => setActiveTab(platform.key)}
              className={`w-full cursor-pointer flex items-center space-x-2 text-right${
                activeTab === platform.key ? "bg-gray-200" : ""
              }`}
            >
              <FontAwesomeIcon icon={platform.icon} />
              <span>{platform.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SocialMediaDropdown;
