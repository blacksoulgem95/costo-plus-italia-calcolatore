
import React, { useState } from 'react';
import { Calculator, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Resource, CompanyData, FixedCosts, ProjectData, Projects } from '@/types/calculator';
import { calculateProjectCost } from '@/utils/calculationUtils';
import CompanyDataCard from '@/components/CompanyDataCard';
import ResourcesCard from '@/components/ResourcesCard';
import FixedCostsCard from '@/components/FixedCostsCard';
import ProjectDataCard from '@/components/ProjectDataCard';
import ResultsCard from '@/components/ResultsCard';
import Footer from '@/components/Footer';

const Index = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyType: 'srl',
    irapRate: 3.9,
    profitMargin: 25,
    vatRate: 22 // Valore predefinito, ma l'utente può impostarlo a 0 per esenti IVA
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

  const [projects, setProjects] = useState<Projects>({
    items: [
      {
        id: Date.now().toString(),
        name: '',
        directCosts: 0,
        durationMonths: 1
      }
    ],
    activeProjectId: Date.now().toString()
  });

  const activeProject = projects.items.find(p => p.id === projects.activeProjectId) || projects.items[0];

  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    if (resources.length === 0) {
      toast({
        title: "⚠️ SYSTEM ALERT",
        description: "Aggiungi almeno una risorsa per inizializzare il calcolo.",
        variant: "destructive"
      });
      return;
    }

    if (!activeProject.name.trim()) {
      toast({
        title: "⚠️ DATA MISSING", 
        description: "Nome progetto richiesto per procedere.",
        variant: "destructive"
      });
      return;
    }

    // Rimuoviamo questo controllo poiché ora le ore vengono calcolate automaticamente
    // Le risorse senza ore di progetto specificate useranno il calcolo full-time

    setShowResults(true);
    toast({
      title: "✓ CALCULATION COMPLETE",
      description: "Sistema di stima generato con successo."
    });
  };

  const calculateResults = () => {
    if (!showResults) return null;

    // Calcola overhead distribuito su tutti i mesi dei progetti
    return calculateProjectCost(resources, fixedCosts, projects.items, activeProject, companyData);
  };

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-background cyberpunk-grid-bg flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        {/* Cyberpunk Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 cyberpunk-pulse">
            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-8"></div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-6 relative z-10">
            <div className="cyberpunk-glow rounded-lg p-2 bg-card">
              <Calculator className="h-10 w-10 text-primary neon-text" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground glitch-text neon-text font-mono" data-text="COST-PLUS CALCULATOR">
              COST-PLUS CALCULATOR
            </h1>
            <div className="cyberpunk-glow-magenta rounded-lg p-2 bg-card">
              <Zap className="h-10 w-10 text-secondary neon-text" />
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-lg md:text-xl text-muted-foreground font-mono leading-relaxed">
              <span className="text-accent neon-text">&gt;</span> Sistema avanzato di stima costi e pricing per progetti digitali
            </p>
            <p className="text-base md:text-lg text-muted-foreground font-mono mt-2">
              <span className="text-secondary neon-text">&gt;</span> Calcolo automatizzato per definire prezzi competitivi e margini ottimali
            </p>
          </div>
          
          <div className="mt-6 p-4 cyberpunk-card rounded-lg inline-block border-destructive">
            <div className="flex items-center gap-2 text-destructive">
              <div className="w-2 h-2 bg-destructive rounded-full cyberpunk-pulse"></div>
              <p className="text-sm font-mono font-bold">
                SYSTEM WARNING: Strumento per stime approssimative - Consultare commercialista per calcoli definitivi
              </p>
            </div>
          </div>
          
          <div className="absolute inset-0 cyberpunk-pulse">
            <div className="h-px bg-gradient-to-r from-transparent via-secondary to-transparent mt-8"></div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Input Forms */}
              <div className="lg:col-span-2 space-y-8">
                <CompanyDataCard companyData={companyData} setCompanyData={setCompanyData} />
                <ResourcesCard resources={resources} setResources={setResources} />
                <FixedCostsCard fixedCosts={fixedCosts} setFixedCosts={setFixedCosts} />
                <ProjectDataCard projects={projects} setProjects={setProjects} />

                <div className="flex justify-center">
                  <Button 
                    onClick={handleCalculate}
                    size="lg"
                    className="cyberpunk-button text-background font-bold px-8 py-4 text-lg font-mono tracking-wider"
                  >
                    <Calculator className="h-6 w-6 mr-3" />
                    INIZIALIZZA CALCOLO
                  </Button>
                </div>
              </div>

              {/* Right Column - Results */}
              {showResults && results && (
                <ResultsCard 
                  results={results} 
                  projectData={activeProject} 
                  allProjects={projects.items}
                  companyData={companyData} 
                  resources={resources} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
