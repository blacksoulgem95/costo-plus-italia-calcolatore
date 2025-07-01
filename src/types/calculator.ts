
export interface Resource {
  id: string;
  name: string;
  contractType: 'employee' | 'cococo' | 'partitaiva';
  netSalary?: number;
  grossSalary?: number;
  compensation?: number;
  hourlyRate?: number;    // Tariffa oraria per Partita IVA
  vatRate?: number;      // Aliquota IVA del freelancer
  billableHours: number;
  projectHours?: number;
  inps?: number;         // Contributi INPS (per dipendenti e collaboratori)
  irpef?: number;        // Aliquota IRPEF
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
  id: string;
  name: string;
  directCosts: number;
  durationMonths: number;
}

export interface Projects {
  items: ProjectData[];
  activeProjectId: string;
}

export interface CalculationResults {
  personnelCost: number;
  overheadCost: number;
  monthlyOverhead: number[];
  totalProjectCost: number;
  basePrice: number;
  vatAmount: number;
  finalPrice: number;
  grossProfit: number;
  irapAmount: number;
  netProfit: number;
}
