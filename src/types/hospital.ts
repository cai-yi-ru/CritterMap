export interface Hospital {
    id: string;
    name: string;
    address: string;
    city?: string;
    district?: string;
    phone?: string;
    type: string;
    typeText: string;
    emergency?: boolean;
    rating?: string;
    services?: string[];
    pets?: string[];
    pet_category_group?: string[];
    website?: string;
    hours?: string;
    business_hours?: {
      mon: string[];
      tue: string[];
      wed: string[];
      thu: string[];
      fri: string[];
      sat: string[];
      sun: string[];
    };
    reservationRequired?: boolean;
    hasEmergencyService?: boolean;
    emergencyHours?: string;
    nightClinic?: boolean;
    specialties?: string[];
    appointmentLink?: string;
    transportTips?: string;
    clinicNotes?: string;
    lat: number;
    lng: number;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      line?: string;
      [key: string]: string | undefined;
    };
  }