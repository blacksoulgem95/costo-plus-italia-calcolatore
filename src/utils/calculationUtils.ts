
import { Resource, FixedCosts, ProjectData, CompanyData, CalculationResults } from '@/types/calculator';

/**
 * Calcola il salario lordo stimato a partire dal netto
 * Considera aliquote fiscali IRPEF e contributi INPS
 */
export const calculateGrossSalary = (netSalary: number, irpef: number = 27, inps: number = 9): number => {
  // Formula approssimativa per calcolare il lordo dal netto
  // Considerando IRPEF e contributi a carico del lavoratore
  const irpefRate = irpef / 100;
  const inpsRate = inps / 100;

  // Il netto è circa il lordo meno le tasse (IRPEF) e i contributi (INPS)
  // Netto = Lordo - (Lordo * IRPEF) - (Lordo * INPS)
  // Quindi: Lordo = Netto / (1 - IRPEF - INPS)
  return netSalary / (1 - irpefRate - inpsRate);
};

/**
 * Calcola il costo totale di un dipendente per l'azienda, includendo
 * i contributi a carico del datore di lavoro e altre imposte
 */
export const calculateEmployeeCost = (resource: Resource): number => {
  // Determina lo stipendio lordo dalla risorsa
  let grossSalary = resource.grossSalary || 0;

  if (!grossSalary && resource.netSalary) {
    // Usa aliquote IRPEF e INPS specifiche se fornite, altrimenti usa valori predefiniti
    const irpef = resource.irpef || 27; // Aliquota IRPEF media approssimativa
    const inps = resource.inps || 9;    // Contributi INPS a carico del lavoratore
    grossSalary = calculateGrossSalary(resource.netSalary, irpef, inps);
  }

  // Contributi a carico del datore di lavoro (circa 30% in totale)
  const inpsEmployer = 24;     // Contributi INPS a carico dell'azienda
  const inailRate = 1;         // Assicurazione INAIL
  const tfr = 7.41;            // Trattamento di Fine Rapporto (TFR)

  const employerContributions = grossSalary * (inpsEmployer + inailRate + tfr) / 100;

  return grossSalary + employerContributions; // Costo mensile totale per l'azienda
};

/**
 * Calcola il costo orario di una risorsa in base al tipo di contratto
 */
export const calculateHourlyCost = (resource: Resource): number => {
  const monthlyHours = resource.billableHours / 12;

  if (resource.contractType === 'partitaiva') {
    // Per freelancer (P.IVA) si usa esclusivamente una delle due opzioni:
    // 1. Tariffa oraria specificata direttamente (prioritaria)
    if (resource.hourlyRate) {
      return resource.hourlyRate;
    }
    // 2. Tariffa calcolata dal compenso mensile (alternativa)
    return (resource.compensation || 0) / monthlyHours;
  }

  // Per dipendenti e co.co.co. calcoliamo in base al costo aziendale completo
  // includendo tutti i contributi e oneri fiscali
  const monthlyCost = calculateEmployeeCost(resource);
  return monthlyCost / monthlyHours;
};

/**
 * Calcola il totale dei costi fissi escludendo i campi non numerici
 */
export const calculateTotalFixedCosts = (fixedCosts: FixedCosts): number => {
  const nonNumericFields = ['otherDescription'];

  return Object.entries(fixedCosts)
    .filter(([key]) => !nonNumericFields.includes(key))
    .reduce((sum, [, value]) => sum + (typeof value === 'number' ? value : 0), 0);
};

/**
 * Calcola i costi del progetto e il prezzo finale.
 * 
 * L'overhead viene calcolato come segue:
 * 1. Si determinano i costi fissi totali annuali
 * 2. Si dividono per le ore fatturabili annuali totali di tutte le risorse
 * 3. Si ottiene una tariffa oraria di overhead
 * 4. Si moltiplica questa tariffa per le ore totali del progetto
 * 
 * Questo approccio garantisce che l'overhead sia proporzionale alle ore di lavoro
 * effettivamente allocate al progetto, indipendentemente dalla durata temporale.
 */
/**
 * Calcola le ore di progetto standard per una risorsa full-time
 * basato su 40 ore settimanali per la durata del progetto
 */
export const calculateFullTimeHours = (durationMonths: number): number => {
  // 40 ore settimanali * 4.33 settimane/mese (media) * durata in mesi
  return Math.round(40 * 4.33 * durationMonths);
};

/**
 * Calcola l'overhead mensile distribuito su tutti i mesi dei progetti
 */
export const calculateMonthlyOverhead = (
  fixedCosts: FixedCosts,
  projects: ProjectData[]
): number[] => {
  const totalFixedCostsPerYear = calculateTotalFixedCosts(fixedCosts);
  const monthlyFixedCosts = totalFixedCostsPerYear / 12;

  // Determina il numero totale di mesi coperti dai progetti
  const projectMonths = new Set<number>();

  // Mappiamo tutti i mesi utilizzati nei progetti
  projects.forEach(project => {
    const startMonth = 0; // Mese base per il primo progetto
    const endMonth = Math.ceil(project.durationMonths);

    for (let i = startMonth; i < endMonth; i++) {
      projectMonths.add(i);
    }
  });

  // Ordina i mesi
  const sortedMonths = Array.from(projectMonths).sort((a, b) => a - b);

  // Se non ci sono mesi, restituisce un array vuoto
  if (sortedMonths.length === 0) {
    return [];
  }

  // Crea un array con l'overhead distribuito per ciascun mese coinvolto
  return sortedMonths.map(() => monthlyFixedCosts);
};

