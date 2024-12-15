export type Department = {
  name: string;
  acronym: string;
};

export type UniversityType = "federal" | "state" | "private"

export interface University {
  logo: string;
  current_vc: string;
  name: string;
  acronym: string;
  type: UniversityType,
  location: {
    city: string;
    state: string;
  };
  founded: number;
  website: string;
  faculties: {
    acronym: string;
    name: string;
    departments: Department[];
  }[];
}