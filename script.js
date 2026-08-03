/* Wellerson Pessotto — interações */
(() => {
  'use strict';

  const WHATSAPP = '5555996615052';

  /* ── Topo: fundo sólido depois do hero ── */
  const topo = document.querySelector('.topo');

  const aoRolar = () => {
    topo.classList.toggle('encolhido', window.scrollY > 40);
  };
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  /* ── Menu mobile ── */
  const botao = document.querySelector('.hamburguer');
  const painel = document.getElementById('menu-mobile');

  const alternarMenu = (abrir) => {
    botao.setAttribute('aria-expanded', String(abrir));
    painel.hidden = !abrir;
    botao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = abrir ? 'hidden' : '';
  };

  botao.addEventListener('click', () => {
    alternarMenu(botao.getAttribute('aria-expanded') !== 'true');
  });
  painel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => alternarMenu(false)));

  /* ── Filtro de projetos ── */
  const filtros = document.querySelectorAll('.filtro');
  const obras = [...document.querySelectorAll('.obra')];

  filtros.forEach((btn) => {
    btn.addEventListener('click', () => {
      filtros.forEach((b) => {
        const ativo = b === btn;
        b.classList.toggle('is-ativo', ativo);
        b.setAttribute('aria-selected', String(ativo));
      });
      const alvo = btn.dataset.filtro;
      obras.forEach((o) => {
        o.classList.toggle('oculta', alvo !== 'todos' && o.dataset.cat !== alvo);
      });
    });
  });

  /* ── Carrossel de projeto (popup) ── */
  const lupa = document.getElementById('lupa');
  const lupaImg = document.getElementById('lupa-img');
  const lupaLegenda = document.getElementById('lupa-legenda');
  const lupaContador = document.getElementById('lupa-contador');
  let fotos = [];
  let indice = 0;
  let nomeAtual = '';

  const precarregar = (i) => {
    if (fotos[i]) { const im = new Image(); im.src = fotos[i]; }
  };

  const render = () => {
    if (!fotos.length) return;
    lupaImg.src = fotos[indice];
    lupaImg.alt = `${nomeAtual}, foto ${indice + 1} de ${fotos.length}`;
    lupaContador.textContent = `${indice + 1} / ${fotos.length}`;
    precarregar(indice + 1);
    precarregar(indice - 1);
  };

  const ir = (delta) => {
    if (fotos.length < 2) return;
    indice = (indice + delta + fotos.length) % fotos.length;
    render();
  };

  const abrirLupa = (obra) => {
    try { fotos = JSON.parse(obra.dataset.fotos || '[]'); }
    catch (e) { fotos = []; }
    if (!fotos.length) {
      const img = obra.querySelector('img');
      if (img) fotos = [img.src];
    }
    nomeAtual = obra.dataset.nome || obra.querySelector('.obra__nome')?.textContent || '';
    indice = 0;
    lupaLegenda.textContent = `${obra.querySelector('.obra__cat').textContent} · ${nomeAtual}`;
    lupa.classList.toggle('lupa--unica', fotos.length < 2);
    render();
    lupa.hidden = false;
    document.body.style.overflow = 'hidden';
    lupa.querySelector('.lupa__fechar').focus();
  };

  const fecharLupa = () => {
    lupa.hidden = true;
    lupaImg.src = '';
    document.body.style.overflow = '';
  };

  obras.forEach((obra) => {
    obra.setAttribute('tabindex', '0');
    obra.setAttribute('role', 'button');
    const nome = obra.dataset.nome || '';
    obra.setAttribute('aria-label', `Abrir galeria do projeto ${nome}`);
    obra.addEventListener('click', () => abrirLupa(obra));
    obra.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirLupa(obra);
      }
    });
  });

  lupa.querySelector('.lupa__fechar').addEventListener('click', fecharLupa);
  lupa.querySelector('.lupa__nav--ant').addEventListener('click', () => ir(-1));
  lupa.querySelector('.lupa__nav--prox').addEventListener('click', () => ir(1));
  lupa.addEventListener('click', (e) => { if (e.target === lupa) fecharLupa(); });

  // Arrastar/deslizar (touch) para trocar de foto
  let x0 = null;
  lupa.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lupa.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) ir(dx < 0 ? 1 : -1);
    x0 = null;
  });

  document.addEventListener('keydown', (e) => {
    if (lupa.hidden) return;
    if (e.key === 'Escape') fecharLupa();
    if (e.key === 'ArrowLeft') ir(-1);
    if (e.key === 'ArrowRight') ir(1);
  });

  /* ── Revelar no scroll ── */
  const alvos = document.querySelectorAll('.revelar');
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !semMovimento) {
    document.documentElement.classList.add('js');
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('dentro');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    alvos.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 90}ms`;
      obs.observe(el);
    });
    // Rede de segurança: nada fica invisível se o observer travar.
    setTimeout(() => {
      alvos.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('dentro');
      });
    }, 2500);
  } else {
    alvos.forEach((el) => el.classList.add('dentro'));
  }

  /* ── Formulário → WhatsApp ── */
  const form = document.getElementById('form-contato');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valido = true;
    ['nome', 'fone', 'msg'].forEach((id) => {
      const campo = document.getElementById(id);
      const ok = campo.value.trim() !== '';
      campo.closest('.campo').classList.toggle('erro', !ok);
      if (!ok) valido = false;
    });
    if (!valido) {
      form.querySelector('.erro input, .erro textarea')?.focus();
      return;
    }

    const texto = [
      `Olá, Wellerson! Meu nome é ${form.nome.value.trim()}.`,
      `Tipo de projeto: ${form.tipo.value}`,
      `WhatsApp: ${form.fone.value.trim()}`,
      '',
      form.msg.value.trim(),
    ].join('\n');

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  });

  /* ── Ano no rodapé ── */
  document.getElementById('ano').textContent = new Date().getFullYear();
})();
