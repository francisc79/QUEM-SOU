/* JOGO QUEM SOU? */

// LISTA DE ANIMAIS (Nome + Nome do Arquivo da Imagem)
// Certifique-se que as imagens existem na pasta!
const listaAnimais = [
    { nome: 'ARANHA',    img: 'aranha.png' },
    { nome: 'PEIXE',     img: 'peixe.png' },
    { nome: 'CACHORRO',  img: 'cachorro.png' },
    { nome: 'GATO',      img: 'gato.png' },
    { nome: 'GALINHA',   img: 'galinha.png' },
    { nome: 'VACA',      img: 'vaca.png' },
    { nome: 'ZEBRA',     img: 'zebra.png' },
    { nome: 'MACACO',    img: 'macaco.png' },
    { nome: 'GIRAFA',    img: 'girafa.png' },
    { nome: 'GOLFINHO',  img: 'golfinho.png' },
    { nome: 'BORBOLETA', img: 'borboleta.png' },
    { nome: 'ABELHA',    img: 'abelha.png' },
    { nome: 'TARTARUGA', img: 'tartaruga.png' },
    { nome: 'PORCO',     img: 'porco.png' },
    { nome: 'SAPO',      img: 'sapo.png' },
    { nome: 'ELEFANTE',  img: 'elefante.png' },
    { nome: 'LEÃO',      img: 'leao.png' },
    { nome: 'RATO',      img: 'rato.png' },
    { nome: 'FORMIGA',   img: 'formiga.png' },
    { nome: 'COELHO',    img: 'coelho.png' },
    { nome: 'TATU',      img: 'tatu.png' },
    { nome: 'BALEIA',    img: 'baleia.png' }
];

let filaDeJogo = []; 

// ELEMENTOS
const telaInicio = document.getElementById('tela-inicio');
const conteudoJogo = document.getElementById('conteudo-jogo');
const imagemAlvo = document.getElementById('imagem-alvo');
const areaOpcoes = document.getElementById('area-opcoes');
const msgVitoria = document.getElementById('mensagem-vitoria');
const areaPergunta = document.getElementById('area-pergunta');

const btnComecar = document.getElementById('btn-comecar');
const btnReiniciar = document.getElementById('btn-reiniciar');

// SONS
const somFundo = document.getElementById('audio-fundo');
const somAcerto = document.getElementById('audio-acerto');
const somErro = document.getElementById('audio-erro');
const somVitoria = document.getElementById('audio-vitoria');

if(somFundo) somFundo.volume = 0.2;

// --- FUNÇÕES ---

// Embaralha array
function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

btnComecar.addEventListener('click', function() {
    telaInicio.classList.add('d-none');
    conteudoJogo.classList.remove('d-none');
    if(somFundo) somFundo.play().catch(e=>{});
    iniciarJogo();
});

function iniciarJogo() {
    filaDeJogo = embaralhar([...listaAnimais]);
    
    // Reseta visual
    areaPergunta.classList.remove('d-none');
    areaOpcoes.classList.remove('d-none');
    msgVitoria.classList.add('d-none');

    if(somVitoria) { somVitoria.pause(); somVitoria.currentTime = 0; }
    if(somFundo && somFundo.paused) somFundo.play();

    novaRodada();
}

function novaRodada() {
    if (filaDeJogo.length > 0) {
        const animalCorreto = filaDeJogo[0];
        
        // 1. Exibe a imagem
        imagemAlvo.src = animalCorreto.img;
        
        // 2. Prepara as opções (1 Certa + 1 Errada Aleatória)
        let opcoes = [animalCorreto];
        
        // Busca um animal errado aleatório que não seja o atual
        let animalErrado;
        do {
            const indiceAleatorio = Math.floor(Math.random() * listaAnimais.length);
            animalErrado = listaAnimais[indiceAleatorio];
        } while (animalErrado.nome === animalCorreto.nome);
        
        opcoes.push(animalErrado);
        
        // Embaralha as opções para a certa não estar sempre na esquerda
        opcoes = embaralhar(opcoes);

        // 3. Desenha os botões
        renderizarBotoes(opcoes, animalCorreto.nome);
        
    } else {
        finalizarJogo();
    }
}

function renderizarBotoes(opcoes, nomeCorreto) {
    areaOpcoes.innerHTML = ''; // Limpa botões anteriores
    
    opcoes.forEach(opcao => {
        const btn = document.createElement('button');
        btn.classList.add('botao-opcao');
        btn.innerText = opcao.nome;
        
        // Evento de clique
        btn.onclick = () => verificarResposta(btn, opcao.nome, nomeCorreto);
        
        areaOpcoes.appendChild(btn);
    });
}

function verificarResposta(botao, nomeClicado, nomeCorreto) {
    // Desabilita todos os botões para não clicar duas vezes
    const todosBotoes = document.querySelectorAll('.botao-opcao');
    todosBotoes.forEach(b => b.disabled = true);

    if (nomeClicado === nomeCorreto) {
        // ACERTO
        if(somAcerto) somAcerto.cloneNode(true).play().catch(()=>{});
        botao.style.backgroundColor = '#66BB6A'; // Verde
        botao.style.color = 'white';
        botao.style.borderColor = '#2E7D32';

        setTimeout(() => {
            filaDeJogo.shift(); // Remove o atual
            novaRodada();
        }, 1000); // Espera 1 segundo para mostrar o próximo

    } else {
        // ERRO
        if(somErro) somErro.cloneNode(true).play().catch(()=>{});
        botao.style.backgroundColor = '#EF5350'; // Vermelho
        botao.style.color = 'white';
        
        if (navigator.vibrate) navigator.vibrate(300);

        setTimeout(() => {
            // Reabilita botões para tentar de novo
            todosBotoes.forEach(b => {
                b.disabled = false;
                // Reseta cor do botão errado
                if(b === botao) {
                    b.style.backgroundColor = '#fff';
                    b.style.color = '#555';
                }
            });
        }, 1000);
    }
}

function finalizarJogo() {
    areaPergunta.classList.add('d-none');
    areaOpcoes.classList.add('d-none');
    msgVitoria.classList.remove('d-none');
    
    if(somFundo) somFundo.pause();
    if(somVitoria) somVitoria.play();
}

btnReiniciar.addEventListener('click', iniciarJogo);