var produtoCounter = 5;

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function adicionarProduto() {
    produtoCounter++;
    var tbody = document.getElementById('productsBody');
    var novaLinha = document.createElement('tr');
    novaLinha.setAttribute('data-product', produtoCounter);
    novaLinha.innerHTML =
        '<td><input type="text" class="produto-nome" value="Produto ' + produtoCounter + '" placeholder="Nome do produto"></td>' +
        '<td><input type="number" class="cvu" placeholder="0.00" step="0.01"></td>' +
        '<td><input type="number" class="pvu" placeholder="0.00" step="0.01"></td>' +
        '<td><input type="number" class="qtd" placeholder="0"></td>' +
        '<td>' +
        '<button class="btn-remove" onclick="removerProduto(this)">' +
        '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>' +
        '</svg>' +
        '</button>' +
        '</td>';
    tbody.appendChild(novaLinha);
}

function removerProduto(botao) {
    var linha = botao.closest('tr');
    var tbody = document.getElementById('productsBody');

    if (tbody.children.length <= 1) {
        alert('Você deve manter pelo menos um produto na lista!');
        return;
    }

    linha.remove();
}

function calcular() {
    var custoFixo = parseFloat(document.getElementById('custoFixo').value) || 0;

    if (custoFixo <= 0) {
        alert('Por favor, informe o custo fixo total!');
        return;
    }

    var produtos = [];
    var receitaTotal = 0;
    var custoVariavelTotal = 0;
    var linhas = document.querySelectorAll('#productsBody tr');

    linhas.forEach(function (linha) {
        var nome = linha.querySelector('.produto-nome').value || 'Sem nome';
        var cvu = parseFloat(linha.querySelector('.cvu').value) || 0;
        var pvu = parseFloat(linha.querySelector('.pvu').value) || 0;
        var qtd = parseFloat(linha.querySelector('.qtd').value) || 0;

        if (qtd > 0) {
            var receita = pvu * qtd;
            var custoVar = cvu * qtd;
            var mc = receita - custoVar;

            produtos.push({
                nome: nome,
                cvu: cvu,
                pvu: pvu,
                qtd: qtd,
                receita: receita,
                custoVar: custoVar,
                margemContrib: mc
            });

            receitaTotal += receita;
            custoVariavelTotal += custoVar;
        }
    });

    if (produtos.length === 0) {
        alert('Por favor, preencha os dados de pelo menos um produto!');
        return;
    }

    var margemContribuicaoTotal = receitaTotal - custoVariavelTotal;
    var percentualMC = (margemContribuicaoTotal / receitaTotal) * 100;
    var receitaPE = custoFixo / (percentualMC / 100);
    var resultado = margemContribuicaoTotal - custoFixo;
    var percentualResultado = (resultado / receitaTotal) * 100;
    var percentualCustoVar = (custoVariavelTotal / receitaTotal) * 100;

    var custoVarPE = receitaPE * (percentualCustoVar / 100);

    document.getElementById('receitaTotal').textContent = formatarMoeda(receitaTotal);
    document.getElementById('margemContribuicao').textContent = formatarMoeda(margemContribuicaoTotal);
    document.getElementById('percentualMC').textContent = percentualMC.toFixed(2) + '% da receita';
    document.getElementById('receitaPE').textContent = formatarMoeda(receitaPE);
    document.getElementById('resultado').textContent = formatarMoeda(resultado);
    document.getElementById('percentualResultado').textContent = percentualResultado.toFixed(2) + '% da receita';

    document.getElementById('dreReceita').textContent = formatarMoeda(receitaTotal);
    document.getElementById('dreCustoVar').textContent = formatarMoeda(custoVariavelTotal);
    document.getElementById('dreMargem').textContent = formatarMoeda(margemContribuicaoTotal);
    document.getElementById('dreCustoFixo').textContent = formatarMoeda(custoFixo);
    document.getElementById('dreResultado').textContent = formatarMoeda(resultado);

    document.getElementById('drePeReceita').textContent = formatarMoeda(receitaPE);
    document.getElementById('drePeCustoVar').textContent = formatarMoeda(custoVarPE);
    document.getElementById('drePeMargem').textContent = formatarMoeda(custoFixo);
    document.getElementById('drePeCustoFixo').textContent = formatarMoeda(custoFixo);
    document.getElementById('drePeResultado').textContent = formatarMoeda(0);

    var interpretacao = '<strong>📊 Análise Completa do Mix de Produtos:</strong><br><br>';

    interpretacao += '✅ Sua empresa teve uma receita total de <span class="highlight">' + formatarMoeda(receitaTotal) + '</span> no período, proveniente de ' + produtos.length + ' produto(s).<br><br>';

    interpretacao += '📈 A margem de contribuição foi de <span class="highlight">' + formatarMoeda(margemContribuicaoTotal) + '</span>, representando <span class="highlight">' + percentualMC.toFixed(2) + '%</span> da receita total.<br><br>';

    interpretacao += '🎯 Para atingir o <strong>Ponto de Equilíbrio</strong>, sua empresa precisa faturar <span class="highlight">' + formatarMoeda(receitaPE) + '</span>. Nesse ponto, todos os custos (fixos e variáveis) estarão cobertos e o resultado será zero.<br><br>';

    if (resultado > 0) {
        interpretacao += '💰 <strong>Parabéns!</strong> Sua empresa teve um <strong>LUCRO</strong> de <span class="highlight">' + formatarMoeda(resultado) + '</span> (' + percentualResultado.toFixed(2) + '% da receita). Você está <span class="highlight">' + formatarMoeda(receitaTotal - receitaPE) + '</span> acima do ponto de equilíbrio!<br><br>';
        interpretacao += '🎉 Isso significa que seu mix de produtos está gerando valor e sua operação é lucrativa. Continue monitorando para manter esse desempenho!';
    } else if (resultado < 0) {
        interpretacao += '⚠️ <strong>Atenção!</strong> Sua empresa teve um <strong>PREJUÍZO</strong> de <span class="highlight">' + formatarMoeda(Math.abs(resultado)) + '</span>. Você precisa aumentar a receita em <span class="highlight">' + formatarMoeda(receitaPE - receitaTotal) + '</span> para atingir o ponto de equilíbrio.<br><br>';
        interpretacao += '💡 <strong>Dicas:</strong> Considere aumentar o preço de venda, reduzir custos variáveis, aumentar o volume de vendas ou revisar os custos fixos.';
    } else {
        interpretacao += '⚖️ Sua empresa está exatamente no <strong>Ponto de Equilíbrio</strong>. A receita cobre todos os custos, resultando em lucro zero.<br><br>';
        interpretacao += '📌 Este é o limite entre lucro e prejuízo. Qualquer aumento nas vendas resultará em lucro!';
    }

    document.getElementById('interpretation').innerHTML = interpretacao;
    document.getElementById('results').classList.add('show');

    setTimeout(function () {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function limpar() {
    document.getElementById('custoFixo').value = '';

    var linhas = document.querySelectorAll('#productsBody tr');
    linhas.forEach(function (linha, index) {
        linha.querySelector('.produto-nome').value = 'Produto ' + (index + 1);
        linha.querySelector('.cvu').value = '';
        linha.querySelector('.pvu').value = '';
        linha.querySelector('.qtd').value = '';
    });

    document.getElementById('results').classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            calcular();
        }
    });
});