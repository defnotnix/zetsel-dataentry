// ============ Auth Types ============
export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  permissions?: string[];
  polling_stations?: PollingStation[];
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}

// ============ Election Types ============
export interface PollingStation {
  id: number;
  station_code?: string | null;
  place_id?: number;
  place_name: string;
  place_name_ne?: string;
  place_name_en?: string;
  ward_id?: number;
  ward_no?: number;
  ward_name?: string;
  ward_name_ne?: string;
  ward_name_en?: string;
  local_body_id?: number;
  local_body_name?: string;
  local_body_name_ne?: string;
  local_body_name_en?: string;
  district_id?: number;
  district_name?: string;
  district_name_ne?: string;
  district_name_en?: string;
  province_id?: number;
  province_name?: string;
  province_name_ne?: string;
  province_name_en?: string;
  display_name?: string;
  election_id?: number | null;
}

export interface VoterRollEntryExtra {
  id: number;
  entry: number;
  address_en?: string | null;
  occupation_en?: string | null;
  religion_en?: string | null;
  education_en?: string | null;
  political_affiliation_en?: string | null;
  phone_number?: string | null;
  remarks?: string | null;
}

export interface VoterRollEntry {
  id: number;
  roll_id: number;
  polling_station_id: number;
  polling_station?: PollingStation;
  serial_no: number;
  voter_no: string;

  // Personal Details
  name_ne: string;
  name_en: string;
  age: number;
  gender_ne: string;
  gender_en: string;

  // Family Details
  spouse_name_ne?: string | null;
  spouse_name_en?: string | null;
  father_name_ne?: string | null;
  father_name_en?: string | null;
  mother_name_ne?: string | null;
  mother_name_en?: string | null;
  parent_name_raw?: string | null;

  // Extended Data
  extra?: VoterRollEntryExtra | null;
}

export interface VoterRollPagination {
  total_pages: number;
  total_items: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface VoterRollResponse {
  success: boolean;
  results: VoterRollEntry[];
  pagination: VoterRollPagination;
}

export interface VoterUpdatePayload {
  entry?: number;
  phone_number?: string;
  remarks?: string;
  address_en?: string;
  occupation_en?: string;
  education_en?: string;
  religion_en?: string;
  political_affiliation_en?: string;
}

// ============ App Types ============
export type EntryMode = "nepali" | "english";

export interface OccupationOption {
  value: string;
  label_ne: string;
  label_en: string;
}

export const OCCUPATION_OPTIONS: OccupationOption[] = [
  { value: "student", label_ne: "विद्यार्थी", label_en: "Student" },
  { value: "employment", label_ne: "जागिर", label_en: "Employment" },
  { value: "business", label_ne: "व्यापार", label_en: "Business" },
  { value: "agriculture", label_ne: "कृषि", label_en: "Agriculture" },
  { value: "other", label_ne: "अन्य", label_en: "Other" },
];

export const RELIGION_OPTIONS: OccupationOption[] = [
  { value: "hindu", label_ne: "हिन्दु", label_en: "Hindu" },
  { value: "buddhist", label_ne: "बौद्ध", label_en: "Buddhist" },
  { value: "muslim", label_ne: "मुस्लिम", label_en: "Muslim" },
  { value: "christian", label_ne: "ईसाई", label_en: "Christian" },
  { value: "kirat", label_ne: "किरात", label_en: "Kirat" },
  { value: "other", label_ne: "अन्य", label_en: "Other" },
];

export const POLITICAL_AFFILIATION_OPTIONS: OccupationOption[] = [
  { value: "congress", label_ne: "नेपाली कांग्रेस", label_en: "Nepali Congress" },
  { value: "uml", label_ne: "नेकपा एमाले", label_en: "CPN (UML)" },
  { value: "maoist", label_ne: "नेकपा माओवादी", label_en: "CPN (Maoist)" },
  { value: "rsp", label_ne: "राष्ट्रिय स्वतन्त्र पार्टी", label_en: "RSP" },
  { value: "rpp", label_ne: "राप्रपा", label_en: "RPP" },
  { value: "jsb", label_ne: "जनता समाजवादी", label_en: "JSP" },
  { value: "other", label_ne: "अन्य", label_en: "Other" },
];
