// =======================================================
// LÓGICA DO MODO ESCURO (DARK MODE)
// =======================================================
const themeBtn = document.getElementById('theme-btn');
const body = document.body;
const card = document.getElementById('card');
const cardHeader = document.getElementById('card-header');

if (localStorage.getItem('tema_escuro') === 'true') {
    aplicarModoEscuro(true);
}

themeBtn.addEventListener('click', () => {
    const estaEscuro = body.classList.toggle('dark-mode');
    card.classList.toggle('dark-mode');
    cardHeader.classList.toggle('dark-mode');
    themeBtn.classList.toggle('dark-mode');
    themeBtn.innerText = estaEscuro ? "☀️ Modo Claro" : "🌙 Modo Escuro";
    localStorage.setItem('tema_escuro', estaEscuro);
});

function aplicarModoEscuro(ativar) {
    if (ativar) {
        body.classList.add('dark-mode');
        card.classList.add('dark-mode');
        cardHeader.classList.add('dark-mode');
        themeBtn.classList.add('dark-mode');
        themeBtn.innerText = "☀️ Modo Claro";
    }
}

// =======================================================
// LÓGICA DO APP DO CLIMA E FAVORITOS
// =======================================================
let cidadeAtualGlobal = ""; // Guarda o nome limpo da cidade que está na tela

// EVENTO: Quando a página carrega
window.addEventListener('DOMContentLoaded', () => {
    // 1. Recupera a API Key se houver
    const chaveSalva = localStorage.getItem('clima_api_key');
    if (chaveSalva) {
        document.getElementById('api-key').value = chaveSalva;
    }

    // 2. Recupera a cidade favorita se houver e já busca o clima dela
    const cidadeFavorita = localStorage.getItem('clima_cidade_favorita');
    if (chaveSalva && cidadeFavorita) {
        buscarClima(cidadeFavorita, chaveSalva);
    }
});

// EVENTO: Botão de Salvar a API Key
document.getElementById('btn-salvar').addEventListener('click', () => {
    const apiKey = document.getElementById('api-key').value.trim();
    if (apiKey) {
        localStorage.setItem('clima_api_key', apiKey);
        alert("Chave salva com sucesso no seu navegador! 🎉");
    } else {
        alert("Por favor, digite uma chave antes de salvar.");
    }
});

// EVENTO: Botão de Buscar Clima
document.getElementById('buscar').addEventListener('click', () => {
    const apiKey = document.getElementById('api-key').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    
    if (!apiKey) {
        alert("Por favor, insira e salve sua API Key primeiro!");
        return;
    }
    if (!cidade) {
        alert("Digite o nome de uma cidade!");
        return;
    }

    buscarClima(cidade, apiKey);
});

// EVENTO: Botão de Favoritar (Estrela)
document.getElementById('btn-favoritar').addEventListener('click', () => {
    const btnFavoritar = document.getElementById('btn-favoritar');
    const favoritaAtual = localStorage.getItem('clima_cidade_favorita');

    // Se a cidade atual já for a favorita, o clique remove dos favoritos
    if (favoritaAtual && favoritaAtual.toLowerCase() === cidadeAtualGlobal.toLowerCase()) {
        localStorage.removeItem('clima_cidade_favorita');
        btnFavoritar.innerText = "☆";
        btnFavoritar.style.transform = "scale(1)";
    } else {
        // Caso contrário, salva como nova favorita
        localStorage.setItem('clima_cidade_favorita', cidadeAtualGlobal);
        btnFavoritar.innerText = "★";
        btnFavoritar.style.transform = "scale(1.2)";
    }
});

// FUNÇÃO: Busca dados na API
async function buscarClima(cidade, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;

    try {
        const resposta = await fetch(url);
        
        if (resposta.status === 401) {
            throw new Error("API Key inválida ou expirada.");
        }
        if (!resposta.ok) {
            throw new Error("Cidade não encontrada.");
        }

        const dados = await resposta.json();
        mostrarDados(dados);

    } catch (erro) {
        alert(erro.message);
    }
}

// FUNÇÃO: Mapeia Emojis
function obterEmojiClima(mainClima) {
    const mapeamento = {
        'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
        'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Smoke': '🌫️',
        'Haze': '🌫️', 'Dust': '🌫️', 'Fog': '🌫️'
    };
    return mapeamento[mainClima] || '🌍';
}

// FUNÇÃO: Renderiza os dados na tela
function mostrarDados(dados) {
    cidadeAtualGlobal = dados.name; // Salva o nome retornado pela API (ex: "São Paulo")

    document.getElementById('nome-cidade').innerText = `${dados.name}, ${dados.sys.country}`;
    document.getElementById('temperatura').innerText = `${Math.round(dados.main.temp)}°C`;
    document.getElementById('descricao').innerText = dados.weather[0].description;
    document.getElementById('humidade').innerText = `Umidade: ${dados.main.humidity}%`;
    document.getElementById('vento').innerText = `Vento: ${Math.round(dados.wind.speed * 3.6)} km/h`;
    
    const climaPrincipal = dados.weather[0].main;
    document.getElementById('icone-emoji').innerText = obterEmojiClima(climaPrincipal);
    
    // Atualiza o desenho da estrela com base no favorito salvo
    const btnFavoritar = document.getElementById('btn-favoritar');
    const favoritaSalva = localStorage.getItem('clima_cidade_favorita');
    
    if (favoritaSalva && favoritaSalva.toLowerCase() === cidadeAtualGlobal.toLowerCase()) {
        btnFavoritar.innerText = "★"; // Estrela cheia se for a favorita
    } else {
        btnFavoritar.innerText = "☆"; // Estrela vazia se não for
    }

    document.getElementById('resultado').style.display = 'block';
}