// Quando a página carrega, verifica se já existe uma chave salva no navegador
window.addEventListener('DOMContentLoaded', () => {
    const chaveSalva = localStorage.getItem('clima_api_key');
    if (chaveSalva) {
        document.getElementById('api-key').value = chaveSalva;
    }
});

document.getElementById('buscar').addEventListener('click', () => {
    const apiKey = document.getElementById('api-key').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    
    if (!apiKey) {
        alert("Por favor, insira sua API Key da OpenWeather!");
        return;
    }

    if (!cidade) {
        alert("Digite o nome de uma cidade!");
        return;
    }

    // Salva a chave no navegador para o usuário não ter que colar de novo na próxima visita
    localStorage.setItem('clima_api_key', apiKey);
    
    buscarClima(cidade, apiKey);
});

async function buscarClima(cidade, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;

    try {
        const resposta = await fetch(url);
        
        if (resposta.status === 401) {
            throw new Error("API Key inválida ou ainda não ativada. Verifique sua chave.");
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

function mostrarDados(dados) {
    document.getElementById('nome-cidade').innerText = `${dados.name}, ${dados.sys.country}`;
    document.getElementById('temperatura').innerText = `${Math.round(dados.main.temp)}°C`;
    document.getElementById('descricao').innerText = dados.weather[0].description;
    document.getElementById('resultado').style.display = 'block';
}