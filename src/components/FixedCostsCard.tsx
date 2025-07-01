
import React from 'react';
import { Euro, Server } from 'lucide-react';
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
    rent: 'Affitto & Immobiliari',
    utilities: 'Utenze Energetiche',
    software: 'Software & Licenze',
    hardware: 'Hardware Systems',
    marketing: 'Marketing Protocol',
    administration: 'Admin Interface',
    insurance: 'Security Insurance',
    travel: 'Transport Costs',
    training: 'Skill Enhancement',
    other: 'Miscellaneous Data'
  };

  const icons = {
    rent: '🏢',
    utilities: '⚡',
    software: '💾',
    hardware: '🖥️',
    marketing: '📡',
    administration: '⚙️',
    insurance: '🛡️',
    travel: '🚀',
    training: '🧠',
    other: '📊'
  };

  return (
    <Card className="cyberpunk-card border-secondary/30">
      <CardHeader className="bg-gradient-to-r from-secondary/20 to-accent/20 rounded-t-lg border-b border-secondary/30">
        <CardTitle className="flex items-center gap-3 text-secondary neon-text font-mono">
          <div className="cyberpunk-glow-magenta rounded p-1">
            <Euro className="h-5 w-5" />
          </div>
          <span className="text-lg">[03] OVERHEAD COST ANALYSIS</span>
          <Server className="h-4 w-4 text-primary cyberpunk-pulse ml-auto" />
        </CardTitle>
        <CardDescription className="text-muted-foreground font-mono">
          <span className="text-secondary">&gt;</span> Costi operativi fissi dell'organizzazione
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-card/50">
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(fixedCosts).map(([key, value]) => {
            if (key === 'otherDescription') return null;
            
            return (
              <div key={key} className="space-y-2">
                <Label className="font-mono text-foreground flex items-center gap-2">
                  <span className="text-lg">{icons[key as keyof typeof icons]}</span>
                  <span className="text-accent">&gt;</span> {labels[key as keyof typeof labels]} (€)
                </Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setFixedCosts({
                    ...fixedCosts,
                    [key]: parseFloat(e.target.value) || 0
                  })}
                  className="cyberpunk-input font-mono"
                />
              </div>
            );
          })}
        </div>
        
        {fixedCosts.other > 0 && (
          <div className="mt-6">
            <Label className="font-mono text-foreground mb-2 block">
              <span className="text-accent">&gt;</span> Descrizione Dati Aggiuntivi
            </Label>
            <Input
              value={fixedCosts.otherDescription}
              onChange={(e) => setFixedCosts({
                ...fixedCosts,
                otherDescription: e.target.value
              })}
              placeholder="Specifica altri costi operativi..."
              className="cyberpunk-input font-mono"
            />
          </div>
        )}
        
        <div className="mt-6 p-4 cyberpunk-card border-secondary/50 rounded-lg bg-secondary/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full cyberpunk-pulse"></div>
            <p className="text-sm font-mono font-bold text-secondary neon-text">
              TOTAL OVERHEAD: €{calculateTotalFixedCosts(fixedCosts).toLocaleString('it-IT')} / anno
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FixedCostsCard;
