import { Container, Divider, Title, Stack } from "@mantine/core";
import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  headerContent?: ReactNode;
}

export function PageWrapper({
  children,
  title,
  headerContent,
}: PageWrapperProps) {
  return (
    <>
      <Divider />

      {(title || headerContent) && (
        <>
          <Container size="md" py="md">
            {title && <Title order={2}>{title}</Title>}
            {headerContent}
          </Container>
          <Divider />
        </>
      )}

      <Container size="md" py="md">
        {children}
      </Container>
    </>
  );
}
