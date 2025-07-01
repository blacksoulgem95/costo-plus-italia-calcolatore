
import { Resource, FixedCosts, ProjectData, CompanyData, CalculationResults } from '@/types/calculator';

export const calculateGrossSalary = (netSalary: number): number => {
  // Simplified calculation for demonstration
  return netSalary * 1.4; // Approximate conversion
};

export const calculateEmployeeCost = (resource: Resource): number => {
  let grossSalary = resource.grossSalary || 0;
  if (!grossSalary && resource.netSalary) {
    grossSalary = calculateGrossSalary(resource.netSalary);
  }
  
  // Add employer contributions (simplified)
  const employerContributions = grossSalary * 0.35; // Approximate 35%
  return grossSalary + employerContributions; // Monthly cost
};

export const calculateHourlyCost = (resource: Resource): number => {
  if (resource.contractType === 'partitaiva') {
    return (resource.compensation || 0) / (resource.billableHours / 12); // Monthly hours
  }
  const monthlyCost = calculateEmployeeCost(resource);
  const monthlyHours = resource.billableHours / 12;
  return monthlyCost / monthlyHours;
};

export const calculateTotalFixedCosts = (fixedCosts: FixedCosts): number => {
  return Object.entries(fixedCosts)
    .filter(([key]) => key !== 'otherDescription')
    .reduce((sum, [, value]) => sum + (value as number), 0);
};

export const calculateProjectCost = (
  resources: Resource[],
  fixedCosts: FixedCosts,
  projectData: ProjectData,
  companyData: CompanyData
): CalculationResults => {
  const personnelCost = resources.reduce((sum, resource) => {
    const hourlyCost = calculateHourlyCost(resource);
    return sum + (hourlyCost * (resource.projectHours || 0));
  }, 0);

  const totalBillableHours = resources.reduce((sum, r) => sum + r.billableHours, 0);
  const monthlyOverheadRate = totalBillableHours > 0 
    ? (calculateTotalFixedCosts(fixedCosts) / 12) / (totalBillableHours / 12)
    : 0;
  
  const projectTotalHours = resources.reduce((sum, r) => sum + (r.projectHours || 0), 0);
  const overheadCost = monthlyOverheadRate * projectTotalHours;

  // Calculate personnel cost based on project duration
  const monthlyPersonnelCost = resources.reduce((sum, resource) => {
    if (resource.contractType === 'partitaiva') {
      return sum + ((resource.compensation || 0) * (resource.projectHours || 0) / (resource.billableHours / 12));
    }
    const monthlyCost = calculateEmployeeCost(resource);
    const utilizationRate = (resource.projectHours || 0) / (resource.billableHours / 12);
    return sum + (monthlyCost * utilizationRate);
  }, 0);
  
  const totalPersonnelCost = monthlyPersonnelCost * projectData.durationMonths;

  const totalProjectCost = totalPersonnelCost + overheadCost + projectData.directCosts;
  const basePrice = totalProjectCost * (1 + companyData.profitMargin / 100);
  const vatAmount = basePrice * (companyData.vatRate / 100);
  const finalPrice = basePrice + vatAmount;

  return {
    personnelCost: totalPersonnelCost,
    overheadCost,
    totalProjectCost,
    basePrice,
    vatAmount,
    finalPrice,
    grossProfit: basePrice - totalProjectCost
  };
};
