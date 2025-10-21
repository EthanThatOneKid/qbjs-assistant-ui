import * as React from "react";
import { Github, Key } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Button } from "@/components/ui/button";

export function ThreadListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const handleApiKeyInput = () => {
    const currentKey = localStorage.getItem("google-ai-api-key");
    const message = currentKey
      ? `Current API key: ${currentKey.substring(
          0,
          8,
        )}...\n\nEnter your Google AI API key:\n\nGet your key at: https://aistudio.google.com/app/api-keys`
      : `Enter your Google AI API key:\n\nGet your key at: https://aistudio.google.com/app/api-keys`;

    const newKey = prompt(message);

    if (newKey !== null) {
      if (newKey.trim() === "") {
        localStorage.removeItem("google-ai-api-key");
        alert("API key removed from localStorage");
      } else {
        localStorage.setItem("google-ai-api-key", newKey.trim());
        alert("API key saved to localStorage");
      }
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="aui-sidebar-header mb-2 border-b">
        <div className="aui-sidebar-header-content flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link
                  href="https://qbjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="aui-sidebar-header-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <img
                      src="https://qbjs.org/favicon.ico"
                      alt="QBJS"
                      className="aui-sidebar-header-icon size-4"
                    />
                  </div>
                  <div className="aui-sidebar-header-heading mr-6 flex flex-col gap-0.5 leading-none">
                    <span className="aui-sidebar-header-title font-semibold">
                      QBJS
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>
      <SidebarContent className="aui-sidebar-content px-2">
        <ThreadList />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="aui-sidebar-footer border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleApiKeyInput}
              className="w-full justify-start gap-2"
            >
              <Key className="size-4" />
              <span>API Key</span>
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="https://github.com/EthanThatOneKid/qbjs-assistant-ui"
                target="_blank"
              >
                <div className="aui-sidebar-footer-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Github className="aui-sidebar-footer-icon size-4" />
                </div>
                <div className="aui-sidebar-footer-heading flex flex-col gap-0.5 leading-none">
                  <span className="aui-sidebar-footer-title font-semibold">
                    GitHub
                  </span>
                  <span>View Source</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
