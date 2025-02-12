document.addEventListener("DOMContentLoaded", () => {
    const votarBtn = document.getElementById("votar-btn");
    const zerarBtn = document.getElementById("zerar-btn");
    const resultadoMensagem = document.getElementById("votacao-mensagem");

    let estatisticas = {
        "Eliara": 0,
        "Edyelsom": 0,
        "Thays": 0,
        "Edvania": 0,
        "Suellen": 0,
        "Gabriel": 0,
        "Felipe": 0
    };

    function atualizarTabela() {
        const linhas = document.querySelectorAll("tbody tr");
        linhas.forEach(linha => {
            const jogador = linha.children[0].textContent;
            if (estatisticas.hasOwnProperty(jogador)) {
                linha.children[2].textContent = estatisticas[jogador];
            }
        });
    }

    votarBtn.addEventListener("click", () => {
    const selecionado = document.querySelector('input[name="trapaceiro"]:checked');
    
    if (selecionado) {
        const jogador = selecionado.value;
        estatisticas[jogador] += 1;
        resultadoMensagem.textContent = `${jogador} foi denunciado por trapaça!`;
        atualizarTabela();

        // Envia o voto para o Google Sheets
        votar(jogador);
    } else {
        resultadoMensagem.textContent = "Selecione um jogador para denunciar!";
    }
});
    zerarBtn.addEventListener("click", () => {
        Object.keys(estatisticas).forEach(jogador => {
            estatisticas[jogador] = 0;
        });
        resultadoMensagem.textContent = "Todas as acusações foram resetadas!";
        atualizarTabela();
    });

    // Corrige os botões "Ler Mais"
    document.querySelectorAll(".ler-mais").forEach(botao => {
        botao.addEventListener("click", () => {
            const noticia = botao.parentElement;
            const descricao = noticia.querySelector(".descricao");

            if (descricao.style.display === "none" || descricao.style.display === "") {
                descricao.style.display = "block"; // Mostra a descrição completa
                botao.textContent = "Ler Menos"; // Muda o botão para "Ler Menos"
            } else {
                descricao.style.display = "none"; // Esconde a descrição completa
                botao.textContent = "Ler Mais";
            }
        });
    });

    atualizarTabela();
});

// Função para votar em um jogador usando Google Apps Script
function votar(jogador) {
    fetch("https://script.google.com/macros/s/AKfycbyBckjZsqS6zhaRCx0CYvY4yqsDFCvOCOuatXuEm17THULF_OeiyMOi3LS87b6Qq3UeSg/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ jogador: jogador })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao processar o voto!");
        }
        return response.text();
    })
    .then(data => {
        alert("Voto computado para " + jogador);
    })
    .catch(error => {
        console.error("Erro ao votar:", error);
        alert("Ocorreu um erro ao enviar o voto.");
    });
}
function carregarVotos() {
    fetch("https://script.google.com/macros/s/AKfycbyBckjZsqS6zhaRCx0CYvY4yqsDFCvOCOuatXuEm17THULF_OeiyMOi3LS87b6Qq3UeSg/exec")
    .then(response => response.json())
    .then(data => {
        if (data.success && data.estatisticas) {
            estatisticas = data.estatisticas;
            atualizarTabela(); // Atualiza a tabela com os dados do Google Sheets
        }
    })
    .catch(error => console.error("Erro ao carregar votos:", error));
}
carregarVotos();
function atualizarVotos() {
    fetch("https://script.google.com/macros/s/AKfycbyBckjZsqS6zhaRCx0CYvY4yqsDFCvOCOuatXuEm17THULF_OeiyMOi3LS87b6Qq3UeSg/exec")
        .then(response => response.json())
        .then(data => {
            const linhas = document.querySelectorAll("tbody tr");
            linhas.forEach(linha => {
                const jogador = linha.children[0].textContent;
                if (data[jogador] !== undefined) {
                    linha.children[2].textContent = data[jogador]; // Atualiza a contagem de votos
                }
            });
        })
        .catch(error => console.error("Erro ao buscar os votos:", error));
}

// Atualiza os votos a cada 5 segundos
setInterval(atualizarVotos, 5000);
atualizarVotos(); // Chama a função uma vez ao carregar a página
function votar(jogador) {
    let ultimoVoto = localStorage.getItem("ultimo_voto");

    if (ultimoVoto) {
        let agora = new Date();
        let ultimoVotoData = new Date(ultimoVoto);
        let diffHoras = (agora - ultimoVotoData) / (1000 * 60 * 60); // Diferença em horas

        if (diffHoras < 24) {
            alert("Você só pode votar uma vez a cada 24 horas!");
            return;
        }
    }

    fetch("https://script.google.com/macros/s/AKfycbyBckjZsqS6zhaRCx0CYvY4yqsDFCvOCOuatXuEm17THULF_OeiyMOi3LS87b6Qq3UeSg/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ jogador: jogador })
    })
    .then(response => response.text())
    .then(data => {
        alert("Voto computado para " + jogador);
        localStorage.setItem("ultimo_voto", new Date()); // Salva o horário do voto
    })
    .catch(error => {
        console.error("Erro ao votar:", error);
        alert("Ocorreu um erro ao enviar o voto.");
    });
}
