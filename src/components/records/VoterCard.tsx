"use client";

import { Card, Group, Text, Badge, Stack, Box, Paper } from "@mantine/core";
import {
  Phone,
  IdentificationCard,
  Users,
  Briefcase,
} from "@phosphor-icons/react";
import type { VoterRollEntry } from "@/types";
import styles from "./styles.module.css";

interface VoterCardProps {
  voter: VoterRollEntry;
  onClick: () => void;
}

export function VoterCard({ voter, onClick }: VoterCardProps) {
  const extra = voter.extra;

  // Always use Nepali variant for display
  const displayName = voter.name_ne;
  const gender = voter.gender_ne;

  const father = voter.father_name_ne;
  const mother = voter.mother_name_ne;
  const spouse = voter.spouse_name_ne;

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
          <Text fw={800} size="sm" truncate>
            {displayName}
          </Text>
          <Group gap={4} wrap="nowrap">
            {hasExtra && (
              <Badge size="xs" color="green" variant="light">
                Filled
              </Badge>
            )}
            <Badge size="xs" variant="light" color="gray">
              {voter.age}yr · {gender}
            </Badge>
          </Group>
        </Group>

        {/* ID row */}
        <Group gap="xs">
          <IdentificationCard size={14} weight="bold" />
          <Text size="xs" c="dimmed">
            #{voter.serial_no} · {voter.voter_no}
          </Text>
        </Group>

        {/* Family row */}
        {(father || mother || spouse) && (
          <Group gap="xs" wrap="nowrap">
            <Users size={14} style={{ flexShrink: 0 }} />
            <Text size="xs" c="dimmed" truncate>
              {spouse ? `पति/पत्नी: ${spouse}` : ""}
              {spouse && father ? " · " : ""}
              {father ? `बुबा: ${father}` : ""}
              {(spouse || father) && mother ? " · " : ""}
              {mother ? `आमा: ${mother}` : ""}
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
