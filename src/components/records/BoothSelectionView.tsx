"use client";

import {
  Container,
  Stack,
  Title,
  Text,
  Center,
  SimpleGrid,
  Paper,
  Group,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { MapPinIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import type { PollingStation, EntryMode } from "@/types";
import styles from "./styles.module.css";

interface BoothSelectionViewProps {
  pollingStations: PollingStation[];
  entryMode: EntryMode;
  onStationSelect: (station: PollingStation) => void;
}

export function BoothSelectionView({
  pollingStations,
  entryMode,
  onStationSelect,
}: BoothSelectionViewProps) {
  const isEn = entryMode === "english";
  return (
    <Container size="md" py="lg">
      <Stack gap="lg">
        <Box py="xl">
          <Text size="xl" ta="center" fw={800}>
            {isEn ? "Select Polling Booth" : "मतदान केन्द्र छान्नुहोस्"}
          </Text>
          <Text c="dimmed" size="sm" ta="center">
            {isEn
              ? "Choose a booth to view and edit voter records"
              : "मतदाता विवरण हेर्न र सम्पादन गर्न केन्द्र छान्नुहोस्"}
          </Text>
        </Box>

        {pollingStations.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed">
              {isEn
                ? "No polling stations assigned to you."
                : "तपाईंलाई कुनै मतदान केन्द्र तोकिएको छैन।"}
            </Text>
          </Center>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xs">
            {pollingStations.map((station) => (
              <Paper
                key={station.id}
                withBorder
                radius="xs"
                p="lg"
                onClick={() => onStationSelect(station)}
                style={{ cursor: "pointer" }}
                className={styles.hoverCard}
              >
                <ThemeIcon size="md" variant="light" mb="xl">
                  <MapPinIcon weight="fill" />
                </ThemeIcon>

                <Stack gap={4}>
                  <Text fw={800} size="sm">
                    {isEn
                      ? station.place_name_en || station.place_name
                      : station.place_name_ne || station.place_name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {isEn
                      ? station.ward_name_en || station.ward_name || ""
                      : station.ward_name_ne || station.ward_name || ""}
                    {station.local_body_name
                      ? ` · ${
                          isEn
                            ? station.local_body_name_en ||
                              station.local_body_name
                            : station.local_body_name_ne ||
                              station.local_body_name
                        }`
                      : ""}
                    {station.district_name
                      ? `, ${
                          isEn
                            ? station.district_name_en ||
                              station.district_name
                            : station.district_name_ne ||
                              station.district_name
                        }`
                      : ""}
                  </Text>
                  <Group mt="md">
                    <ArrowUpRightIcon />
                  </Group>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
