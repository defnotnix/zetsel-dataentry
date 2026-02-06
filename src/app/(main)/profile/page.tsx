"use client";

import {
  Paper,
  Stack,
  Text,
  Group,
  Avatar,
  Badge,
  Divider,
} from "@mantine/core";
import {
  UserCircle,
  GlobeHemisphereWest,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores/authStore";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function ProfilePage() {
  const { user, selectedPollingStation } = useAuthStore();

  return (
    <PageWrapper title="Profile & Settings">
      <Stack gap="lg">
        {/* User Info */}
        <Paper withBorder p="lg" radius="md">
          <Group>
            <Avatar size={64} radius="xl" color="blue">
              <UserCircle size={40} />
            </Avatar>
            <Stack gap={4}>
              <Text fw={600} size="lg">
                {user?.first_name} {user?.last_name}
              </Text>
              <Text c="dimmed" size="sm">
                @{user?.username}
              </Text>
              {user?.email && (
                <Text c="dimmed" size="sm">
                  {user.email}
                </Text>
              )}
            </Stack>
          </Group>

          {user?.permissions && user.permissions.length > 0 && (
            <>
              <Divider my="md" />
              <Stack gap="xs">
                <Group gap="sm">
                  <ShieldCheck size={18} />
                  <Text fw={600} size="sm">
                    Permissions
                  </Text>
                </Group>
                <Group gap="xs">
                  {user.permissions.map((permission) => (
                    <Badge key={permission} size="sm" variant="light">
                      {permission}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            </>
          )}
        </Paper>

        {/* Current Selection */}
        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group gap="sm">
              <GlobeHemisphereWest size={22} />
              <Text fw={600}>Current Selection</Text>
            </Group>

            <Group>
              <Text size="sm" c="dimmed" w={120}>
                Polling Station:
              </Text>
              <Text size="sm">
                {selectedPollingStation
                  ? selectedPollingStation.place_name
                  : "Not selected"}
              </Text>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </PageWrapper>
  );
}
