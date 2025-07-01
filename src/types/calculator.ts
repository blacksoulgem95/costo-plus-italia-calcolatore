
export interface Resource {
  id: string;
  name: string;
  contractType: 'employee' | 'cococo' | 'partitaiva';
  netSalary?: number;
  grossSalary?: number;
  compensation?: number;
  billableHours: number;
  projectHours?: number;
}

export interface CompanyData {
  companyType: 'srl' | 'individual';
  irapRate: number;
  profitMargin: number;
  vatRate: number;
}

export interface FixedCosts {
  rent: number;
  utilities: number;
  software: number;
  hardware: number;
  marketing: number;
  administration: number;
  insurance: number;
  travel: number;
  training: number;
  other: number;
  otherDescription: string;
}

export interface ProjectData {
  name: string;
  directCosts: number;
  durationMonths: number;
}

export interface CalculationResults {
  personnelCost: number;
  overheadCost: number;
  totalProjectCost: number;
  basePrice: number;
  vatAmount: number;
  finalPrice: number;
  grossProfit: number;
}
