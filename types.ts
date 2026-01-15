
export interface Patient {
  id: string;
  name: string;
  dob: string;
  mrn: string;
  gender: string;
}

export interface ClinicalInsight {
  summary: string;
  risks: {
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  structuredData: {
    medications: string[];
    diagnoses: string[];
    vitals: { name: string; value: string }[];
  };
  checklist: string[];
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  timestamp: string;
  author: string;
  content: string;
  insights?: ClinicalInsight;
}
