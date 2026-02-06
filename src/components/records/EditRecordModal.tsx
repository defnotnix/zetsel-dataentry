"use client";

import {
  Modal,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  Stack,
  Text,
  Badge,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FloppyDisk } from "@phosphor-icons/react";
import { saveVoterExtra } from "@/services/elections";
import type { VoterRollEntry, VoterUpdatePayload } from "@/types";
import {
  OCCUPATION_OPTIONS,
  RELIGION_OPTIONS,
  POLITICAL_AFFILIATION_OPTIONS,
} from "@/types";
import { useEffect } from "react";

interface EditRecordModalProps {
  voter: VoterRollEntry | null;
  opened: boolean;
  onClose: () => void;
}

export function EditRecordModal({
  voter,
  opened,
  onClose,
}: EditRecordModalProps) {
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      phone_number: "",
      address: "",
      occupation: "",
      education: "",
      religion: "",
      political_affiliation: "",
      remarks: "",
    },
  });

  // Reset form when voter changes
  useEffect(() => {
    if (voter && opened) {
      const extra = voter.extra;
      form.setValues({
        phone_number: extra?.phone_number || "",
        address: extra?.address_en || "",
        occupation: extra?.occupation_en || "",
        education: extra?.education_en || "",
        religion: extra?.religion_en || "",
        political_affiliation: extra?.political_affiliation_en || "",
        remarks: extra?.remarks || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voter, opened]);

  const mutation = useMutation({
    mutationFn: (payload: VoterUpdatePayload) =>
      saveVoterExtra(voter!.id, voter!.extra?.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voters"] });
      notifications.show({
        title: "Saved",
        message: "Voter record updated successfully",
        color: "green",
      });
      onClose();
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to update voter record",
        color: "red",
      });
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const payload: VoterUpdatePayload = {
      phone_number: values.phone_number || undefined,
      remarks: values.remarks || undefined,
      address_en: values.address || undefined,
      occupation_en: values.occupation || undefined,
      education_en: values.education || undefined,
      religion_en: values.religion || undefined,
      political_affiliation_en: values.political_affiliation || undefined,
    };

    mutation.mutate(payload);
  };

  const occupationOptions = OCCUPATION_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label_en,
  }));

  const religionOptions = RELIGION_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label_en,
  }));

  const politicalAffiliationOptions = POLITICAL_AFFILIATION_OPTIONS.map(
    (opt) => ({
      value: opt.value,
      label: opt.label_en,
    }),
  );

  if (!voter) return null;

  // Use English fields with fallback to Nepali if empty
  const displayName = voter.name_en || voter.name_ne;
  const gender = voter.gender_en || voter.gender_ne;
  const father = voter.father_name_en || voter.father_name_ne;
  const mother = voter.mother_name_en || voter.mother_name_ne;
  const spouse = voter.spouse_name_en || voter.spouse_name_ne;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={600}>Edit Voter Record</Text>}
      size="lg"
      centered
    >
      {/* Voter Info Header */}
      <Box
        mb="md"
        p="sm"
        style={{ background: "var(--mantine-color-gray-0)", borderRadius: 8 }}
      >
        <Stack gap={4}>
          <Group justify="space-between">
            <Text fw={600} size="sm">
              {displayName}
            </Text>
            <Badge size="xs" variant="light" color="gray">
              {voter.age}yr · {gender}
            </Badge>
          </Group>
          <Text size="xs" c="dimmed">
            #{voter.serial_no} · Voter ID: {voter.voter_no}
          </Text>
          {(father || mother || spouse) && (
            <Text size="xs" c="dimmed">
              {spouse ? `Spouse: ${spouse}` : ""}
              {spouse && father ? " · " : ""}
              {father ? `Father: ${father}` : ""}
              {(spouse || father) && mother ? " · " : ""}
              {mother ? `Mother: ${mother}` : ""}
            </Text>
          )}
        </Stack>
      </Box>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Phone Number"
            placeholder="Enter phone number"
            {...form.getInputProps("phone_number")}
          />

          <TextInput
            label="Current Address"
            placeholder="Enter current address"
            {...form.getInputProps("address")}
          />

          <Select
            label="Occupation"
            placeholder="Select occupation"
            data={occupationOptions}
            {...form.getInputProps("occupation")}
            clearable
            searchable
          />

          <TextInput
            label="Education"
            placeholder="Enter education"
            {...form.getInputProps("education")}
          />

          <Select
            label="Religion"
            placeholder="Select religion"
            data={religionOptions}
            {...form.getInputProps("religion")}
            clearable
            searchable
          />

          <Select
            label="Political Affiliation"
            placeholder="Select political affiliation"
            data={politicalAffiliationOptions}
            {...form.getInputProps("political_affiliation")}
            clearable
            searchable
          />

          <Textarea
            label="Remarks"
            placeholder="Enter any remarks"
            autosize
            minRows={2}
            maxRows={4}
            {...form.getInputProps("remarks")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={mutation.isPending}
              leftSection={<FloppyDisk size={18} />}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