export const calculateProjectCost = (
  resources: Resource[],
  fixedCosts: FixedCosts,
  allProjects: ProjectData[],
  activeProject: ProjectData,
  companyData: CompanyData
): CalculationResults => {
  // Prepara una copia delle risorse con ore di progetto automatiche dove necessario
  const resourcesWithHours = resources.map(resource => {
    if (!resource.projectHours || resource.projectHours === 0) {
      // Se non sono specificate ore di progetto, impostiamo un full-time standard
      const fullTimeHours = calculateFullTimeHours(activeProject.durationMonths);
      return { ...resource, projectHours: fullTimeHours };
    }
    return resource;
  });

  // Calcola le ore fatturabili totali e le ore totali del progetto
  const totalBillableHours = resourcesWithHours.reduce((sum, resource) => sum + resource.billableHours, 0);
  const projectTotalHours = resourcesWithHours.reduce((sum, resource) => sum + (resource.projectHours || 0), 0);

  // Calcola l'incidenza dell'overhead orario sul progetto
  const totalFixedCostsPerYear = calculateTotalFixedCosts(fixedCosts);   // Costi fissi annuali
  const yearlyBillableHours = totalBillableHours;                       // Ore fatturabili annuali

  // Calcola il tasso orario dell'overhead dividendo i costi fissi annuali per le ore fatturabili annuali
  const hourlyOverheadRate = yearlyBillableHours > 0 
    ? totalFixedCostsPerYear / yearlyBillableHours
    : 0;

  // Calcola il costo dell'overhead applicando il tasso orario alle ore totali di progetto
  // Non moltiplicare per la durata del progetto poiché le ore di progetto sono già totali
  const overheadCost = hourlyOverheadRate * projectTotalHours;

  // Calcola l'overhead mensile distribuito su tutti i progetti
  const monthlyOverhead = calculateMonthlyOverhead(fixedCosts, allProjects);

  // L'overhead è proporzionale alle ore allocate, non alla durata del progetto
  // Se un freelancer lavora 100 ore, l'overhead è per 100 ore indipendentemente da quanto
  // tempo impieghi a completarle

  // Separiamo il calcolo per freelancer e dipendenti
  const freelancerCosts = resourcesWithHours
    .filter(resource => resource.contractType === 'partitaiva')
    .reduce((sum, resource) => {
      const projectHours = resource.projectHours || 0;

      // Per freelancer, il costo è direttamente basato sulle ore di progetto
      // senza considerare la durata del progetto in mesi
      if (resource.hourlyRate) {
        // Costo diretto basato sulla tariffa oraria
        return sum + (resource.hourlyRate * projectHours);
      } else if (resource.compensation) {
        // Calcolo basato sul compenso mensile
        const monthlyHours = resource.billableHours / 12;
        const hourlyRate = resource.compensation / monthlyHours;
        return sum + (hourlyRate * projectHours);
      }
      return sum;
    }, 0);

  // Calcolo costi per dipendenti e collaboratori
  // Calcola il costo totale sul progetto, NON mensile, per evitare doppia moltiplicazione
  const employeeCost = resourcesWithHours
    .filter(resource => resource.contractType !== 'partitaiva')
    .reduce((sum, resource) => {
      const projectHours = resource.projectHours || 0;
      const monthlyCost = calculateEmployeeCost(resource);
      const hourlyRate = monthlyCost / (resource.billableHours / 12);

      // Il costo è basato sulle ore di progetto moltiplicate per la tariffa oraria
      // senza ulteriore moltiplicazione per i mesi di progetto
      return sum + (hourlyRate * projectHours);
    }, 0);

  // Calcola il costo totale del personale:
  // - Sia per freelancer che per dipendenti: costo basato sulle ore di progetto totali
  const totalPersonnelCost = freelancerCosts + employeeCost;

  // Calcolo dei costi del progetto
  const totalProjectCost = totalPersonnelCost + overheadCost + activeProject.directCosts;

  // Calcolo del prezzo in base al markup
  const profitMarginMultiplier = 1 + (companyData.profitMargin / 100);
  const basePrice = totalProjectCost * profitMarginMultiplier;

  // Calcolo dell'utile lordo
  const grossProfit = basePrice - totalProjectCost;

  // Calcolo IRAP sull'utile lordo
  const irapRate = companyData.irapRate / 100;
  const irapAmount = grossProfit * irapRate;

  // Calcolo dell'utile netto (dopo IRAP)
  const netProfit = grossProfit - irapAmount;

  // Calcolo IVA e prezzo finale
  const vatRate = companyData.vatRate / 100;
  const vatAmount = basePrice * vatRate;

  // Se l'IVA è 0%, il prezzo finale è uguale al prezzo base
  const finalPrice = companyData.vatRate === 0 ? basePrice : basePrice + vatAmount;

  return {
    personnelCost: totalPersonnelCost,
    overheadCost,
    monthlyOverhead,
    totalProjectCost,
    basePrice,
    grossProfit,
    irapAmount,
    netProfit,
    vatAmount,
    finalPrice
  };
};
