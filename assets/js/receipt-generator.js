/* ==========================================================================
   DYNAMIC PDF RECEIPT GENERATOR - CRM ARM
   ========================================================================== */

window.generateReceiptPDF = function(member, quota) {
    if (!window.jspdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            runPDFGeneration(member, quota);
        };
        script.onerror = () => {
            alert("Não foi possível carregar a biblioteca PDF. Verifique a sua ligação à internet.");
        };
        document.body.appendChild(script);
    } else {
        runPDFGeneration(member, quota);
    }
};

function runPDFGeneration(member, quota) {
    const { jsPDF } = window.jspdf;
    
    // Create an A5 sized document (148mm wide x 210mm high)
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a5'
    });

    // 1. Header background (Premium Dark Blue)
    doc.setFillColor(11, 15, 25);
    doc.rect(0, 0, 148, 32, 'F');

    // 2. Header Text
    doc.setTextColor(0, 210, 255); // Cyan
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ASSOCIAÇÃO DE RADIOAMADORES MARIENSES", 12, 12);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("NIF: 512065097 | E-mail: geral@cu1arm.com | Site: www.cu1arm.com", 12, 19);
    doc.text("Sede: Aeroporto de Santa Maria (LPAZ), 9580-909 Vila do Porto", 12, 23);

    // 3. Receipt Identity
    doc.setTextColor(11, 15, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(`RECIBO DE QUOTA N.º ${quota.numero_recibo}`, 12, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const formattedDate = quota.data_pagamento ? quota.data_pagamento.split('-').reverse().join('/') : new Date().toLocaleDateString('pt-PT');
    doc.text(`Data de Liquidação: ${formattedDate}`, 12, 51);

    // Divider Line
    doc.setDrawColor(210, 215, 223);
    doc.setLineWidth(0.3);
    doc.line(12, 55, 136, 55);

    // 4. Beneficiary Info (Sócio)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    doc.text("DADOS DO ASSOCIADO:", 12, 63);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(`Nome do Sócio: ${member.nome}`, 12, 70);
    doc.text(`N.º de Associado: Sócio N.º ${member.numero_socio}`, 12, 75);
    doc.text(`NIF: ${member.nif}`, 12, 80);
    doc.text(`IBAN: ${member.iban || 'N/D'}`, 12, 85);

    // Divider Line
    doc.line(12, 90, 136, 90);

    // 5. Itemized Table
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIÇÃO", 12, 97);
    doc.text("VALOR", 112, 97);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Liquidação de Quota Anual Efetiva (Ano: ${quota.ano})`, 12, 106);
    doc.text(`${parseFloat(quota.valor).toFixed(2)} EUR`, 112, 106);

    doc.line(12, 112, 136, 112);

    // Total Box
    doc.setFillColor(242, 245, 248);
    doc.rect(80, 117, 56, 12, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("PAGO:", 85, 125);
    doc.text(`${parseFloat(quota.valor).toFixed(2)} EUR`, 110, 125);

    // 6. Terms and signature
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(130, 135, 145);
    doc.text("Este recibo digital comprova o recebimento do valor referido nos termos legais.", 12, 155);
    doc.text("Gerado eletronicamente e isento de assinatura física sob a plataforma ARM CRM.", 12, 159);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(70, 75, 85);
    doc.text("A Direcção da ARM", 96, 149);
    
    // Draw signature line
    doc.setDrawColor(150, 155, 165);
    doc.line(90, 144, 136, 144);

    // Download PDF file
    doc.save(`Recibo_Quota_${quota.ano}_Socio_${member.numero_socio}.pdf`);
};

window.generateAnnualReportPDF = function(year, data) {
    if (!window.jspdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            runAnnualReportGeneration(year, data);
        };
        script.onerror = () => {
            alert("Não foi possível carregar a biblioteca PDF. Verifique a sua ligação à internet.");
        };
        document.body.appendChild(script);
    } else {
        runAnnualReportGeneration(year, data);
    }
};

function runAnnualReportGeneration(year, data) {
    const { jsPDF } = window.jspdf;
    
    // Create an A4 sized document (210mm wide x 297mm high)
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const currentYear = parseInt(year);

    // Filter accounting transactions for the specified year
    const transactions = data.contabilidade.filter(t => {
        if (!t.data) return false;
        const tYear = new Date(t.data).getFullYear();
        return tYear === currentYear;
    });

    // Calculate totals
    let totalRevenue = 0;
    let totalExpenses = 0;
    const revenueByCategory = {};
    const expensesByCategory = {};

    transactions.forEach(t => {
        const val = parseFloat(t.valor) || 0;
        if (t.tipo === 'receita') {
            totalRevenue += val;
            revenueByCategory[t.categoria] = (revenueByCategory[t.categoria] || 0) + val;
        } else if (t.tipo === 'despesa') {
            totalExpenses += val;
            expensesByCategory[t.categoria] = (expensesByCategory[t.categoria] || 0) + val;
        }
    });

    const netResult = totalRevenue - totalExpenses;

    // Draw header (Premium Dark Blue)
    doc.setFillColor(11, 15, 25);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(0, 210, 255); // Cyan
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ASSOCIAÇÃO DE RADIOAMADORES MARIENSES (ARM)", 15, 15);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`NIF: 512065097 | E-mail: geral@cu1arm.com | LPAZ Santa Maria, Açores`, 15, 23);
    doc.text(`Relatório de Contas & Balanço Financeiro - Exercício de ${currentYear}`, 15, 28);

    // Section title
    doc.setTextColor(11, 15, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("1. RESUMO FINANCEIRO ANUAL", 15, 52);

    // Summary Box
    doc.setFillColor(242, 245, 248);
    doc.rect(15, 58, 180, 24, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text("TOTAL RECEITAS", 25, 66);
    doc.text("TOTAL DESPESAS", 85, 66);
    doc.text("BALANÇO LÍQUIDO", 145, 66);

    doc.setFontSize(13);
    doc.setTextColor(40, 167, 69); // Green for income
    doc.text(`+${totalRevenue.toFixed(2)} EUR`, 25, 74);
    
    doc.setTextColor(220, 53, 69); // Red for expenses
    doc.text(`-${totalExpenses.toFixed(2)} EUR`, 85, 74);

    if (netResult >= 0) {
        doc.setTextColor(40, 167, 69);
        doc.text(`+${netResult.toFixed(2)} EUR`, 145, 74);
    } else {
        doc.setTextColor(220, 53, 69);
        doc.text(`${netResult.toFixed(2)} EUR`, 145, 74);
    }

    // Section 2: Detailed breakdown
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(11, 15, 25);
    doc.text("2. COMPOSIÇÃO DOS MOVIMENTOS POR CATEGORIA", 15, 96);

    doc.setFontSize(10);
    doc.text("Receitas por Categoria:", 15, 104);
    let yPos = 112;
    doc.setFont("helvetica", "normal");
    const revCats = Object.keys(revenueByCategory);
    if (revCats.length === 0) {
        doc.text("Nenhuma receita registada neste período.", 20, yPos);
        yPos += 8;
    } else {
        revCats.forEach(cat => {
            doc.text(`• ${cat}`, 20, yPos);
            doc.text(`${revenueByCategory[cat].toFixed(2)} EUR`, 140, yPos);
            yPos += 7;
        });
    }

    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Despesas por Categoria:", 15, yPos);
    yPos += 8;
    doc.setFont("helvetica", "normal");
    const expCats = Object.keys(expensesByCategory);
    if (expCats.length === 0) {
        doc.text("Nenhuma despesa registada neste período.", 20, yPos);
        yPos += 8;
    } else {
        expCats.forEach(cat => {
            doc.text(`• ${cat}`, 20, yPos);
            doc.text(`${expensesByCategory[cat].toFixed(2)} EUR`, 140, yPos);
            yPos += 7;
        });
    }

    // Section 3: List of transactions
    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("3. LIVRO DE CAIXA COMPLETO", 15, yPos);
    yPos += 8;

    // Draw table headers
    doc.setFontSize(9.5);
    doc.text("Data", 15, yPos);
    doc.text("Tipo", 38, yPos);
    doc.text("Categoria", 58, yPos);
    doc.text("Descrição", 95, yPos);
    doc.text("Valor", 175, yPos);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, yPos + 2, 195, yPos + 2);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    if (transactions.length === 0) {
        doc.text("Nenhum movimento registado neste exercício.", 15, yPos);
    } else {
        // Sort transactions by date ascending
        const sortedTrans = [...transactions].sort((a,b) => new Date(a.data) - new Date(b.data));
        sortedTrans.forEach(t => {
            // Check if we are running out of page height (limit to 275mm)
            if (yPos > 265) {
                doc.addPage();
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8.5);
                yPos = 20; // reset yPos on new page
                
                // Draw headers again
                doc.setFont("helvetica", "bold");
                doc.text("Data", 15, yPos);
                doc.text("Tipo", 38, yPos);
                doc.text("Categoria", 58, yPos);
                doc.text("Descrição", 95, yPos);
                doc.text("Valor", 175, yPos);
                doc.line(15, yPos + 2, 195, yPos + 2);
                yPos += 8;
                doc.setFont("helvetica", "normal");
            }

            const formattedDate = t.data ? t.data.split('-').reverse().join('/') : '';
            doc.text(formattedDate, 15, yPos);
            doc.text(t.tipo.toUpperCase(), 38, yPos);
            doc.text(t.categoria, 58, yPos);
            
            // Truncate description if too long to avoid overlap
            let desc = t.descricao || '';
            if (desc.length > 42) {
                desc = desc.substring(0, 39) + '...';
            }
            doc.text(desc, 95, yPos);

            const valueText = `${parseFloat(t.valor).toFixed(2)} EUR`;
            if (t.tipo === 'receita') {
                doc.text(`+${valueText}`, 175, yPos);
            } else {
                doc.text(`-${valueText}`, 175, yPos);
            }

            doc.line(15, yPos + 2, 195, yPos + 2);
            yPos += 6;
        });
    }

    // Check if space left for signature block, otherwise add page
    if (yPos > 245) {
        doc.addPage();
        yPos = 30;
    } else {
        yPos += 15;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    doc.text("Órgãos Sociais da Direção da ARM:", 15, yPos);

    yPos += 16;
    doc.line(15, yPos, 80, yPos);
    doc.line(125, yPos, 190, yPos);
    
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text("O Presidente da Direção", 32, yPos + 5);
    doc.text("O Tesoureiro da Direção", 142, yPos + 5);

    // Save annual report PDF
    doc.save(`Relatorio_Contas_Anual_${currentYear}_ARM.pdf`);
}
