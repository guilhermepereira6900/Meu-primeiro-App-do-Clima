// Verifica se já existe uma chave salva ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const chaveSalva = localStorage.getItem('clima_api_key');
    if (chaveSalva) {
        document.getElementById('api-key').value = chaveSalva;
    }
});

// Botão de Salvar a Chave explicitamente
document.getElementById('btn-salvar').addEventListener('click', () => {
    const apiKey = document.getElementById('api-key').value.trim();
    if (apiKey) {
        localStorage.setItem('clima_api_key', apiKey);
        alert("Chave salva com sucesso no seu navegador! 🎉");
    } else {
        alert("Por favor, digite uma chave antes de salvar.");
    }
});

// Botão de Buscar Clima
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

// Mapeia os ícones da API para emojis divertidos
function obterEmojiClima(mainClima) {
    const mapeamento = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '🌫️',
        'Haze': '🌫️',
        'Dust': '🌫️',
        'Fog': '🌫️'
    };
    return mapeamento[mainClima] || '🌍';
}

function mostrarDados(dados) {
    // Altera os textos principais
    document.getElementById('nome-cidade').innerText = `${dados.name}, ${dados.sys.country}`;
    document.getElementById('temperatura').innerText = `${Math.round(dados.main.temp)}°C`;
    document.getElementById('descricao').innerText = dados.weather[0].description;
    
    // Altera os novos detalhes que adicionamos (Umidade e Vento)
    document.getElementById('humidade').innerText = `Umidade: ${dados.main.humidity}%`;
    document.getElementById('vento').innerText = `Vento: ${Math.round(dados.wind.speed * 3.6)} km/h`; // Converte m/s para km/h
    
    // Define o emoji baseado no clima atual
    const climaPrincipal = dados.weather[0].main;
    document.getElementById('icone-emoji').innerText = obterEmojiClima(climaPrincipal);
    
    // Exibe a seção de resultados com a animação bonitinha
    document.getElementById('resultado').style.display = 'block';
}