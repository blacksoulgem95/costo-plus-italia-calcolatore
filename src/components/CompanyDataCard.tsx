
import React from 'react';
import { Building2, Cpu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyData } from '@/types/calculator';

interface CompanyDataCardProps {
  companyData: CompanyData;
  setCompanyData: (data: CompanyData) => void;
}

const CompanyDataCard: React.FC<CompanyDataCardProps> = ({ companyData, setCompanyData }) => {
  return (
    <Card className="cyberpunk-card border-primary/30">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-lg border-b border-primary/30">
        <CardTitle className="flex items-center gap-3 text-primary neon-text font-mono">
          <div className="cyberpunk-glow rounded p-1">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-lg">[01] DATI AZIENDALI & FISCALI</span>
          <Cpu className="h-4 w-4 text-accent cyberpunk-pulse ml-auto" />
        </CardTitle>
        <CardDescription className="text-muted-foreground font-mono">
          <span className="text-accent">&gt;</span> Configurazione parametri base dell'organizzazione
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6 bg-card/50">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="companyType" className="font-mono text-foreground mb-2 block">
              <span className="text-primary">&gt;</span> Tipo Entità
            </Label>
            <Select value={companyData.companyType} onValueChange={(value: 'srl' | 'individual') => 
              setCompanyData({...companyData, companyType: value})}>
              <SelectTrigger className="cyberpunk-input font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="cyberpunk-card border-primary/50">
                <SelectItem value="srl" className="font-mono hover:bg-primary/10">SRL / SPA</SelectItem>
                <SelectItem value="individual" className="font-mono hover:bg-primary/10">Ditta Individuale</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="irapRate" className="font-mono text-foreground mb-2 block">
              <span className="text-secondary">&gt;</span> Aliquota IRAP (%)
            </Label>
            <Input
              type="number"
              step="0.1"
              value={companyData.irapRate}
              onChange={(e) => setCompanyData({...companyData, irapRate: parseFloat(e.target.value) || 0})}
              className="cyberpunk-input font-mono"
            />
          </div>
          <div>
            <Label htmlFor="profitMargin" className="font-mono text-foreground mb-2 block">
              <span className="text-accent">&gt;</span> Margine Profitto Target (%)
            </Label>
            <Input
              type="number"
              step="1"
              value={companyData.profitMargin}
              onChange={(e) => setCompanyData({...companyData, profitMargin: parseFloat(e.target.value) || 0})}
              className="cyberpunk-input font-mono"
            />
          </div>
          <div>
            <Label htmlFor="vatRate" className="font-mono text-foreground mb-2 block">
              <span className="text-primary">&gt;</span> Aliquota IVA (%)
            </Label>
            <Input
              type="number"
              step="1"
              value={companyData.vatRate}
              onChange={(e) => setCompanyData({...companyData, vatRate: parseFloat(e.target.value) || 0})}
              className="cyberpunk-input font-mono"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDataCard;
