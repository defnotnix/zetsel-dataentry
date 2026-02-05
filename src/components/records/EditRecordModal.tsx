"use client";

import {
  Modal,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  Stack,
  SegmentedControl,
  Text,
  Badge,
  Divider,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FloppyDisk } from "@phosphor-icons/react";
import { saveVoterExtra } from "@/services/elections";
import { useAuthStore } from "@/stores/authStore";
import type { VoterRollEntry, EntryMode, VoterUpdatePayload } from "@/types";
import { OCCUPATION_OPTIONS } from "@/types";
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
  const { entryMode, setEntryMode } = useAuthStore();
  const isNepali = entryMode === "nepali";

  const form = useForm({
    initialValues: {
      phone_number: "",
      address: "",
      occupation: "",
      education: "",
      religion: "",
      living_address: "",
      remarks: "",
    },
  });

  // Reset form when voter changes
  useEffect(() => {
    if (voter && opened) {
      const extra = voter.extra;
      form.setValues({
        phone_number: extra?.phone_number || "",
        address: isNepali
          ? extra?.address_raw || ""
          : extra?.address_en || "",
        occupation: isNepali
          ? extra?.occupation || ""
          : extra?.occupation_en || "",
        education: isNepali
          ? extra?.education || ""
          : extra?.education_en || "",
        religion: isNepali
          ? extra?.religion || ""
          : extra?.religion_en || "",
        living_address: isNepali
          ? extra?.living_address || ""
          : extra?.living_address_en || "",
        remarks: extra?.remarks || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voter, opened, entryMode]);

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
    };

    if (isNepali) {
      payload.address_raw = values.address || undefined;
      payload.occupation = values.occupation || undefined;
      payload.education = values.education || undefined;
      payload.religion = values.religion || undefined;
      payload.living_address = values.living_address || undefined;
    } else {
      payload.address_en = values.address || undefined;
      payload.occupation_en = values.occupation || undefined;
      payload.education_en = values.education || undefined;
      payload.religion_en = values.religion || undefined;
      payload.living_address_en = values.living_address || undefined;
    }

    mutation.mutate(payload);
  };

  const occupationOptions = OCCUPATION_OPTIONS.map((opt) => ({
    value: isNepali ? opt.label_ne : opt.value,
    label: isNepali ? opt.label_ne : opt.label_en,
  }));

  if (!voter) return null;

  const displayName = isNepali ? voter.name_ne : voter.name_en;
  const gender = isNepali ? voter.gender_ne : voter.gender_en;
  const father = isNepali ? voter.father_name_ne : voter.father_name_en;
  const mother = isNepali ? voter.mother_name_ne : voter.mother_name_en;
  const spouse = isNepali ? voter.spouse_name_ne : voter.spouse_name_en;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <Text fw={600}>Edit Voter Record</Text>
          <Badge size="sm" color={isNepali ? "orange" : "blue"}>
            {isNepali ? "नेपाली" : "English"}
          </Badge>
        </Group>
      }
      size="lg"
      centered
    >
      {/* Voter Info Header */}
      <Box mb="md" p="sm" style={{ background: "var(--mantine-color-gray-0)", borderRadius: 8 }}>
        <Stack gap={4}>
          <Group justify="space-between">
            <Text fw={600} size="sm">{displayName}</Text>
            <Badge size="xs" variant="light" color="gray">
              {voter.age}yr · {gender}
            </Badge>
          </Group>
          <Text size="xs" c="dimmed">
            #{voter.serial_no} · Voter ID: {voter.voter_no}
          </Text>
          {(father || mother || spouse) && (
            <Text size="xs" c="dimmed">
              {spouse ? `${isNepali ? "पति/पत्नी" : "Spouse"}: ${spouse}` : ""}
              {spouse && father ? " · " : ""}
              {father ? `${isNepali ? "बुबा" : "Father"}: ${father}` : ""}
              {(spouse || father) && mother ? " · " : ""}
              {mother ? `${isNepali ? "आमा" : "Mother"}: ${mother}` : ""}
            </Text>
          )}
        </Stack>
      </Box>

      {/* Mode Toggle */}
      <SegmentedControl
        fullWidth
        mb="md"
        value={entryMode}
        onChange={(val) => setEntryMode(val as EntryMode)}
        data={[
          { label: "नेपाली Mode", value: "nepali" },
          { label: "English Mode", value: "english" },
        ]}
      />

      <Divider mb="md" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Phone Number"
            placeholder="Enter phone number"
            {...form.getInputProps("phone_number")}
          />

          <TextInput
            label={isNepali ? "ठेगाना (Address)" : "Address"}
            placeholder={isNepali ? "ठेगाना लेख्नुहोस्" : "Enter address"}
            {...form.getInputProps("address")}
          />

          <Select
            label={isNepali ? "पेशा (Occupation)" : "Occupation"}
            placeholder={isNepali ? "पेशा छान्नुहोस्" : "Select occupation"}
            data={occupationOptions}
            {...form.getInputProps("occupation")}
            clearable
            searchable
          />

          <TextInput
            label={isNepali ? "शिक्षा (Education)" : "Education"}
            placeholder={isNepali ? "शिक्षा लेख्नुहोस्" : "Enter education"}
            {...form.getInputProps("education")}
          />

          <TextInput
            label={isNepali ? "धर्म (Religion)" : "Religion"}
            placeholder={isNepali ? "धर्म लेख्नुहोस्" : "Enter religion"}
            {...form.getInputProps("religion")}
          />

          <TextInput
            label={isNepali ? "बसोबास ठेगाना (Living Address)" : "Living Address"}
            placeholder={
              isNepali ? "बसोबास ठेगाना लेख्नुहोस्" : "Enter living address"
            }
            {...form.getInputProps("living_address")}
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
