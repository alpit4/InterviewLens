"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSyncTrigger() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      // Small delay to ensure Clerk is fully ready
      const timeout = setTimeout(() => {
        fetch("/api/user/sync", { method: "POST" })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              console.log("User synced with database");
            }
          })
          .catch((err) => console.error("Auto-sync failed:", err));
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isSignedIn, user]);

  return null;
}
