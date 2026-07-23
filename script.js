/* Wellerson Pessotto — interações */
(() => {
  'use strict';

  const WHATSAPP = '5555996615052';

  /* ── Topo: fundo sólido depois do hero ── */
  const topo = document.querySelector('.topo');
  const flutuante = document.querySelector('.wpp-flutuante');

  const aoRolar = () => {
    const passou = window.scrollY > window.innerHeight * 0.72;
    topo.classList.toggle('encolhido', window.scrollY > 40);
    flutuante.classList.toggle('visivel', passou);
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

  /* ── Lightbox ── */
  const lupa = document.getElementById('lupa');
  const lupaImg = document.getElementById('lupa-img');
  const lupaLegenda = document.getElementById('lupa-legenda');
  let indice = 0;

  const visiveis = () => obras.filter((o) => !o.classList.contains('oculta'));

  const mostrar = (i) => {
    const lista = visiveis();
    if (!lista.length) return;
    indice = (i + lista.length) % lista.length;
    const obra = lista[indice];
    const img = obra.querySelector('img');
    lupaImg.src = img.src;
    lupaImg.alt = img.alt;
    lupaLegenda.textContent = `${obra.querySelector('.obra__cat').textContent} — ${obra.querySelector('.obra__nome').textContent}`;
  };

  const abrirLupa = (i) => {
    mostrar(i);
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
    obra.addEventListener('click', () => abrirLupa(visiveis().indexOf(obra)));
    obra.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirLupa(visiveis().indexOf(obra));
      }
    });
  });

  lupa.querySelector('.lupa__fechar').addEventListener('click', fecharLupa);
  lupa.querySelector('.lupa__nav--ant').addEventListener('click', () => mostrar(indice - 1));
  lupa.querySelector('.lupa__nav--prox').addEventListener('click', () => mostrar(indice + 1));
  lupa.addEventListener('click', (e) => { if (e.target === lupa) fecharLupa(); });

  document.addEventListener('keydown', (e) => {
    if (lupa.hidden) return;
    if (e.key === 'Escape') fecharLupa();
    if (e.key === 'ArrowLeft') mostrar(indice - 1);
    if (e.key === 'ArrowRight') mostrar(indice + 1);
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
