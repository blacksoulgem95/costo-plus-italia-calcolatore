
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur sticky top-4">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <CardTitle>💰 Risultati Stima</CardTitle>
          <CardDescription className="text-emerald-100">
            {projectData.name} - {projectData.durationMonths} {projectData.durationMonths === 1 ? 'mese' : 'mesi'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Costo Personale ({projectData.durationMonths} {projectData.durationMonths === 1 ? 'mese' : 'mesi'}):</span>
              <span className="font-medium">€{results.personnelCost.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Overhead:</span>
              <span className="font-medium">€{results.overheadCost.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Costi Diretti:</span>
              <span className="font-medium">€{projectData.directCosts.toLocaleString('it-IT')}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-medium">
              <span>Costo Totale Progetto:</span>
              <span>€{results.totalProjectCost.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
            </div>
            
            <Separator />
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-lg font-semibold text-blue-600">
                <span>Prezzo Base (no IVA):</span>
                <span>€{results.basePrice.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>IVA ({companyData.vatRate}%):</span>
                <span>€{results.vatAmount.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
              </div>
              
              <div className="flex justify-between text-xl font-bold text-green-600 bg-green-50 p-3 rounded-lg">
                <span>Prezzo Finale:</span>
                <span>€{results.finalPrice.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="bg-emerald-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm font-medium text-emerald-800">
                <span>Utile Lordo Stimato:</span>
                <span>€{results.grossProfit.toLocaleString('it-IT', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-600 mt-1">
                <span>Margine sul costo:</span>
                <span>{companyData.profitMargin}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resource breakdown */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">📊 Dettaglio Risorse</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {resources.filter(r => (r.projectHours || 0) > 0).map((resource) => {
              const hourlyCost = calculateHourlyCost(resource);
              const resourceCost = hourlyCost * (resource.projectHours || 0);
              
              return (
                <div key={resource.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{resource.name || 'Risorsa'}</div>
                    <div className="text-xs text-gray-500">
                      {resource.projectHours}h × €{hourlyCost.toLocaleString('it-IT', {maximumFractionDigits: 0})}/h
                    </div>
                  </div>
                  <div className="font-medium">
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
