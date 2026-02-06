"use client";

import { useState } from "react";
import {
  Container,
  Stack,
  Paper,
  Group,
  Text,
  Badge,
  TextInput,
  ActionIcon,
  Center,
  Loader,
  SimpleGrid,
  Box,
  Divider,
} from "@mantine/core";
import { MagnifyingGlassIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import type { VoterRollEntry, PollingStation, EntryMode } from "@/types";
import { VoterCard } from "./VoterCard";

interface VoterRecordsViewProps {
  pollingStation: PollingStation;
  voters: VoterRollEntry[];
  totalCount: number;
  entryMode: EntryMode;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  search: string;
  debouncedSearch: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
  onVoterClick: (voter: VoterRollEntry) => void;
  lastElementRef?: (node: HTMLDivElement | null) => void;
}

export function VoterRecordsView({
  pollingStation,
  voters,
  totalCount,
  entryMode,
  isLoading,
  isError,
  isFetchingNextPage,
  search,
  debouncedSearch,
  onSearchChange,
  onBack,
  onVoterClick,
  lastElementRef,
}: VoterRecordsViewProps) {
  const isEn = entryMode === "english";

  const stationName = isEn
    ? pollingStation.place_name_en || pollingStation.place_name
    : pollingStation.place_name_ne || pollingStation.place_name;

  const wardLabel = isEn
    ? pollingStation.ward_name_en || pollingStation.ward_name || ""
    : pollingStation.ward_name_ne || pollingStation.ward_name || "";

  return (
    <Stack gap="md">
      {/* Sticky Header */}
      <Paper
        pt="xl"
        bg="gray.0"
        radius="md"
        style={{
          position: "sticky",
          top: 60,
          zIndex: 10,
        }}
      >
        <Container mb="xl">
          <Stack gap="sm">
            <Group justify="space-between">
              <Group gap="sm">
                <ActionIcon variant="subtle" onClick={onBack}>
                  <ArrowLeftIcon size={20} />
                </ActionIcon>
                <div>
                  <Text fw={600} size="sm">
                    {stationName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {pollingStation.station_code}
                    {wardLabel ? ` · ${wardLabel}` : ""}
                  </Text>
                </div>
              </Group>
              <Group gap="xs">
                <Badge
                  variant="light"
                  color={entryMode === "nepali" ? "orange" : "blue"}
                >
                  {entryMode === "nepali" ? "नेपाली" : "EN"}
                </Badge>
                {totalCount > 0 && (
                  <Badge variant="light" color="gray">
                    {totalCount} {isEn ? "voters" : "मतदाता"}
                  </Badge>
                )}
              </Group>
            </Group>

            <TextInput
              placeholder={
                isEn
                  ? "Search by name or voter ID..."
                  : "नाम वा मतदाता नं. खोज्नुहोस्..."
              }
              leftSection={<MagnifyingGlassIcon size={18} />}
              value={search}
              onChange={(e) => onSearchChange(e.currentTarget.value)}
            />
          </Stack>
        </Container>

        <Divider />
      </Paper>

      {/* Content */}
      {isLoading ? (
        <Center py="xl">
          <Loader size="lg" />
        </Center>
      ) : isError ? (
        <Center py="xl">
          <Text c="red">
            {isEn
              ? "Failed to load voter records. Please try again."
              : "मतदाता विवरण लोड गर्न असफल। पुन: प्रयास गर्नुहोस्।"}
          </Text>
        </Center>
      ) : voters.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed">
            {debouncedSearch
              ? isEn
                ? "No voters found matching your search"
                : "खोजसँग मिल्ने मतदाता भेटिएन"
              : isEn
                ? "No voter records available"
                : "मतदाता विवरण उपलब्ध छैन"}
          </Text>
        </Center>
      ) : (
        <>
          <div>
            <Container>
              <SimpleGrid
                spacing={4}
                cols={{
                  xs: 1,
                  md: 2,
                  lg: 2,
                }}
              >
                {voters.map((voter, index) => {
                  const isLast = index === voters.length - 1;
                  return (
                    <VoterCard
                      key={voter.id}
                      voter={voter}
                      entryMode={entryMode}
                      onClick={() => onVoterClick(voter)}
                    />
                  );
                })}
              </SimpleGrid>
            </Container>
          </div>

          {isFetchingNextPage && (
            <Center py="md">
              <Loader size="sm" />
            </Center>
          )}
        </>
      )}
    </Stack>
  );
}
