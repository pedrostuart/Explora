/*
  Página de detalhe do evento (informacoes_evento.html), agora carregando
  dados reais da API a partir do ?id= na URL — a mesma página que os cards
  de eventos.html, mapa.html e favoritos_eventos.html linkam.
*/

const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function formatarDataCompleta(dataIso) {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return '';
    return `${DIAS_SEMANA[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]} de ${data.getFullYear()}`;
}

function formatarHora(dataIso) {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return '';
    return `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
}

function formatarHoraIntervalo(inicioIso, fimIso) {
    const inicio = formatarHora(inicioIso);
    if (!fimIso) return inicio;
    return `${inicio} - ${formatarHora(fimIso)}`;
}

function formatarPreco(preco, gratuito) {
    if (gratuito || Number(preco) === 0) return 'Gratuito';
    return `R$ ${Number(preco).toFixed(2).replace('.', ',')}`;
}

function formatarDataCurta(dataIso) {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return '';
    const hoje = new Date();
    const mesmoDia = data.getFullYear() === hoje.getFullYear() && data.getMonth() === hoje.getMonth() && data.getDate() === hoje.getDate();
    if (mesmoDia) return 'HOJE';
    return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`;
}

function montarTextoAcessibilidade(evento) {
    const recursos = [];
    if (evento.acessivel_fisico) recursos.push('Física');
    if (evento.acessivel_visual) recursos.push('Visual');
    if (evento.acessivel_auditivo) recursos.push('Auditiva');
    return recursos.length > 0 ? `Acessibilidade: ${recursos.join(', ')}` : 'Nenhum recurso de acessibilidade informado.';
}

function parametrosDaUrl() {
    return new URLSearchParams(window.location.search);
}

