export interface PetFilters {
  species: string;
  age: string;
  size: string;
  search: string;
}

export interface ApplicationStep {
  step: number;
  title: string;
  isComplete: boolean;
}

export interface StaffStats {
  totalAdopted: number;
  currentPets: number;
  happyFamilies: number;
  todayApplications: number;
  monthlyAdoptions: number;
  activePets: number;
  pendingApplications: number;
}
