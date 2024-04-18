export type TPatientFilterRequest = {
    searchTerm?: string | undefined;
    email?: string | undefined;
    contactNo?: string | undefined;
  };
  
  export type TPatientUpdate = {
    email: string;
    name: string;
    profilePhoto: string;
    contactNumber: string;
    address: string;
    patientHelthData: TPatientHelthData;
    medicalReport: TMedicalReport;
  };
  
  export type TMedicalReport = {
    reportName: string;
    reportLink: string;
  };
  export type TPatientHelthData = {
    dateOfBirth: string | Date;
    gender: 'MALE' | 'FEMALE';
    bloodGroup:
      | 'A_POSITIVE'
      | 'A_NEGATIVE'
      | 'B_POSITIVE'
      | 'B_NEGATIVE'
      | 'O_POSITIVE'
      | 'O_NEGATIVE'
      | 'AB_POSITIVE'
      | 'AB_NEGATIVE';
    hasAllergies: boolean;
    hasDiabetes: boolean;
    height: string;
    weight: string;
    smokingStatus: boolean;
    dietaryPreferences: string;
    pregnancyStatus: boolean;
    mentalHealthHistory: string;
    immunizationStatus: boolean;
    hasPastSurgeries: boolean;
    recentAnxiety: boolean;
    recentDepression: boolean;
    maritalStatus: 'MARRIED' | 'UNMARRIED';
  };