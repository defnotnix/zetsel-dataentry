"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchVoters } from "@/services/elections";
import { useAuthStore } from "@/stores/authStore";
import { BoothSelectionView } from "@/components/records/BoothSelectionView";
import { VoterRecordsView } from "@/components/records/VoterRecordsView";
import { EditRecordModal } from "@/components/records/EditRecordModal";
import type { VoterRollEntry, PollingStation } from "@/types";

export default function RecordsPage() {
  const { user, selectedPollingStation, entryMode, setSelectedPollingStation } =
    useAuthStore();

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [selectedVoter, setSelectedVoter] = useState<VoterRollEntry | null>(
    null,
  );
  const [modalOpened, setModalOpened] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const pollingStations = user?.polling_stations || [];

  // Fetch voters once a booth is selected
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["voters", selectedPollingStation?.id, debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      fetchVoters({
        pollingStation: selectedPollingStation!.id,
        search: debouncedSearch || undefined,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_next) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!selectedPollingStation,
  });

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const allVoters = data?.pages.flatMap((page) => page.results) || [];
  const totalCount = data?.pages[0]?.pagination.total_items || 0;

  const handleStationClick = (station: PollingStation) => {
    setSelectedPollingStation(station);
  };

  const handleBack = () => {
    setSelectedPollingStation(null);
    setSearch("");
  };

  const handleVoterClick = (voter: VoterRollEntry) => {
    setSelectedVoter(voter);
    setModalOpened(true);
  };

  // ── Booth Selection View ──
  if (!selectedPollingStation) {
    return (
      <BoothSelectionView
        pollingStations={pollingStations}
        onStationSelect={handleStationClick}
      />
    );
  }

  // ── Voter Records View ──
  return (
    <>
      <VoterRecordsView
        pollingStation={selectedPollingStation}
        voters={allVoters}
        totalCount={totalCount}
        entryMode={entryMode}
        isLoading={isLoading}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        search={search}
        debouncedSearch={debouncedSearch}
        onSearchChange={setSearch}
        onBack={handleBack}
        onVoterClick={handleVoterClick}
        lastElementRef={lastElementRef}
      />

      {/* Edit Modal */}
      <EditRecordModal
        voter={selectedVoter}
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setSelectedVoter(null);
        }}
      />
    </>
  );
}
