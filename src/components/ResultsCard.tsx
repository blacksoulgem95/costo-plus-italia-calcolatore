
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Database } from 'lucide-react';
import { CalculationResults, Resource, ProjectData, CompanyData } from '@/types/calculator';
import { calculateHourlyCost } from '@/utils/calculationUtils';

interface ResultsCardProps {
  results: CalculationResults;
  projectData: ProjectData;
  companyData: CompanyData;
  resources: Resource[];
}

const ResultsCard: React.FC<ResultsCardProps> = ({ results, projectData, companyData, resources }) => {
  return (
    <div className="space-y-6">
      <Card className="cyberpunk-card border-accent/30 sticky top-4">
        <CardHeader className="bg-gradient-to-r from-accent/20 to-secondary/20 rounded-t-lg border-b border-accent/30">
          <CardTitle className="flex items-center gap-3 text-accent neon-text font-mono">
            <div className="cyberpunk-glow-green rounded p-1">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-lg">[05] COST ANALYSIS OUTPUT</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground font-mono">
            <span className="text-accent">&gt;</span> {projectData.name} - {projectData.durationMonths} {projectData.durationMonths === 1 ? 'mese' : 'mesi'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4 bg-card/50">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-mono">
              <span><span className="text-primary">&gt;</span> Costo Personale ({projectData.durationMonths} {projectData.durationMonths === 1 ? 'mese' : 'mesi'}):</span>
              <span className="font-medium text-accent neon-text">€{results.personnelCost.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
            </div>
            
            <div className="flex justify-between text-sm font-mono">
              <span><span className="text-secondary">&gt;</span> Overhead:</span>
              <span className="font-medium text-accent neon-text">€{results.overheadCost.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
            </div>
            
            <div className="flex justify-between text-sm font-mono">
              <span><span className="text-primary">&gt;</span> Costi Diretti:</span>
              <span className="font-medium text-accent neon-text">€{projectData.directCosts.toLocaleString('it-IT')}</span>
            </div>
            
            <Separator className="bg-border" />
            
            <div className="flex justify-between font-medium font-mono">
              <span><span className="text-accent">&gt;</span> Costo Totale Progetto:</span>
              <span className="text-secondary neon-text">€{results.totalProjectCost.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
            </div>
            
            <Separator className="bg-border" />
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-lg font-semibold font-mono">
                <span><span className="text-primary">&gt;</span> Prezzo Base (no IVA):</span>
                <span className="text-primary neon-text">€{results.basePrice.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
              </div>
              
              <div className="flex justify-between text-sm font-mono">
                <span><span className="text-secondary">&gt;</span> IVA ({companyData.vatRate}%):</span>
                <span className="text-accent neon-text">€{results.vatAmount.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
              </div>
              
              <div className="flex justify-between text-xl font-bold cyberpunk-card bg-accent/10 p-3 rounded-lg border-accent/30 font-mono">
                <span><span className="text-accent">&gt;</span> Prezzo Finale:</span>
                <span className="text-accent neon-text glitch-text" data-text={`€${results.finalPrice.toLocaleString('it-IT', {maximumFractionDigits: 0})}`}>€{results.finalPrice.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
              </div>
            </div>
            
            <Separator className="bg-border" />
            
            <div className="cyberpunk-card bg-secondary/10 p-3 rounded-lg border-secondary/30">
              <div className="flex justify-between text-sm font-medium font-mono">
                <span><span className="text-secondary">&gt;</span> Utile Lordo Stimato:</span>
                <span className="text-secondary neon-text">€{results.grossProfit.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between text-xs font-mono mt-1">
                <span><span className="text-accent">&gt;</span> Margine sul costo:</span>
                <span className="text-accent neon-text">{companyData.profitMargin}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resource breakdown */}
      <Card className="cyberpunk-card border-primary/30">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-t-lg border-b border-primary/30">
          <CardTitle className="flex items-center gap-3 text-primary neon-text font-mono">
            <div className="cyberpunk-glow rounded p-1">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-lg">RESOURCE BREAKDOWN</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-card/50">
          <div className="space-y-3">
            {resources.filter(r => (r.projectHours || 0) > 0).map((resource) => {
              const hourlyCost = calculateHourlyCost(resource);
              const resourceCost = hourlyCost * (resource.projectHours || 0);
              
              return (
                <div key={resource.id} className="flex justify-between items-center text-sm p-2 cyberpunk-card bg-accent/5 rounded border-accent/20 font-mono">
                  <div>
                    <div className="font-medium text-foreground">
                      <span className="text-accent">&gt;</span> {resource.name || 'Risorsa'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {resource.projectHours}h × €{hourlyCost.toLocaleString('it-IT', {maximumFractionDigits: 0})}/h
                    </div>
                  </div>
                  <div className="font-medium text-accent neon-text">
                    €{resourceCost.toLocaleString('it-IT', {maximumFractionDigits: 0})}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsCard;
