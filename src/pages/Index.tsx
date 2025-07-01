
import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Building2, Users, Euro, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Resource {
  id: string;
  name: string;
  contractType: 'employee' | 'cococo' | 'partitaiva';
  netSalary?: number;
  grossSalary?: number;
  compensation?: number;
  billableHours: number;
  projectHours?: number;
}

interface CompanyData {
  companyType: 'srl' | 'individual';
  irapRate: number;
  profitMargin: number;
  vatRate: number;
}

interface FixedCosts {
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

interface ProjectData {
  name: string;
  directCosts: number;
}

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
    directCosts: 0
  });

  const [showResults, setShowResults] = useState(false);

  const addResource = () => {
    const newResource: Resource = {
      id: Date.now().toString(),
      name: '',
      contractType: 'employee',
      billableHours: 1320
    };
    setResources([...resources, newResource]);
  };

  const removeResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const updateResource = (id: string, field: keyof Resource, value: any) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const calculateGrossSalary = (netSalary: number): number => {
    // Simplified calculation for demonstration
    return netSalary * 1.4; // Approximate conversion
  };

  const calculateEmployeeCost = (resource: Resource): number => {
    let grossSalary = resource.grossSalary || 0;
    if (!grossSalary && resource.netSalary) {
      grossSalary = calculateGrossSalary(resource.netSalary);
    }
    
    // Add employer contributions (simplified)
    const employerContributions = grossSalary * 0.35; // Approximate 35%
    return (grossSalary + employerContributions) * 12; // Annual cost
  };

  const calculateHourlyCost = (resource: Resource): number => {
    if (resource.contractType === 'partitaiva') {
      return (resource.compensation || 0) * 12 / resource.billableHours;
    }
    return calculateEmployeeCost(resource) / resource.billableHours;
  };

  const calculateTotalFixedCosts = (): number => {
    return Object.entries(fixedCosts)
      .filter(([key]) => key !== 'otherDescription')
      .reduce((sum, [, value]) => sum + (value as number), 0);
  };

  const calculateProjectCost = () => {
    const personnelCost = resources.reduce((sum, resource) => {
      const hourlyCost = calculateHourlyCost(resource);
      return sum + (hourlyCost * (resource.projectHours || 0));
    }, 0);

    const totalBillableHours = resources.reduce((sum, r) => sum + r.billableHours, 0);
    const overheadCost = totalBillableHours > 0 
      ? (calculateTotalFixedCosts() / totalBillableHours) * resources.reduce((sum, r) => sum + (r.projectHours || 0), 0)
      : 0;

    const totalProjectCost = personnelCost + overheadCost + projectData.directCosts;
    const basePrice = totalProjectCost * (1 + companyData.profitMargin / 100);
    const vatAmount = basePrice * (companyData.vatRate / 100);
    const finalPrice = basePrice + vatAmount;

    return {
      personnelCost,
      overheadCost,
      totalProjectCost,
      basePrice,
      vatAmount,
      finalPrice,
      grossProfit: basePrice - totalProjectCost
    };
  };

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

  const results = showResults ? calculateProjectCost() : null;

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
            {/* Company Data */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  1. Dati Aziendali e Fiscali
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Informazioni base sulla tua attività
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyType">Tipo di Azienda</Label>
                    <Select value={companyData.companyType} onValueChange={(value: 'srl' | 'individual') => 
                      setCompanyData({...companyData, companyType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="srl">SRL / SPA</SelectItem>
                        <SelectItem value="individual">Ditta Individuale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="irapRate">Aliquota IRAP (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={companyData.irapRate}
                      onChange={(e) => setCompanyData({...companyData, irapRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profitMargin">Margine di Profitto Desiderato (%)</Label>
                    <Input
                      type="number"
                      step="1"
                      value={companyData.profitMargin}
                      onChange={(e) => setCompanyData({...companyData, profitMargin: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vatRate">Aliquota IVA (%)</Label>
                    <Input
                      type="number"
                      step="1"
                      value={companyData.vatRate}
                      onChange={(e) => setCompanyData({...companyData, vatRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  2. Risorse e Personale
                </CardTitle>
                <CardDescription className="text-green-100">
                  Aggiungi i membri del tuo team
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {resources.map((resource, index) => (
                    <div key={resource.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">Risorsa {index + 1}</Badge>
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => removeResource(resource.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nome/Ruolo</Label>
                          <Input
                            value={resource.name}
                            onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                            placeholder="es. Sviluppatore Senior"
                          />
                        </div>
                        <div>
                          <Label>Tipo Contratto</Label>
                          <Select value={resource.contractType} onValueChange={(value) => 
                            updateResource(resource.id, 'contractType', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="employee">Dipendente</SelectItem>
                              <SelectItem value="cococo">Co.Co.Co.</SelectItem>
                              <SelectItem value="partitaiva">Partita IVA</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {resource.contractType !== 'partitaiva' ? (
                          <>
                            <div>
                              <Label>Stipendio Netto Mensile (€)</Label>
                              <Input
                                type="number"
                                value={resource.netSalary || ''}
                                onChange={(e) => updateResource(resource.id, 'netSalary', parseFloat(e.target.value) || undefined)}
                              />
                            </div>
                            <div>
                              <Label>Stipendio Lordo Mensile (€)</Label>
                              <Input
                                type="number"
                                value={resource.grossSalary || ''}
                                onChange={(e) => updateResource(resource.id, 'grossSalary', parseFloat(e.target.value) || undefined)}
                              />
                            </div>
                          </>
                        ) : (
                          <div>
                            <Label>Compenso Mensile (€)</Label>
                            <Input
                              type="number"
                              value={resource.compensation || ''}
                              onChange={(e) => updateResource(resource.id, 'compensation', parseFloat(e.target.value) || undefined)}
                            />
                          </div>
                        )}
                        
                        <div>
                          <Label>Ore Fatturabili Annue</Label>
                          <Input
                            type="number"
                            value={resource.billableHours}
                            onChange={(e) => updateResource(resource.id, 'billableHours', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Ore Stimate su Progetto</Label>
                          <Input
                            type="number"
                            value={resource.projectHours || ''}
                            onChange={(e) => updateResource(resource.id, 'projectHours', parseFloat(e.target.value) || undefined)}
                            placeholder="Ore dedicate al progetto"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addResource} className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Risorsa
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fixed Costs */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5" />
                  3. Costi Fissi Annuali
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Costi operativi generali dell'azienda
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(fixedCosts).map(([key, value]) => {
                    if (key === 'otherDescription') return null;
                    
                    const labels = {
                      rent: 'Affitto e Spese Immobiliari',
                      utilities: 'Utenze',
                      software: 'Software e Licenze',
                      hardware: 'Hardware',
                      marketing: 'Marketing',
                      administration: 'Amministrazione',
                      insurance: 'Assicurazioni',
                      travel: 'Spese Viaggio',
                      training: 'Formazione',
                      other: 'Altro'
                    };
                    
                    return (
                      <div key={key}>
                        <Label>{labels[key as keyof typeof labels]} (€)</Label>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => setFixedCosts({
                            ...fixedCosts,
                            [key]: parseFloat(e.target.value) || 0
                          })}
                        />
                      </div>
                    );
                  })}
                </div>
                
                {fixedCosts.other > 0 && (
                  <div className="mt-4">
                    <Label>Descrizione Altri Costi</Label>
                    <Input
                      value={fixedCosts.otherDescription}
                      onChange={(e) => setFixedCosts({
                        ...fixedCosts,
                        otherDescription: e.target.value
                      })}
                      placeholder="Specifica altri costi..."
                    />
                  </div>
                )}
                
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">
                    Totale Costi Fissi Annuali: €{calculateTotalFixedCosts().toLocaleString('it-IT')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Data */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  4. Dati del Progetto
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Informazioni specifiche del progetto da stimare
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="projectName">Nome Progetto</Label>
                  <Input
                    value={projectData.name}
                    onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                    placeholder="es. Sviluppo Piattaforma E-commerce"
                  />
                </div>
                <div>
                  <Label htmlFor="directCosts">Costi Diretti Specifici (€)</Label>
                  <Input
                    type="number"
                    value={projectData.directCosts}
                    onChange={(e) => setProjectData({...projectData, directCosts: parseFloat(e.target.value) || 0})}
                    placeholder="Licenze, API, hardware dedicato..."
                  />
                </div>
              </CardContent>
            </Card>

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
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur sticky top-4">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                  <CardTitle>💰 Risultati Stima</CardTitle>
                  <CardDescription className="text-emerald-100">
                    {projectData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Costo Personale:</span>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
