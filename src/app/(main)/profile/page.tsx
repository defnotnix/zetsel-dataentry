"use client";

import {
  Paper,
  Stack,
  Text,
  SegmentedControl,
  Group,
  Avatar,
  Badge,
  Card,
} from "@mantine/core";
import {
  UserCircle,
  Translate,
  GlobeHemisphereWest,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores/authStore";
import type { EntryMode } from "@/types";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function ProfilePage() {
  const { user, entryMode, setEntryMode, selectedPollingStation } =
    useAuthStore();

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
        </Paper>

        {/* Entry Mode Toggle */}
        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group gap="sm">
              <Translate size={22} />
              <Text fw={600}>Data Entry Mode</Text>
            </Group>

            <Text size="sm" c="dimmed">
              Switch between Nepali and English data entry modes. This controls
              which backend fields your entries are saved to.
            </Text>

            <SegmentedControl
              fullWidth
              value={entryMode}
              onChange={(val) => setEntryMode(val as EntryMode)}
              data={[
                { label: "नेपाली Mode", value: "nepali" },
                { label: "English Mode", value: "english" },
              ]}
            />

            <Card withBorder radius="sm" p="sm" bg="gray.0">
              <Text size="xs" c="dimmed" component="div">
                {entryMode === "nepali" ? (
                  <>
                    <Badge size="xs" color="orange" mr={4}>
                      NP
                    </Badge>
                    Saving to: address_raw, occupation, education, religion,
                    living_address
                  </>
                ) : (
                  <>
                    <Badge size="xs" color="blue" mr={4}>
                      EN
                    </Badge>
                    Saving to: address_en, occupation_en, education_en,
                    religion_en, living_address_en
                  </>
                )}
              </Text>
            </Card>
          </Stack>
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
