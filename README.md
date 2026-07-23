# Wellerson Pessotto — Arquitetura, Interiores e Urbanismo

Site institucional de página única. HTML, CSS e JavaScript puros, sem dependências
e sem etapa de build: basta servir a pasta.

## Rodar localmente

```sh
python3 -m http.server 8899
```

Abra <http://localhost:8899>.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Todas as seções da página |
| `styles.css` | Estilos e paleta (variáveis CSS no `:root`) |
| `script.js` | Menu mobile, filtro de projetos, lightbox e envio do formulário |
| `assets/hero/` | Banner do primeiro bloco (versão desktop e mobile) |
| `assets/projetos/` | As 11 imagens da galeria |
| `assets/logo*.png`, `assets/marca*.png` | Logo e símbolo com fundo transparente |

As imagens originais enviadas pelo cliente não são versionadas (ver `.gitignore`);
`assets/` contém as versões já redimensionadas que o site usa.

## Ainda a preencher

Estes valores estão com marcadores no código:

- **CAU** no rodapé — hoje `000000-0` (`index.html`)
- **Link do Instagram** — aponta para `instagram.com` genérico
- **Cidade / região de atendimento** — hoje "Presencial na região"; informar a
  cidade real ajuda no buscador
- **E-mail** — `contato@wellersonpessotto.com.br`, confirmar se existe

O WhatsApp já está configurado: `5555996615052`, definido em `script.js` e nos
links do `index.html`.

## Formulário de contato

Não envia e-mail. Ele monta a mensagem e abre o WhatsApp com o texto pronto,
por isso não exige servidor. Para receber por e-mail, seria preciso plugar um
serviço externo.
