import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ArtFormExport } from '../models/art.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {
  exportArtFormToExcel(data: ArtFormExport): void {
    const wb = XLSX.utils.book_new();

    // Cabeçalho com dados do formulário
    const headerData = [
      ['Nome da Empresa:', data.nomeEmpresa],
      ['Endereço:', data.endereco],
      ['CEP:', data.cep],
      ['Telefone:', data.telefone],
      ['CNPJ:', data.cnpj],
      ['Resumo do Contrato:', data.resumoContrato],
      ['Resumo da OS:', data.resumoOrdemServico],
      ['Número do Contrato:', data.numeroContrato],
      ['Número da Ordem de Serviço:', data.numeroOrdemServico],
      ['Número do Serviço:', data.numeroServico],
      ['Início:', data.inicio],
      ['Término:', data.termino],
      ['Valor da Obra/Serviço:', data.valorObraServico],
      ['Valor Total do Contrato:', data.valorTotalContrato],
      [], // linha vazia
      ['Profissional', 'Serviço Técnico', 'Código Serviço', 'Atividade', 'Código Atividade', 'Quantidade', 'Unidade de Medida', 'Descrição']
    ];

    // Dados da tabela
    const bodyData = data.professionals.flatMap(professional =>
      professional.services.map(service => [
        professional.professional?.name || '',
        service.service || '',
        service.service || '',
        service.activities?.map(a => a.name).join(', ') || '',
        service.activities?.map(a => a.code).join(', ') || '',
        service.quantity || '',
        service.unit || '',
        service.description || ''
      ])
    )

    // Junta cabeçalho + corpo
    const wsData = [...headerData, ...bodyData];

    // Cria planilha
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Exportação ART');

    // Salva
    XLSX.writeFile(wb, 'ART_Test_Export.xlsx');
  }
}
