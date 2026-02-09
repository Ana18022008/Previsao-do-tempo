const apiKey = '91cfb55cd29eb9ee6401ac10dc5389c3'; 
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&lang=pt_br`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&lang=pt_br`;

function buscarCidade() {
    const cidade = document.getElementById('cidade').value;

    if (!cidade) return;

    fetch(`${apiUrl}&q=${cidade}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert('Cidade não encontrada 😕');
                return;
            }

            exibirDados(data);
            alterarTema(data);
            buscarProximosDias(cidade);
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao buscar os dados!');
        });
}

function exibirDados(data) {
    document.getElementById('cidade-apresentar').innerText =
        `${data.name}, ${data.sys.country}`;

    document.getElementById('temperatura').innerText =
        `${Math.round(data.main.temp)}°C`;

        document.getElementById('clima').innerText =
        data.weather[0].description;    

    document.getElementById('vento').innerText =
        `☴ ${data.wind.speed} km/h`;

    document.getElementById('umidade').innerText =
        `🌢 ${data.main.humidity}%`;

    atualizarMensagem(data.weather[0].main);
    atualizarData();
}

function atualizarData() {
    const data = new Date();
    const opcoes = { weekday: 'long', day: 'numeric', month: 'long' };

    document.getElementById('data').innerText =
        data.toLocaleDateString('pt-BR', opcoes);
}

function atualizarMensagem(clima) {
    const msg = document.querySelector('#mensagem p');

    if (clima.includes('Rain')) {
        msg.innerText = '🌧️ Leve um guarda-chuva!';
    } else if (clima.includes('Clear')) {
        msg.innerText = '☀️ Ideal para uma caminhada!';
    } else if (clima.includes('Cloud')) {
        msg.innerText = '☁️ Bom dia para algo tranquilo.';
    } else {
        msg.innerText = '🎬 Tempo ótimo para assistir um filme em casa.';
    }
}

function alterarTema(data) {
    const body = document.body;

    // horário UTC atual
    const agoraUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;

    // horário local da cidade
    const horaCidade = new Date(agoraUTC + data.timezone * 1000).getHours();

    body.className = '';

    if (horaCidade >= 18 || horaCidade < 6) {
        body.classList.add('night');
    } else if (data.weather[0].main === 'Rain') {
        body.classList.add('rainy');
    } else {
        body.classList.add('sunny');
    }
}

function buscarProximosDias(cidade) {
    fetch(`${forecastUrl}&q=${cidade}`)
        .then(res => res.json())
        .then(data => {
            const dias = document.querySelectorAll('.dias');

            for (let i = 0; i < 3; i++) {
                const info = data.list[i * 8]; // 1 por dia
                dias[i].querySelector('.temperatura').innerText =
                    `${Math.round(info.main.temp)}°C`;
                    dias[i].querySelector('.clima').innerText =
                    getEmojiClima(info.weather[0].main);
            }
        });
}

document.getElementById('cidade').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarCidade();
});

function getEmojiClima(condicao) {
    switch (condicao) {
        case 'Rain':
            return '🌧︎';
        case 'Thunderstorm':
            return '🌩︎';
        case 'Clouds':
            return '☁︎';
        case 'Clear':
            return '☀︎';
        case 'Drizzle':
            return '🌧︎';
        default:
            return '🌤︎'; // sol com nuvens
    }
}