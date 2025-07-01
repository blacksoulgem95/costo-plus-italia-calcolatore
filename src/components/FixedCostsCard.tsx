
import React from 'react';
import { Euro } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FixedCosts } from '@/types/calculator';
import { calculateTotalFixedCosts } from '@/utils/calculationUtils';

interface FixedCostsCardProps {
  fixedCosts: FixedCosts;
  setFixedCosts: (costs: FixedCosts) => void;
}

const FixedCostsCard: React.FC<FixedCostsCardProps> = ({ fixedCosts, setFixedCosts }) => {
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
            Totale Costi Fissi Annuali: €{calculateTotalFixedCosts(fixedCosts).toLocaleString('it-IT')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FixedCostsCard;
