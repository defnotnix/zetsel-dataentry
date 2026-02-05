"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppShell,
  Group,
  Text,
  Loader,
  Center,
  Container,
  Menu,
  Avatar,
  UnstyledButton,
  rem,
  ThemeIcon,
} from "@mantine/core";
import {
  UserCircleIcon,
  SignOutIcon,
  CaretDownIcon,
  PlanetIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/services/auth";
import Cookies from "js-cookie";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, reset } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && !Cookies.get("access_token")) {
      router.replace("/login");
    }
  }, [mounted, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    reset();
    router.replace("/login");
  };

  if (!mounted || !isAuthenticated) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  const userInitials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : "U";

  return (
    <AppShell header={{ height: 60 }} padding={0}>
      <AppShell.Header bg="none">
        <Container size="md" h="100%">
          <Group h="100%" justify="space-between">
            <Group gap="xs">
              <ThemeIcon size="sm" color="black">
                <PlanetIcon weight="fill" />
              </ThemeIcon>
              <Text size="xs" fw={600}>
                RSP App | Data-Entry Portal
              </Text>
            </Group>

            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar color="blue" radius="xl" size="sm">
                      {userInitials}
                    </Avatar>
                    <Text size="sm" fw={500}>
                      {user?.first_name} {user?.last_name}
                    </Text>
                    <CaretDownIcon size={12} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                  leftSection={<UserCircleIcon size={16} />}
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<SignOutIcon size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main bg="gray.0">{children}</AppShell.Main>
    </AppShell>
  );
}
