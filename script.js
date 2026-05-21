// Substitua as letras X pela chave que você pegou no site
const apiKey = ""; 

document.getElementById('buscar').addEventListener('click', () => {
    const cidade = document.getElementById('cidade').value;
    
    if (cidade) {
        buscarClima(cidade);
    } else {
        alert("Digite o nome de uma cidade!");
    }
});

// Função que vai na internet buscar o clima
async function buscarClima(cidade) {
    // Montamos a URL que a API pede, passando a cidade, a nossa chave, o idioma e a unidade em Celsius (metric)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;

    try {
        // O fetch envia o pedido para a URL
        const resposta = await fetch(url);
        
        // Se a cidade não existir, o servidor avisa
        if (!resposta.ok) {
            throw new Error("Cidade não encontrada");
        }

        // Transformamos a resposta bruta do servidor em um objeto JS (JSON)
        const dados = await resposta.json();
        
        // Agora jogamos esses dados na tela!
        mostrarDados(dados);

    } catch (erro) {
        alert(erro.message);
    }
}

// Função para alterar o HTML com os dados da API
function mostrarDados(dados) {
    document.getElementById('nome-cidade').innerText = `${dados.name}, ${dados.sys.country}`;
    // Usamos Math.round para arredondar a temperatura (ex: 23.6°C vira 24°C)
    document.getElementById('temperatura').innerText = `${Math.round(dados.main.temp)}°C`;
    document.getElementById('descricao').innerText = dados.weather[0].description;
    
    // Mostra a caixinha do resultado que estava escondida
    document.getElementById('resultado').style.display = 'block';
}