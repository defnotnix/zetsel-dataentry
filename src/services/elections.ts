import api from "./api";
import type {
  VoterRollResponse,
  VoterRollEntryExtra,
  VoterUpdatePayload,
} from "@/types";

export async function fetchVoters(params: {
  pollingStation: number;
  search?: string;
  page?: number;
  roll?: number;
  voterNo?: string;
  ordering?: string;
}): Promise<VoterRollResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set("polling_station", String(params.pollingStation));
  if (params.page) queryParams.set("page", String(params.page));
  if (params.roll) queryParams.set("roll", String(params.roll));
  if (params.voterNo) queryParams.set("voter_no", params.voterNo);
  if (params.search) queryParams.set("search", params.search);
  if (params.ordering) queryParams.set("ordering", params.ordering);

  const { data } = await api.get<VoterRollResponse>(
    `/elections/voter-roll-entries/?${queryParams.toString()}`
  );
  return data;
}

export async function saveVoterExtra(
  entryId: number,
  extraId: number | undefined,
  payload: VoterUpdatePayload
): Promise<VoterRollEntryExtra> {
  if (extraId) {
    const { data } = await api.patch<VoterRollEntryExtra>(
      `/elections/voter-roll-entry-extras/${extraId}/`,
      payload
    );
    return data;
  } else {
    const { data } = await api.post<VoterRollEntryExtra>(
      `/elections/voter-roll-entry-extras/`,
      { entry: entryId, ...payload }
    );
    return data;
  }
}

export async function getVoterExtra(extraId: number): Promise<VoterRollEntryExtra> {
  const { data } = await api.get<VoterRollEntryExtra>(
    `/elections/voter-roll-entry-extras/${extraId}/`
  );
  return data;
}
