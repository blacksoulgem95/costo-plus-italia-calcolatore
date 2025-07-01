
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Resource, CompanyData, FixedCosts, ProjectData } from '@/types/calculator';
import { calculateProjectCost } from '@/utils/calculationUtils';
import CompanyDataCard from '@/components/CompanyDataCard';
import ResourcesCard from '@/components/ResourcesCard';
import FixedCostsCard from '@/components/FixedCostsCard';
import ProjectDataCard from '@/components/ProjectDataCard';
import ResultsCard from '@/components/ResultsCard';

const Index = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyType: 'srl',
    irapRate: 3.9,
    profitMargin: 25,
    vatRate: 22
  });

  const [resources, setResources] = useState<Resource[]>([]);
  
  const [fixedCosts, setFixedCosts] = useState<FixedCosts>({
    rent: 0,
    utilities: 0,
    software: 0,
    hardware: 0,
    marketing: 0,
    administration: 0,
    insurance: 0,
    travel: 0,
    training: 0,
    other: 0,
    otherDescription: ''
  });

  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    directCosts: 0,
    durationMonths: 1
  });

  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    if (resources.length === 0) {
      toast({
        title: "Attenzione",
        description: "Aggiungi almeno una risorsa per calcolare la stima.",
        variant: "destructive"
      });
      return;
    }

    if (!projectData.name.trim()) {
      toast({
        title: "Attenzione", 
        description: "Inserisci il nome del progetto.",
        variant: "destructive"
      });
      return;
    }

    const hasProjectHours = resources.some(r => (r.projectHours || 0) > 0);
    if (!hasProjectHours) {
      toast({
        title: "Attenzione",
        description: "Inserisci le ore previste per almeno una risorsa.",
        variant: "destructive"
      });
      return;
    }

    setShowResults(true);
    toast({
      title: "Calcolo completato!",
      description: "La stima è stata generata con successo."
    });
  };

  const results = showResults ? calculateProjectCost(resources, fixedCosts, projectData, companyData) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Cost-Plus Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Genera la tua stima costi e pricing per progetto. Un tool completo per calcolare i costi interni della tua agenzia e definire prezzi competitivi.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg inline-block">
            <p className="text-sm text-amber-800">
              ⚠️ Questo strumento fornisce stime approssimative. Consulta sempre il tuo commercialista per calcoli definitivi.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Input Forms */}
          <div className="lg:col-span-2 space-y-8">
            <CompanyDataCard companyData={companyData} setCompanyData={setCompanyData} />
            <ResourcesCard resources={resources} setResources={setResources} />
            <FixedCostsCard fixedCosts={fixedCosts} setFixedCosts={setFixedCosts} />
            <ProjectDataCard projectData={projectData} setProjectData={setProjectData} />

            <div className="flex justify-center">
              <Button 
                onClick={handleCalculate}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg px-8 py-3"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calcola Stima Progetto
              </Button>
            </div>
          </div>

          {/* Right Column - Results */}
          {showResults && results && (
            <ResultsCard 
              results={results} 
              projectData={projectData} 
              companyData={companyData} 
              resources={resources} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
