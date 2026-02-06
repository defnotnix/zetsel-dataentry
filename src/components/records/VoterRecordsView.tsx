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
                    {pollingStation.place_name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {pollingStation.station_code}
                    {pollingStation.ward_id
                      ? ` · Ward ${pollingStation.ward_id}`
                      : ""}
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
                    {totalCount} voters
                  </Badge>
                )}
              </Group>
            </Group>

            <TextInput
              placeholder="Search by name or voter ID..."
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
          <Text c="red">Failed to load voter records. Please try again.</Text>
        </Center>
      ) : voters.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed">
            {debouncedSearch
              ? "No voters found matching your search"
              : "No voter records available"}
          </Text>
        </Center>
      ) : (
        <Stack gap="sm">
          <Container size="md">
            <SimpleGrid
              spacing={4}
              cols={{
                xs: 1,
                md: 2,
                lg: 3,
              }}
            >
              {voters.map((voter, index) => {
                const isLast = index === voters.length - 1;
                return (
                  <VoterCard
                    key={voter.id}
                    voter={voter}
                    onClick={() => onVoterClick(voter)}
                  />
                );
              })}
            </SimpleGrid>
          </Container>

          {isFetchingNextPage && (
            <Center py="md">
              <Loader size="sm" />
            </Center>
          )}
        </Stack>
      )}
    </Stack>
  );
}
