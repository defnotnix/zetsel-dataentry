"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Center, Loader } from "@mantine/core";
import { useAuthStore } from "@/stores/authStore";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const hasToken = Cookies.get("access_token");
    if (isAuthenticated || hasToken) {
      router.replace("/records");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <Center style={{ minHeight: "100vh" }}>
      <Loader size="lg" />
    </Center>
  );
}
