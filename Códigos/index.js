// Função para salvar informações do carro no localStorage
function saveCarInfo() {
    const carro = {
        dadosCarro: {
            nomeMotorista: document.getElementById("nomeMotorista").value || '',
            marcaCarro: document.getElementById("marcaCarro").value || '',
            modeloCarro: document.getElementById("modeloCarro").value || '',
            anoCarro: parseInt(document.getElementById("anoCarro").value) || 0,
            valorCarro: parseFloat(document.getElementById("valorCarro").value) || 0,
            valorEstimadoVenda: parseFloat(document.getElementById("valorEstimadoVenda").value) || 0,
            vidaUtilEstimadaAnos: parseFloat(document.getElementById("vidaUtilEstimadaAnos").value) || 0,
            seguroCarro: parseFloat(document.getElementById("seguroCarro").value) || 0,
            tributosCarro: parseFloat(document.getElementById("tributosCarro").value) || 0,
            valorLitroCombustivel: parseFloat(document.getElementById("valorLitroCombustivel").value) || 0,
        },
        manutencaoPreventiva: {
            trocaOleo: parseFloat(document.getElementById("trocaOleo").value) || 0,
            trocaFiltroCombustivel: parseFloat(document.getElementById("trocaFiltroCombustivel").value) || 0,
            trocaFiltroAr: parseFloat(document.getElementById("trocaFiltroAr").value) || 0,
            alinhamentoBalanceamento: parseFloat(document.getElementById("alinhamentoBalanceamento").value) || 0,
            revisaoVelas: parseFloat(document.getElementById("revisaoVelas").value) || 0,
            revisaoFreios: parseFloat(document.getElementById("revisaoFreios").value) || 0,
            revisaoSuspensao: parseFloat(document.getElementById("revisaoSuspensao").value) || 0,
            trocaPneus: parseFloat(document.getElementById("trocaPneus").value) || 0
        },
        manutencaoCorretiva: {
            trocaEmbreagem: parseFloat(document.getElementById("trocaEmbreagem").value) || 0,
            trocaAmortecedores: parseFloat(document.getElementById("trocaAmortecedores").value) || 0,
            reparoSistemaFreios: parseFloat(document.getElementById("reparoSistemaFreios").value) || 0,
            trocaCorreiaDentada: parseFloat(document.getElementById("trocaCorreiaDentada").value) || 0,
            trocaBateria: parseFloat(document.getElementById("trocaBateria").value) || 0,
            reparoMotor: parseFloat(document.getElementById("reparoMotor").value) || 0,
            outros: parseFloat(document.getElementById("outros").value) || 0
        }
    };

    localStorage.setItem("carroJson", JSON.stringify(carro));
    alert("Informações sobre o veículo cadastradas com sucesso!");
    navigateTo('tela-inicial');
}

// Função para salvar informações de Km/l e Km estimado no localStorage
function saveKmInfo() {
    const kmInfo = {
        kmPorLitro: parseFloat(document.getElementById("kmPorLitro").value) || 0,
        kmEstimadoRodadosAno: parseFloat(document.getElementById("kmEstimadoRodadosAno").value) || 0
    };

    localStorage.setItem("kmJson", JSON.stringify(kmInfo));
    alert("Informações sobre Km/L e Km rodados por ano cadastradas com sucesso!");
    navigateTo('tela-inicial');
}

// Função para salvar informações da corrida no localStorage
function saveCorridaInfo() {
    const corridaInfo = {
        valorViagem: parseFloat(document.getElementById("valorViagem").value) || 0,
        taxaApp: parseFloat(document.getElementById("taxaApp").value) || 0,
        kmViagem: parseFloat(document.getElementById("kmViagem").value) || 0
    };

    localStorage.setItem("corridaJson", JSON.stringify(corridaInfo));
    alert("Informações sobre a corrida cadastradas com sucesso!");
    navigateTo('tela-inicial');
}

function navigateTo(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    // Carregar os dados nos inputs ao navegar para a tela correspondente
    if (screenId === 'cadastrar-carro') {
        carregarCarroDados();
    } else if (screenId === 'cadastrar-km') {
        carregarKmDados();
    } else if (screenId === 'cadastrar-corrida') {
        carregarCorridaDados();
    }
}


