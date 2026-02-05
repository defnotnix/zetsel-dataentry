"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
  Center,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { SignIn } from "@phosphor-icons/react";
import { login } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (v) => (v.trim().length === 0 ? "Username is required" : null),
      password: (v) => (v.trim().length === 0 ? "Password is required" : null),
    },
  });

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const response = await login(values);
      setUser(response.user);
      notifications.show({
        title: "Welcome!",
        message: `Logged in as ${response.user.first_name || response.user.username}`,
        color: "green",
      });
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials";
      notifications.show({
        title: "Login Failed",
        message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center
      style={{ minHeight: "100vh" }}
      className="bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <Box w={420} mx="auto" px="md">
        <Paper withBorder shadow="md" p={30} radius="md">
          <Stack align="center" mb="lg">
            <Box
              className="bg-blue-600 rounded-full p-3"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SignIn size={32} weight="bold" color="white" />
            </Box>
            <Title order={2} ta="center">
              RSP
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Election Data Entry System
            </Text>
          </Stack>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Username"
                placeholder="Enter your username"
                required
                {...form.getInputProps("username")}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                {...form.getInputProps("password")}
              />
              <Button type="submit" fullWidth loading={loading} mt="sm">
                Sign In
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Center>
  );
}