const EVENTOS_LEGADOS = {
    'Kali Uchis': {
    nome: 'Kali Uchis',
        descricao: 'Show especial da Sincerely, Tour, turnê de Kali Uchis criada para apresentar o álbum Sincerely. A cantora norte-americana de raízes colombianas combina R&B, soul, reggaeton, neo soul e pop em faixas bilíngues, com uma estética visual marcante e repertório que também revisita sucessos como telepatía, além de músicas de Isolation, Sin Miedo e Orquídeas.',
        data_hora: '2026-03-01T20:00:00-03:00',
        data_hora_fim: '2026-03-01T23:00:00-03:00',
        localNome: 'Vibra Brasil',
        endereco: 'Av. das Nações Unidas, 17955 - Santo Amaro, São Paulo - SP',
        cidade: 'São Paulo', estado: 'SP', bairro: 'Santo Amaro',
        imagem_capa: 'img/kali-uchis.webp', categoria_nome: 'Música', capacidade: 15000,
        preco: 180, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'Avenged Sevenfold': {
        nome: 'Avenged Sevenfold',
        descricao: 'Apresentação de Avenged Sevenfold, banda de Huntington Beach que evoluiu do metalcore para o heavy metal, hard rock e metal progressivo. Inspirado na energia das turnês da banda, o show combina riffs marcantes, solos duplos de guitarra, repertório de City of Evil, Nightmare e The Stage, além da atmosfera visual do mascote Deathbat.',
        data_hora: '2026-03-25T20:00:00-03:00', data_hora_fim: '2026-03-25T23:30:00-03:00',
        localNome: 'Allianz Parque', endereco: 'Av. Francisco Matarazzo, 1705 - Água Branca, São Paulo - SP',
        cidade: 'São Paulo', estado: 'SP', bairro: 'Água Branca', imagem_capa: 'img/avenged-sevenfold.png',
        categoria_nome: 'Música', capacidade: 45000, preco: 220, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    "Guns N' Roses": {
        nome: "Guns N' Roses",
        descricao: "Show de Guns N' Roses inspirado na tradição de suas turnês de estádio, com hard rock, blues e atitude. O repertório celebra clássicos como Welcome to the Jungle, Sweet Child o' Mine e November Rain em uma apresentação de grande escala, com guitarras, solos e vocais intensos.",
        data_hora: '2026-04-22T20:00:00-03:00', data_hora_fim: '2026-04-22T23:30:00-03:00',
        localNome: 'Allianz Parque', endereco: 'Av. Francisco Matarazzo, 1705 - Água Branca, São Paulo - SP',
        cidade: 'São Paulo', estado: 'SP', bairro: 'Água Branca', imagem_capa: 'img/guns n roses.webp',
        categoria_nome: 'Música', capacidade: 45000, preco: 300, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'Sabrina Carpenter': {
        nome: 'Sabrina Carpenter',
        descricao: 'Show inspirado na Short n\' Sweet Tour, fase em que Sabrina Carpenter combina pop, dance-pop e R&B com vocais expressivos, coreografias, humor e forte presença de palco. O repertório percorre Espresso, Please Please Please, Taste e canções de Short n\' Sweet e Emails I Can\'t Send.',
        data_hora: '2026-02-09T20:00:00-03:00', data_hora_fim: '2026-02-09T23:00:00-03:00',
        endereco: 'Autódromo de Interlagos - São Paulo - SP', cidade: 'São Paulo', estado: 'SP', bairro: 'Interlagos',
        imagem_capa: 'img/sabrina-carpenter.webp', categoria_nome: 'Música', capacidade: 30000, preco: 190, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'Tyler The Creator': {
        nome: 'Tyler The Creator',
        descricao: 'Performance inspirada na Chromakopia: The World Tour, de Tyler, The Creator, artista que une hip-hop alternativo, soul, jazz rap e produção autoral. O espetáculo aposta em cenários narrativos, direção visual cinematográfica e mudanças de clima, com repertório de Chromakopia, Igor, Flower Boy e Call Me If You Get Lost.',
        data_hora: '2026-01-31T20:00:00-03:00', data_hora_fim: '2026-01-31T23:00:00-03:00',
        endereco: 'Autódromo de Interlagos - São Paulo - SP', cidade: 'São Paulo', estado: 'SP', bairro: 'Interlagos',
        imagem_capa: 'img/Tyler the creator.jfif', categoria_nome: 'Música', capacidade: 30000, preco: 210, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'Tyler the creator': {
        nome: 'Tyler the creator',
        descricao: 'Performance inspirada na Chromakopia: The World Tour, de Tyler, The Creator, artista que une hip-hop alternativo, soul, jazz rap e produção autoral. O espetáculo aposta em cenários narrativos, direção visual cinematográfica e mudanças de clima, com repertório de Chromakopia, Igor, Flower Boy e Call Me If You Get Lost.',
        data_hora: '2026-07-30T20:00:00-03:00', data_hora_fim: '2026-07-30T23:00:00-03:00',
        endereco: 'Allianz Parque - São Paulo - SP', cidade: 'São Paulo', estado: 'SP', bairro: 'Água Branca',
        imagem_capa: 'img/Tyler the creator.jfif', categoria_nome: 'Música', capacidade: 30000, preco: 210, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'Lynyrd Skynyrd': {
        nome: 'Lynyrd Skynyrd', descricao: 'Show de Lynyrd Skynyrd celebrando a tradição do southern rock norte-americano. A apresentação reúne guitarras, vocais marcantes e clássicos como Sweet Home Alabama e Free Bird, recriando o clima das grandes noites de rock ao vivo da banda.',
        data_hora: '2026-09-01T20:00:00-03:00', data_hora_fim: '2026-09-01T23:00:00-03:00',
        endereco: 'Allianz Parque - São Paulo - SP', cidade: 'São Paulo', estado: 'SP', bairro: 'Água Branca',
        imagem_capa: 'img/Lynyrd_Skynyrd.svg', categoria_nome: 'Música', capacidade: 30000, preco: 180, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'Doja cat': {
        nome: 'Doja cat', descricao: 'Apresentação inspirada na linguagem visual de The Scarlet Tour e Tour Ma Vie, reunindo pop, rap, R&B e elementos eletrônicos. Doja Cat alterna faixas dançantes, momentos de rap e refrões pop em uma performance teatral, inventiva e coreografada.',
        data_hora: '2026-03-01T20:00:00-03:00', data_hora_fim: '2026-03-01T23:00:00-03:00',
        endereco: 'Allianz Parque - São Paulo - SP', cidade: 'São Paulo', estado: 'SP', bairro: 'Água Branca',
        imagem_capa: 'img/Doja cat.jfif', categoria_nome: 'Música', capacidade: 30000, preco: 200, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'Doja Cat': {
        nome: 'Doja Cat', descricao: 'Apresentação inspirada na linguagem visual de The Scarlet Tour e Tour Ma Vie, reunindo pop, rap, R&B e elementos eletrônicos. Doja Cat alterna faixas dançantes, momentos de rap e refrões pop em uma performance teatral, inventiva e coreografada.',
        data_hora: '2026-01-02T20:00:00-03:00', data_hora_fim: '2026-01-02T23:00:00-03:00',
        endereco: 'Vila Belmiro - Santos - SP', cidade: 'Santos', estado: 'SP', bairro: 'Vila Belmiro',
        imagem_capa: 'img/Doja cat.jfif', categoria_nome: 'Música', capacidade: 30000, preco: 200, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'Bad Bunny': {
        nome: 'Bad Bunny', descricao: 'Show de Bad Bunny, um dos nomes mais importantes do reggaeton e do trap latino, inspirado na escala de turnês como World\'s Hottest Tour e Debí Tirar Más Fotos World Tour. A apresentação combina músicas em espanhol, batidas urbanas, referências caribenhas e uma produção de arena vibrante.',
        data_hora: '2026-02-14T20:00:00-03:00', data_hora_fim: '2026-02-14T23:00:00-03:00',
        endereco: 'Vila Country - São Paulo - SP', cidade: 'São Paulo', estado: 'SP', bairro: 'Vila Country',
        imagem_capa: 'img/badbunny.jpg', categoria_nome: 'Música', capacidade: 30000, preco: 250, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'My Chemical Romance': {
        nome: 'My Chemical Romance', descricao: 'Show especial de My Chemical Romance, banda de Newark conhecida por misturar rock alternativo, emo, pop punk e pós-hardcore. A apresentação recupera a energia teatral da Reunion Tour e percorre álbuns conceituais como The Black Parade, além de clássicos como Helena e I\'m Not Okay (I Promise).',
        data_hora: '2026-09-19T20:00:00-03:00', data_hora_fim: '2026-09-19T23:00:00-03:00',
        endereco: 'Memorial da América Latina - São Paulo - SP', cidade: 'São Paulo', estado: 'SP', bairro: 'Barra Funda',
        imagem_capa: 'img/My Chemical Romance.jfif', categoria_nome: 'Música', capacidade: 30000, preco: 220, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
    'Jason Mraz': {
        nome: 'Jason Mraz', descricao: 'Apresentação acústica de Jason Mraz com canções de folk-pop, soft rock, reggae e soul. O show combina violão, melodias leves e interação próxima com o público, revisitando o repertório de We Sing. We Dance. We Steal Things., com I\'m Yours, Lucky e outras canções marcantes.',
        data_hora: '2026-10-13T20:00:00-03:00', data_hora_fim: '2026-10-13T23:00:00-03:00',
        endereco: 'Espaço Unimed - São Paulo - SP', cidade: 'São Paulo', estado: 'SP', bairro: 'Barra Funda',
        imagem_capa: 'img/jason mraz.jpg', categoria_nome: 'Música', capacidade: 15000, preco: 160, gratuito: 0, classificacao_etaria: 'Livre', status: 'ativo',
    },
    'The Weekend': {
        nome: 'The Weekend', descricao: 'Show inspirado na After Hours til Dawn Stadium Tour, com uma experiência audiovisual que atravessa R&B alternativo, pop, synthwave e dance-pop. A apresentação combina iluminação, cenografia e sucessos de After Hours, Dawn FM, Starboy e Hurry Up Tomorrow.',
        data_hora: '2026-10-22T20:00:00-03:00', data_hora_fim: '2026-10-22T23:30:00-03:00',
        endereco: 'Morumbi - São Paulo - SP', cidade: 'São Paulo', estado: 'SP', bairro: 'Morumbi',
        imagem_capa: 'img/the-weeknd.jpg', categoria_nome: 'Música', capacidade: 50000, preco: 275, gratuito: 0, classificacao_etaria: '16', status: 'ativo',
    },
};

const APRESENTACOES_EVENTOS = {
    'Kali Uchis': {
        titulo: 'Sincerely, Tour',
        contexto: 'Kali Uchis se apresenta em uma etapa da Sincerely, Tour, turnê que apresenta o álbum Sincerely e revisita momentos de Isolation, Sin Miedo e Orquídeas.'
    },
    'Avenged Sevenfold': {
        titulo: 'Show especial — The Stage',
        contexto: 'Avenged Sevenfold se apresenta em um show de arena com repertório de The Stage, City of Evil e Nightmare, combinando metal progressivo, hard rock e solos de guitarra.'
    },
    "Guns N' Roses": {
        titulo: 'Show especial — World Tour',
        contexto: "Guns N' Roses se apresenta em um show de estádio com clássicos do hard rock, incluindo Sweet Child o' Mine, November Rain e Welcome to the Jungle."
    },
    'Sabrina Carpenter': {
        titulo: "Short n' Sweet Tour",
        contexto: "Sabrina Carpenter se apresenta em uma etapa da Short n' Sweet Tour, com músicas de Short n' Sweet e Emails I Can't Send, além de coreografias e momentos de interação com o público."
    },
    'Tyler The Creator': {
        titulo: 'Chromakopia: The World Tour',
        contexto: 'Tyler, The Creator se apresenta em uma etapa da Chromakopia: The World Tour, com direção visual cinematográfica e repertório de Chromakopia, IGOR, Flower Boy e Call Me If You Get Lost.'
    },
    'Tyler the creator': {
        titulo: 'Chromakopia: The World Tour',
        contexto: 'Tyler, The Creator se apresenta em uma etapa da Chromakopia: The World Tour, com direção visual cinematográfica e repertório de Chromakopia, IGOR, Flower Boy e Call Me If You Get Lost.'
    },
    'Lynyrd Skynyrd': {
        titulo: 'Show de rock — Southern Rock Classics',
        contexto: 'Lynyrd Skynyrd se apresenta em um show dedicado ao southern rock, com guitarras, vocais marcantes e clássicos como Sweet Home Alabama e Free Bird.'
    },
    'Doja cat': {
        titulo: 'The Scarlet Tour',
        contexto: 'Doja Cat se apresenta em um show inspirado na linguagem visual de The Scarlet Tour, reunindo pop, rap, R&B, dança e uma performance teatral.'
    },
    'Doja Cat': {
        titulo: 'Tour Ma Vie',
        contexto: 'Doja Cat se apresenta em um show de sua fase Tour Ma Vie, com pop, rap, R&B e uma produção visual inventiva e coreografada.'
    },
    'Bad Bunny': {
        titulo: "Debí Tirar Más Fotos World Tour",
        contexto: 'Bad Bunny se apresenta em uma noite de reggaeton e trap latino, com repertório em espanhol, batidas urbanas e referências à cultura caribenha.'
    },
    'My Chemical Romance': {
        titulo: 'Reunion Tour',
        contexto: 'My Chemical Romance se apresenta em um show da Reunion Tour, revisitando The Black Parade e clássicos do rock alternativo, emo e pós-hardcore.'
    },
    'Jason Mraz': {
        titulo: 'Show acústico — We Sing. We Dance. We Steal Things.',
        contexto: "Jason Mraz se apresenta em um formato acústico e próximo do público, revisitando I'm Yours, Lucky e outras canções de folk-pop e soft rock."
    },
    'The Weekend': {
        titulo: 'After Hours til Dawn Stadium Tour',
        contexto: 'The Weeknd se apresenta em uma experiência de estádio com repertório de After Hours, Dawn FM, Starboy e Hurry Up Tomorrow, combinando R&B alternativo, pop e cenografia imersiva.'
    }
};

function dadosDaApresentacao(evento) {
    const nome = evento.nome || '';
    const encontrado = Object.entries(APRESENTACOES_EVENTOS)
        .find(([chave]) => chave.toLowerCase() === nome.toLowerCase());
    return encontrado
        ? encontrado[1]
        : {
            titulo: evento.categoria_nome === 'Música' ? 'Apresentação musical' : 'Evento especial',
            contexto: `${nome} será apresentado em uma programação especial de ${evento.categoria_nome || 'eventos'}, com informações de local, horário e ingressos nesta página.`
        };
}

function buscarEventoLegado(nome) {
    return Object.entries(EVENTOS_LEGADOS).find(([chave]) => chave.toLowerCase() === nome.toLowerCase())?.[1] || null;
}

function mostrarErroEventoNaoEncontrado() {
    const bloco = document.querySelector('.bloco_informacoes');
    if (bloco) {
        bloco.innerHTML = `
            <h1>Evento não encontrado</h1>
            <p>O evento que você está procurando não existe mais ou o link está incorreto.</p>
            <div class="icons-info">
                <p><a href="eventos.html" style="color:white;text-decoration:underline;">Voltar para Descobrir Eventos</a></p>
            </div>
        `;
    }
    const btnIngressos = document.querySelector('.btn-preferencia');
    if (btnIngressos) btnIngressos.style.display = 'none';
    const infoEventos = document.querySelector('.informacoes_eventos');
    if (infoEventos) infoEventos.style.display = 'none';
}

function preencherHero(evento, kmDaUrl) {
    document.title = evento.nome;

    const h1 = document.querySelector('.bloco_informacoes h1');
    if (h1) h1.textContent = evento.nome;

    const descricaoCurta = document.querySelector('.bloco_informacoes > p');
    if (descricaoCurta) descricaoCurta.textContent = dadosDaApresentacao(evento).titulo;

    const icones = document.querySelectorAll('.bloco_informacoes .icons-info p');
    if (icones[0]) icones[0].innerHTML = `<i class="bi bi-calendar-event-fill"></i>${formatarDataCompleta(evento.data_hora)}`;
    if (icones[1]) icones[1].innerHTML = `<i class="bi bi-clock-fill"></i>${formatarHoraIntervalo(evento.data_hora, evento.data_hora_fim)}`;
    if (icones[2]) {
        const distanciaTexto = kmDaUrl ? ` — ${kmDaUrl}km de você` : '';
        icones[2].innerHTML = `<img src="img/icone-logo.png" alt="">${evento.bairro}, ${evento.cidade} - ${evento.estado}${distanciaTexto}`;
    }

    const carrosel = document.querySelector('.carrosel');
    if (carrosel && evento.imagem_capa) {
        carrosel.style.background = `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${evento.imagem_capa}') no-repeat center`;
        carrosel.style.backgroundSize = 'cover';
    }
}

function preencherSobreEvento(evento) {
    const paragrafos = document.querySelectorAll('#sobre_evento .info_sobre_evento p');
    if (paragrafos[0]) {
        paragrafos[0].textContent = evento.descricao || 'Sem descrição disponível para este evento.';
    }
    if (paragrafos[1]) paragrafos[1].textContent = dadosDaApresentacao(evento).contexto;

    // Os 4 cards de "extras" — trocados para mostrar só dados reais do evento
    // (categoria, capacidade, acessibilidade e classificação etária).
    const extrasContainers = document.querySelectorAll('#extras .info_extras');
    if (extrasContainers[0]) {
        extrasContainers[0].querySelector('h2').textContent = 'Categoria';
        extrasContainers[0].querySelector('p').textContent = evento.categoria_nome;
    }
    if (extrasContainers[1]) {
        extrasContainers[1].querySelector('h2').textContent = 'Capacidade';
        extrasContainers[1].querySelector('p').textContent = `${evento.capacidade} pessoas — ${evento.bairro}`;
    }
    if (extrasContainers[2]) {
        extrasContainers[2].querySelector('h2').textContent = 'Acessibilidade';
        extrasContainers[2].querySelector('p').textContent = montarTextoAcessibilidade(evento);
    }
    if (extrasContainers[3]) {
        extrasContainers[3].querySelector('h2').textContent = 'Classificação Etária';
        extrasContainers[3].querySelector('p').textContent =
            evento.classificacao_etaria === 'Livre' ? 'Livre para todos os públicos.' : `+${evento.classificacao_etaria} anos.`;
    }
}

function preencherIngressos(evento) {
    const tituloPreco = document.querySelector('#ingressos .titulo-fechar h1');
    if (tituloPreco) {
        tituloPreco.innerHTML = `Ingressos: <br><span style="color:#2678BF;">${formatarPreco(evento.preco, evento.gratuito)}</span>`;
    }

    const infoPrecos = document.querySelector('.info-precos-ingressos');
    if (infoPrecos) {
        infoPrecos.innerHTML = `
            <div class="precos-ingressos">
                <h2>Entrada</h2>
                <p><span style="color:#1A824D;">&bull;</span>${formatarPreco(evento.preco, evento.gratuito)} — ${evento.status === 'esgotado' ? 'Esgotado' : 'Disponível'}</p>
            </div>
        `;
    }

    const btnComprar = document.querySelector('.btns-ingressos a.btn-comprar');
    if (btnComprar) {
        if (evento.link_externo) {
            btnComprar.href = evento.link_externo;
            btnComprar.target = '_blank';
            btnComprar.rel = 'noopener noreferrer';
        } else {
            btnComprar.style.display = 'none';
        }
    }

    const localNome = document.querySelector('#ingressos .local h2');
    if (localNome) localNome.textContent = evento.bairro;
    const localEndereco = document.querySelector('#ingressos .local p');
    if (localEndereco) localEndereco.textContent = evento.endereco;

    const linkMapa = document.querySelector('#ingressos .abrir-mapa a');
    if (linkMapa) {
        linkMapa.href = `mapa.html?lat=${evento.latitude}&lng=${evento.longitude}&nome=${encodeURIComponent(evento.nome)}`;
    }
}

// A seção "Principais Atrações" (lineup de artistas) não tem uma fonte real
// de dados no backend — em vez de inventar nomes, ela fica escondida.
function esconderAtracoesFicticias() {
    const secaoAtracoes = document.getElementById('atracoes');
    if (secaoAtracoes) secaoAtracoes.style.display = 'none';
}

async function preencherEventosSimilares(evento) {
    const secao = document.getElementById('recomendados');
    if (!secao) return;

    // remove os cards estáticos de exemplo
    secao.querySelectorAll('.eventos-recomendados').forEach((el) => el.remove());

    try {
        const resultado = await ApiExplora.buscarEventos({ categoria: evento.categoria_id, limite: 6 });
        const similares = (resultado.eventos || []).filter((e) => e.id !== evento.id).slice(0, 3);

        if (similares.length === 0) {
            const mensagem = document.createElement('p');
            mensagem.className = 'sem-recomendados';
            mensagem.textContent = 'Nenhum evento parecido encontrado no momento.';
            secao.appendChild(mensagem);
            return;
        }

        similares.forEach((similar) => {
            const card = document.createElement('a');
            card.className = 'eventos-recomendados';
            card.href = `informacoes_evento.html?id=${similar.id}`;

            const dataSpan = document.createElement('span');
            dataSpan.className = 'data_evento';
            dataSpan.textContent = formatarDataCurta(similar.data_hora);

            const img = document.createElement('img');
            img.src = similar.imagem_capa || 'img/imagem_evento.jpg';
            img.alt = `Imagem do evento ${similar.nome}`;

            card.appendChild(dataSpan);
            card.appendChild(img);

            const textoDiv = document.createElement('div');
            textoDiv.className = 'texto-evento';
            const nomeP = document.createElement('p');
            nomeP.className = 'nome_show';
            nomeP.textContent = similar.nome;
            const localP = document.createElement('p');
            localP.className = 'distancia_show';
            localP.textContent = similar.bairro;
            textoDiv.appendChild(nomeP);
            textoDiv.appendChild(localP);
            card.appendChild(textoDiv);

            secao.appendChild(card);
        });
    } catch (erro) {
        const mensagem = document.createElement('p');
        mensagem.className = 'sem-recomendados';
        mensagem.textContent = 'Não foi possível carregar eventos parecidos agora.';
        secao.appendChild(mensagem);
    }
}

async function carregarEvento() {
    const params = parametrosDaUrl();
    const id = params.get('id');
    const nomeLegado = params.get('evento');
    const km = params.get('km');

    if (!id && !nomeLegado) {
        mostrarErroEventoNaoEncontrado();
        return;
    }

    try {
        const evento = id
            ? (await ApiExplora.buscarEventoPorId(id)).evento
            : buscarEventoLegado(nomeLegado);

        if (!evento) {
            mostrarErroEventoNaoEncontrado();
            return;
        }

        preencherHero(evento, km);
        preencherSobreEvento(evento);
        preencherIngressos(evento);
        esconderAtracoesFicticias();
        preencherEventosSimilares(evento);
    } catch (erro) {
        mostrarErroEventoNaoEncontrado();
    }
}

async function usuarioEstaAutenticado() {
    try {
        const resposta = await fetch('/api/usuarios/me');
        return resposta.ok;
    } catch {
        return false;
    }
}

async function exigirLogin(evento) {
    const autenticado = await usuarioEstaAutenticado();
    if (autenticado) return true;

    if (evento) evento.preventDefault();
    window.location.href = 'login.html';
    return false;
}

document.addEventListener('DOMContentLoaded', carregarEvento);

/* ===== Interações de UI (já existiam antes, mantidas como estavam) ===== */

let btnAbrirIngressos = document.querySelector(".btn-preferencia")
let boxIngressos = document.getElementById("ingressos")
if (btnAbrirIngressos) btnAbrirIngressos.addEventListener("click", async (evento)=>{
    if (!await exigirLogin(evento)) return;
    boxIngressos.style.display = 'flex'
    document.body.style.overflow = 'hidden'
})

let fecharBox = document.querySelector("#ingressos .fechar-menu")
fecharBox.addEventListener("click", ()=>{
    boxIngressos.style.display = 'none'
    document.body.style.overflow = "auto";
})

let lerMais = document.querySelector(".ler-mais")
let extraTexto = document.getElementById("extras")
lerMais.addEventListener("click", ()=>{
    if(lerMais.textContent == 'Ler mais'){
        extraTexto.style.display = 'flex'
        lerMais.textContent = 'Ler menos'
    }else{
        extraTexto.style.display = 'none'
        lerMais.textContent = 'Ler mais'
    }
        
})

let botoesIngressos = document.querySelector(".btns-ingressos")
let btnVisitado = botoesIngressos ? botoesIngressos.children[2] : null
if (btnVisitado) btnVisitado.addEventListener("click", async (evento)=>{
    if (!await exigirLogin(evento)) return;
    
    if(btnVisitado.classList == 'btn-comprar'){
        btnVisitado.classList.add("btn-ativo")
        btnVisitado.classList.remove("btn-comprar")
    }else{
        btnVisitado.classList.add("btn-comprar")
        btnVisitado.classList.remove("btn-ativo")
    }
    
})
let btnSalvar = botoesIngressos ? botoesIngressos.children[0] : null
if (btnSalvar) btnSalvar.addEventListener("click", async (evento)=>{
    if (!await exigirLogin(evento)) return;
    if(btnSalvar.classList == 'btn-comprar'){
        btnSalvar.classList.add("btn-ativo")
        btnSalvar.classList.remove("btn-comprar")
    }else{
        btnSalvar.classList.add("btn-comprar")
        btnSalvar.classList.remove("btn-ativo")
    }
})

const btnComprar = document.querySelector('.btns-ingressos a.btn-comprar');
if (btnComprar) {
    btnComprar.addEventListener('click', async (evento) => {
        if (!await exigirLogin(evento)) return;
    });
}
