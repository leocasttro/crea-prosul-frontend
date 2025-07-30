import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { ArtFormExport } from '../models/art.model';

@Injectable({ providedIn: 'root' })
export class ExcelExportService {
  exportArtFormToExcel(data: ArtFormExport): void {
    const wb = XLSX.utils.book_new();

    const wsData = [
      ['Obrigatório preenchimento de todos os campos'],
      [],
      ['Serviço', data.numeroServico || ''],
      ['Coordenador do Projeto:', data.coordenadorProjeto || ''],
      ['Empresa Executora:', data.nomeEmpresa || ''],
      [],
      ['CONTRATANTE'],
      ['Nome da Empresa:', data.nomeEmpresa || ''],
      ['Rua, Nº, Bairro:', data.endereco || ''],
      ['CEP:', data.cep || ''],
      ['Telefone:', data.telefone || ''],
      ['CNPJ:', data.cnpj || ''],
      [],
      ['LOCAL DA OBRA/SERVIÇO'],
      ['Nome da Empresa:', data.nomeEmpresaObra || ''],
      ['Rua, Nº, Bairro:', data.enderecoObra || ''],
      ['CEP:', data.cepObra || ''],
      ['Telefone:', data.telefoneObra || ''],
      ['CNPJ:', data.cnpjObra || ''],
      [],
      ['Participação técnica'],
      [],
      ['RESUMO DO CONTRATO'],
      ['Escopo do Contrato:', data.resumoContrato],
      [],
      [],
      [],
      ['Escopo da Ordem de Serviço:', data.resumoOrdemServico],
      [],
      [],
      [],
      ['Quantidade:', data.quantidade || '', '', ''],
      ['Nº do Contrato:', data.numeroContrato || '', '', ''],
      ['Nº da Ordem de Serviço:', data.numeroOrdemServico || '', '', ''],
      ['Nº do Serviço:', data.numeroServico || '', '', ''],
      ['Início:', data.inicio || '', 'Término:', data.termino || ''],
      ['Valor da Obra/Serviço:', data.valorObraServico || '', '', ''],
      ['Valor Total do Contrato:', data.valorTotalContrato || '', '', ''],
      [],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
      { s: { r: 13, c: 0 }, e: { r: 13, c: 1 } },
      { s: { r: 20, c: 0 }, e: { r: 20, c: 1 } },
      { s: { r: 22, c: 0 }, e: { r: 22, c: 1 } }
    ];

    const thin = { style: 'thin', color: { rgb: '000000' } };
    const medium = { style: 'medium', color: { rgb: '000000' } };
    const range = XLSX.utils.decode_range(ws['!ref']!);

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const addr = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[addr]) continue;

        ws[addr].s = {
          font: { name: 'Calibri', sz: 11 },
          alignment: { vertical: 'center', horizontal: 'left', wrapText: true },
          border: { top: thin, bottom: thin, left: thin, right: thin }
        };

        if ([0, 6, 13, 22].includes(row)) {
          ws[addr].s = {
            font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '808080' } },
            alignment: { vertical: 'center', horizontal: 'center' },
            border: { top: medium, bottom: medium, left: medium, right: medium }
          };
        }
      }
    }

    ws['!cols'] = [
      { wch: 30 }, { wch: 40 }, { wch: 10 },
      { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 40 }
    ];

    ws['!rows'] = Array(range.e.r + 1).fill({ hpx: 22 });
    ws['!rows'][7] = { hpx: 50 };
    ws['!rows'][8] = { hpx: 50 };
    ws['!rows'][14] = { hpx: 50 };
    ws['!rows'][15] = { hpx: 50 };
    ws['!rows'][23] = { hpx: 150 };
    ws['!rows'][27] = { hpx: 150 };

    // Segunda aba
    const wsData2: string[][] = [
      ['Profissional', 'CREA', 'Serviço Técnico', 'Código Serviço', 'Atividade', 'Código Atividade', 'Quantidade', 'Unidade de Medida', 'Descrição'],
    ];

    const bodyData: string[][] = data.professionals.flatMap(prof =>
      prof.services.map(service => [
        (prof.professional?.name || '').toString(),
        (prof.professional?.registrationNumber || '').toString(),
        (service.service || '').toString(),
        (service.codigoServico || '').toString(),
        (service.activities?.map(a => a.name).join(', ') || '').toString(),
        (service.activities?.map(a => a.code).join(', ') || '').toString(),
        (service.quantity !== undefined && service.quantity !== null ? service.quantity.toString() : ''),
        (service.unit || '').toString(),
        (service.description || '').toString()
      ])
    );

    wsData2.push(...bodyData);

    const ws2 = XLSX.utils.aoa_to_sheet(wsData2);
    const range2 = XLSX.utils.decode_range(ws2['!ref']!);

    for (let row = range2.s.r; row <= range2.e.r; row++) {
      for (let col = range2.s.c; col <= range2.e.c; col++) {
        const addr = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws2[addr]) continue;

        ws2[addr].s = {
          font: { name: 'Calibri', sz: 11 },
          alignment: { vertical: 'center', horizontal: 'left', wrapText: true },
          border: { top: thin, bottom: thin, left: thin, right: thin }
        };

        if (row === 0) {
          ws2[addr].s = {
            font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '4F81BD' } },
            alignment: { vertical: 'center', horizontal: 'center' },
            border: { top: thin, bottom: thin, left: thin, right: thin }
          };
        }
      }
    }

    ws2['!cols'] = [
      { wch: 25 }, { wch: 25 }, { wch: 15 },
      { wch: 30 }, { wch: 20 }, { wch: 12 },
      { wch: 20 }, { wch: 40 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Dados_do_Contrato');
    XLSX.utils.book_append_sheet(wb, ws2, 'Profissionais');
    XLSX.writeFile(wb, 'ART_Test_Export.xlsx');
  }
}
