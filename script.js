document.addEventListener("DOMContentLoaded", () => {
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
});