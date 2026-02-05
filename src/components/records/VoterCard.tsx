"use client";

import { Card, Group, Text, Badge, Stack, Box } from "@mantine/core";
import {
  Phone,
  IdentificationCard,
  Users,
  Briefcase,
} from "@phosphor-icons/react";
import type { VoterRollEntry } from "@/types";
import { useAuthStore } from "@/stores/authStore";

interface VoterCardProps {
  voter: VoterRollEntry;
  onClick: () => void;
}

export function VoterCard({ voter, onClick }: VoterCardProps) {
  const { entryMode } = useAuthStore();
  const isNepali = entryMode === "nepali";
  const extra = voter.extra;

  const displayName = isNepali ? voter.name_ne : voter.name_en;
  const gender = isNepali ? voter.gender_ne : voter.gender_en;

  const father = isNepali ? voter.father_name_ne : voter.father_name_en;
  const mother = isNepali ? voter.mother_name_ne : voter.mother_name_en;
  const spouse = isNepali ? voter.spouse_name_ne : voter.spouse_name_en;

  const occupation = isNepali ? extra?.occupation : extra?.occupation_en;

  const hasExtra = !!(
    extra?.phone_number ||
    extra?.occupation ||
    extra?.occupation_en ||
    extra?.address_raw ||
    extra?.address_en
  );

  return (
    <Box onClick={onClick} className="hover:shadow-md transition-shadow">
      <Stack gap={6}>
        {/* Top row: Name + badges */}
        <Group justify="space-between" wrap="nowrap">
          <Text fw={600} size="sm" truncate>
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
              {spouse ? `${isNepali ? "पति/पत्नी" : "Spouse"}: ${spouse}` : ""}
              {spouse && father ? " · " : ""}
              {father ? `${isNepali ? "बुबा" : "F"}: ${father}` : ""}
              {(spouse || father) && mother ? " · " : ""}
              {mother ? `${isNepali ? "आमा" : "M"}: ${mother}` : ""}
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
    </Box>
  );
}
