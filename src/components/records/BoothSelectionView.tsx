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
import type { PollingStation } from "@/types";
import styles from "./styles.module.css";

interface BoothSelectionViewProps {
  pollingStations: PollingStation[];
  onStationSelect: (station: PollingStation) => void;
}

export function BoothSelectionView({
  pollingStations,
  onStationSelect,
}: BoothSelectionViewProps) {
  return (
    <Container size="md" py="lg">
      <Stack gap="lg">
        <Box py="xl">
          <Text size="xl" ta="center" fw={800}>
            Select Polling Booth
          </Text>
          <Text c="dimmed" size="sm" ta="center">
            Choose a booth to view and edit voter records
          </Text>
        </Box>

        {pollingStations.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed">No polling stations assigned to you.</Text>
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
                    {station.place_name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {station.ward_id ? `Ward ${station.ward_id}` : ""}
                    {station.place_name ? ` · ${station.place_name}` : ""}
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
