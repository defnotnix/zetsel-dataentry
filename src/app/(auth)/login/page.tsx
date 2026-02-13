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
  Container,
  ThemeIcon,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { BellIcon, SignIn, SignInIcon } from "@phosphor-icons/react";
import { login } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";
import styles from "./styles.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [currentDate] = useState(() => String(new Date()));

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
    <div style={{ background: "url(https://images.pexels.com/photos/7130500/pexels-photo-7130500.jpeg)", backgroundPosition: "top", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
      <Container size="xs" >

        <Center h="100vh"  >



          <Stack>

            <Group justify="center">
              <Text size="xs" fw={800} c="gray.0" tt="uppercase">
                RSP - Data Organization Portal <span style={{ opacity: .5 }}>Powered by Zetsel</span>
              </Text>
            </Group>

            <Paper py={73} px={64} radius="md">
              <Stack align="center" mb="lg" gap="lg">


                <Stack gap={0}>
                  <Text size="xl" fw={900} ta="center">
                    Welcome back!
                  </Text>
                  <Text size="sm" ta="center">
                     RSP Data Entry System
                  </Text>
                </Stack>

               
              </Stack>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                  <TextInput
                    size="xs"
                   
                    label="Username"
                    placeholder="Enter your username"
                    required
                    {...form.getInputProps("username")}
                  />
                  <PasswordInput
                    size="xs"
                    label="Password"
                   
                    placeholder="Enter your password"
                    required
                    {...form.getInputProps("password")}
                  />

                  <Text size="xs" ta="center" opacity={.5}>
                    Forgot your password? Please contact operator.
                  </Text>

                  <Button size="xs" type="submit" fullWidth loading={loading} mt="sm">
                    Sign In
                  </Button>

                  <Text size="xs" ta="center" >
                    By signing in, you agree to our  <b>Terms of Service</b> &  <b>Privacy Policy</b>
                  </Text>
                </Stack>
              </form>
            </Paper>

            <Group justify="center">
              <Text size="xs" fw={800} c="gray.0" >
                {currentDate}
              </Text>
            </Group>

          </Stack>
        </Center>

      </Container>
    </div>
  );
}
