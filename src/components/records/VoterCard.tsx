"use client";

import { Card, Group, Text, Badge, Stack, Box, Paper } from "@mantine/core";
import {
  Phone,
  Users,
  Briefcase,
} from "@phosphor-icons/react";
import type { VoterRollEntry, EntryMode } from "@/types";
import styles from "./styles.module.css";

interface VoterCardProps {
  voter: VoterRollEntry;
  entryMode: EntryMode;
  onClick: () => void;
}

export function VoterCard({ voter, entryMode, onClick }: VoterCardProps) {
  const extra = voter.extra;
  const isEn = entryMode === "english";

  const displayName = isEn ? voter.name_en || voter.name_ne : voter.name_ne;
  const secondaryName = isEn ? voter.name_ne : voter.name_en;
  const isMale =
    voter.gender_en?.toLowerCase() === "male" || voter.gender_ne === "पुरुष";

  const father = isEn
    ? voter.father_name_en || voter.father_name_ne
    : voter.father_name_ne;
  const mother = isEn
    ? voter.mother_name_en || voter.mother_name_ne
    : voter.mother_name_ne;
  const spouse = isEn
    ? voter.spouse_name_en || voter.spouse_name_ne
    : voter.spouse_name_ne;

  const occupation = extra?.occupation_en;

  const hasExtra = !!(
    extra?.phone_number ||
    extra?.occupation_en ||
    extra?.address_en
  );

  return (
    <Paper
      withBorder
      bg="white"
      style={{
        cursor: "pointer",
      }}
      onClick={onClick}
      className={styles.hoverCard}
      p="lg"
    >
      <Stack gap={6}>
        {/* Top row: Name + badges */}
        <Group justify="space-between" wrap="nowrap">
          <Box style={{ minWidth: 0 }}>
            <Text fw={800} size="sm" truncate>
              {displayName}
            </Text>
            {secondaryName && (
              <Text size="xs" c="dimmed" truncate>
                {secondaryName}
              </Text>
            )}
          </Box>
          <Group gap={4} wrap="nowrap">
            {hasExtra && (
              <Badge size="xs" color="green" variant="light">
                Filled
              </Badge>
            )}
            <Badge
              size="xs"
              variant="light"
              color={isMale ? "blue" : "pink"}
            >
              {voter.age} · {isMale ? "M" : "F"}
            </Badge>
          </Group>
        </Group>

        {/* Father / Mother row */}
        {(father || mother) && (
          <Group gap="xs" wrap="nowrap">
            <Users size={14} style={{ flexShrink: 0 }} />
            <Text size="xs" c="dimmed" truncate>
              {father
                ? `${isEn ? "Father" : "बुबा"}: ${father}`
                : ""}
              {father && mother ? " · " : ""}
              {mother
                ? `${isEn ? "Mother" : "आमा"}: ${mother}`
                : ""}
            </Text>
          </Group>
        )}

        {/* Spouse row */}
        {spouse && (
          <Group gap="xs" wrap="nowrap">
            <Users size={14} style={{ flexShrink: 0 }} />
            <Text size="xs" c="dimmed" truncate>
              {`${isEn ? "Spouse" : "पति/पत्नी"}: ${spouse}`}
            </Text>
          </Group>
        )}

        {/* Extra data row */}
        {(extra?.phone_number || occupation) && (
          <Group gap="md">
            {extra?.phone_number && (
              <Group gap={4}>
                <Phone size={14} />
                <Text size="xs" c="dimmed">
                  {extra.phone_number}
                </Text>
              </Group>
            )}
            {occupation && (
              <Group gap={4}>
                <Briefcase size={14} />
                <Text size="xs" c="dimmed">
                  {occupation}
                </Text>
              </Group>
            )}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
