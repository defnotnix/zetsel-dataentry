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
  Stack,
  Badge,
} from "@mantine/core";
import {
  UserCircleIcon,
  SignOutIcon,
  CaretDownIcon,
  BellIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores/authStore";
import type { EntryMode } from "@/types";
import { logout } from "@/services/auth";
import Cookies from "js-cookie";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, reset, entryMode, setEntryMode } =
    useAuthStore();
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
      <AppShell.Header bg="gray.0">
        <Container size="md" h="100%">
          <Group h="100%" justify="space-between">
            <UnstyledButton onClick={() => router.push("/records")}>
              <Group gap="xs">
                <ThemeIcon size="sm" color="blue">
                  <BellIcon weight="fill" />
                </ThemeIcon>
                <Text size="xs" fw={600}>
                  RSP App
                  <Text component="span" size="xs" fw={600} visibleFrom="sm">
                    {" "}| Data-Entry Portal
                  </Text>
                </Text>
              </Group>
            </UnstyledButton>

            <Group gap="sm">
              <UnstyledButton
                onClick={() =>
                  setEntryMode(entryMode === "nepali" ? "english" : "nepali")
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--mantine-color-gray-3)",
                }}
              >
                <TranslateIcon size={16} />
                <Text size="xs" fw={600}>
                  {entryMode === "nepali" ? "NE" : "EN"}
                </Text>
              </UnstyledButton>
              <Menu shadow="md" width={220} position="bottom-end">
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap="sm">
                      <Avatar color="blue" radius="xl" size="md">
                        {userInitials}
                      </Avatar>
                      <Stack gap={0} visibleFrom="sm">
                        <Text size="sm" fw={600}>
                          {user?.first_name} {user?.last_name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {user?.username}
                        </Text>
                      </Stack>
                      <CaretDownIcon size={14} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <Stack gap={2}>
                      <Text size="sm" fw={600}>
                        {user?.first_name} {user?.last_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        @{user?.username}
                      </Text>
                      {user?.email && (
                        <Text size="xs" c="dimmed">
                          {user.email}
                        </Text>
                      )}
                    </Stack>
                  </Menu.Label>
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
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main bg="gray.0">{children}</AppShell.Main>
    </AppShell>
  );
}