// Função para calcular e gerar o relatório da viagem
function calcularRelatorio() {
    navigateTo('relatorio-viagem');

    // Recupera os dados do localStorage
    const carro = JSON.parse(localStorage.getItem("carroJson"));
    const kmInfo = JSON.parse(localStorage.getItem("kmJson"));
    const corridaInfo = JSON.parse(localStorage.getItem("corridaJson"));

    // Verifica se os dados existem
    if (!carro || !kmInfo || !corridaInfo) {
        alert("Por favor, cadastre todas as informações antes de gerar o relatório.");
        navigateTo('tela-inicial');
        return;
    }

    // Calcula os valores
    let valorLiquido = corridaInfo.valorViagem - corridaInfo.taxaApp;
    let depreciacao = (carro.dadosCarro.valorCarro - carro.dadosCarro.valorEstimadoVenda) / carro.dadosCarro.vidaUtilEstimadaAnos;

    let manutencaoPreventivaSoma = carro.manutencaoPreventiva.trocaOleo +
        carro.manutencaoPreventiva.trocaFiltroCombustivel +
        carro.manutencaoPreventiva.trocaFiltroAr +
        carro.manutencaoPreventiva.alinhamentoBalanceamento +
        carro.manutencaoPreventiva.revisaoVelas +
        carro.manutencaoPreventiva.revisaoFreios +
        carro.manutencaoPreventiva.revisaoSuspensao +
        carro.manutencaoPreventiva.trocaPneus;

    let manutencaoCorretivaSoma = carro.manutencaoCorretiva.trocaEmbreagem +
        carro.manutencaoCorretiva.trocaAmortecedores +
        carro.manutencaoCorretiva.reparoSistemaFreios +
        carro.manutencaoCorretiva.trocaCorreiaDentada +
        carro.manutencaoCorretiva.trocaBateria +
        carro.manutencaoCorretiva.reparoMotor +
        carro.manutencaoCorretiva.outros;

    let gastosFixos = manutencaoPreventivaSoma + manutencaoCorretivaSoma + depreciacao + carro.dadosCarro.tributosCarro + carro.dadosCarro.seguroCarro;
    let gastosVariaveis = carro.dadosCarro.valorLitroCombustivel / kmInfo.kmPorLitro;
    let gastosTotais = gastosFixos + (gastosVariaveis * kmInfo.kmEstimadoRodadosAno);
    let gastosTotaisKm = gastosTotais / kmInfo.kmEstimadoRodadosAno;
    let custoViagem = gastosTotaisKm * corridaInfo.kmViagem;
    let sobra = valorLiquido - custoViagem;

    // Exibe o relatório na tela
    document.getElementById("relatorio-conteudo1").innerHTML = `
        Seu custo por Km rodado com combustível está em R$ ${gastosVariaveis.toFixed(2)}.
        <br><br>
        Seu CUSTO TOTAL por km rodado está em R$ ${gastosTotaisKm.toFixed(2)}.
        <br>
    `;

    document.getElementById("relatorio-conteudo2").innerHTML = `
        O valor desta viagem é de R$ ${corridaInfo.valorViagem.toFixed(2)}.
        <br>
        A taxa do aplicativo é de R$ ${corridaInfo.taxaApp.toFixed(2)}.
        <br>
        Você receberá o <b>valor líquido de R$ ${valorLiquido.toFixed(2)}</b>.
        <br>
        Como a corrida tem ${corridaInfo.kmViagem.toFixed(2)} km,
        <br>
        você terá um <b>custo total de R$ ${custoViagem.toFixed(2)}</b>.
        <br>
    `;

    if (sobra > 0) {
        document.getElementById("relatorio-conteudo3").innerHTML = `
            <b>Assim, essa viagem <span style='color: green;'>COMPENSA</span> de acordo com seus custos informados.</b>
            <br>
        `;

        document.getElementById("relatorio-conteudo4").innerHTML = `
            <b><i><br>Desta viagem, recomenda-se guardar:</i></b>
            <br>
            <br>R$ ${((depreciacao / kmInfo.kmEstimadoRodadosAno) * corridaInfo.kmViagem).toFixed(2)} para quando for trocar o veículo,
            <br>R$ ${((manutencaoPreventivaSoma / kmInfo.kmEstimadoRodadosAno) * corridaInfo.kmViagem).toFixed(2)} para as manutenções preventivas,
            <br>R$ ${((manutencaoCorretivaSoma / kmInfo.kmEstimadoRodadosAno) * corridaInfo.kmViagem).toFixed(2)} para as manutenções corretivas,
            <br>R$ ${((carro.dadosCarro.seguroCarro / kmInfo.kmEstimadoRodadosAno) * corridaInfo.kmViagem).toFixed(2)} para seguro do carro,
            <br>R$ ${((carro.dadosCarro.tributosCarro / kmInfo.kmEstimadoRodadosAno) * corridaInfo.kmViagem).toFixed(2)} para IPVA e taxas,
            <br>R$ ${(gastosVariaveis * corridaInfo.kmViagem).toFixed(2)} para combustível.
        `;

        document.getElementById("relatorio-conteudo5").innerHTML = `
            <br>Guarde R$ ${custoViagem.toFixed(2)} dessa viagem.&#128663;
        `;

        document.getElementById("relatorio-conteudo6").innerHTML = `
            <br>Pode utilizar R$ ${sobra.toFixed(2)} para você!&#128512;&#128526;
        `;
    } else {
        document.getElementById("relatorio-conteudo3").innerHTML = `
            <b>Assim, essa viagem <span style='color: red;'>NÃO COMPENSA</span> de acordo com seus custos informados.</b>
            <br>
        `;
        // Limpar ou ajustar outros conteúdos se necessário
        document.getElementById("relatorio-conteudo4").innerHTML = '';
        document.getElementById("relatorio-conteudo5").innerHTML = '';
        document.getElementById("relatorio-conteudo6").innerHTML = '';
    }
}

