
import React from 'react';
import { Building2 } from 'lucide-react';
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
  );
};

export default CompanyDataCard;
