import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ArtFormExport } from '../models/art.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {
  exportArtFormToExcel(data: ArtFormExport): void {
    const wb = XLSX.utils.book_new();

    // Create a single sheet for the form data (Código_da_Atividade style)
    const wsData = [
      ['Profissional', 'Serviço Técnico', 'Código Serviço', 'Atividade', 'Código Atividade', 'Quantidade', 'Unidade de Medida', 'Descrição'],
      ...data.professionals.flatMap(professional =>
        professional.services.map(service => [
          professional.professional?.name || '',
          professional.technicalServices.find(ts => ts.codigoServicoTecnico === service.service)?.nomeServicoTecnico || service.service || '',
          service.service || '',
          service.activityIds
            .map(id => service.activities.find(a => a.id === id)?.name)
            .filter(name => name)
            .join(', '),
          service.activityIds
            .map(id => service.activities.find(a => a.id === id)?.code)
            .filter(code => code)
            .join(', '),
          service.quantity || '',
          service.unit || '',
          service.description || ''
        ])
      )
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Código_da_Atividade');

    // Export the file
    XLSX.writeFile(wb, 'ART_Test_Export.xlsx');
  }
}
