type PlanSource = "recommend" | "like";

export interface Plan {
  planId: number;
  name: string;
  baseDataGb: string;
  monthlyFee: number;
  voiceCallPrice: string;
  sms: string;
  description: string;
  mobileType: string;
  onRemove?: () => void;
  source?: PlanSource;
}

export interface MyPlan {
  id: string;
  name: string;
  price: string;
  call: string;
  sms: string;
  tech: string;
  data: string;
  speed: string;
  extraCall: string;
  numberChangeFee: string;
}

export interface ApiPlan {
  planId: number;
  name: string;
}

export interface DipCardPlan {
  planId: number;
  name: string;
  baseDataGb: string;
  dailyDataGb: string;
  sharingDataGb: string;
  monthlyFee: number;
  voiceCallPrice: string;
  sms: string;
  mobileType: string;
  planUrl: string;
  online: boolean;
}