// Função para carregar informações completas do carro nos inputs
function carregarCarroDados() {
    const carro = JSON.parse(localStorage.getItem("carroJson"));
    if (carro) {
        // Carregar dados gerais do carro
        document.getElementById("nomeMotorista").value = carro.dadosCarro.nomeMotorista;
        document.getElementById("marcaCarro").value = carro.dadosCarro.marcaCarro;
        document.getElementById("modeloCarro").value = carro.dadosCarro.modeloCarro;
        document.getElementById("anoCarro").value = carro.dadosCarro.anoCarro;
        document.getElementById("valorCarro").value = carro.dadosCarro.valorCarro;
        document.getElementById("valorEstimadoVenda").value = carro.dadosCarro.valorEstimadoVenda;
        document.getElementById("vidaUtilEstimadaAnos").value = carro.dadosCarro.vidaUtilEstimadaAnos;
        document.getElementById("seguroCarro").value = carro.dadosCarro.seguroCarro;
        document.getElementById("tributosCarro").value = carro.dadosCarro.tributosCarro;
        document.getElementById("valorLitroCombustivel").value = carro.dadosCarro.valorLitroCombustivel;

        // Carregar dados de manutenção preventiva
        document.getElementById("trocaOleo").value = carro.manutencaoPreventiva.trocaOleo;
        document.getElementById("trocaFiltroCombustivel").value = carro.manutencaoPreventiva.trocaFiltroCombustivel;
        document.getElementById("trocaFiltroAr").value = carro.manutencaoPreventiva.trocaFiltroAr;
        document.getElementById("alinhamentoBalanceamento").value = carro.manutencaoPreventiva.alinhamentoBalanceamento;
        document.getElementById("revisaoVelas").value = carro.manutencaoPreventiva.revisaoVelas;
        document.getElementById("revisaoFreios").value = carro.manutencaoPreventiva.revisaoFreios;
        document.getElementById("revisaoSuspensao").value = carro.manutencaoPreventiva.revisaoSuspensao;
        document.getElementById("trocaPneus").value = carro.manutencaoPreventiva.trocaPneus;

        // Carregar dados de manutenção corretiva
        document.getElementById("trocaEmbreagem").value = carro.manutencaoCorretiva.trocaEmbreagem;
        document.getElementById("trocaAmortecedores").value = carro.manutencaoCorretiva.trocaAmortecedores;
        document.getElementById("reparoSistemaFreios").value = carro.manutencaoCorretiva.reparoSistemaFreios;
        document.getElementById("trocaCorreiaDentada").value = carro.manutencaoCorretiva.trocaCorreiaDentada;
        document.getElementById("trocaBateria").value = carro.manutencaoCorretiva.trocaBateria;
        document.getElementById("reparoMotor").value = carro.manutencaoCorretiva.reparoMotor;
        document.getElementById("outros").value = carro.manutencaoCorretiva.outros;
    }
}

// Função para carregar informações de Km/l e Km estimado
function carregarKmDados() {
    const kmInfo = JSON.parse(localStorage.getItem("kmJson"));
    if (kmInfo) {
        document.getElementById("kmPorLitro").value = kmInfo.kmPorLitro;
        document.getElementById("kmEstimadoRodadosAno").value = kmInfo.kmEstimadoRodadosAno;
    }
}

// Função para carregar informações da corrida
function carregarCorridaDados() {
    const corridaInfo = JSON.parse(localStorage.getItem("corridaJson"));
    if (corridaInfo) {
        document.getElementById("valorViagem").value = corridaInfo.valorViagem;
        document.getElementById("taxaApp").value = corridaInfo.taxaApp;
        document.getElementById("kmViagem").value = corridaInfo.kmViagem;
    }
}
