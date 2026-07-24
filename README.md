# 🚀 RotinaActivity Ultimate

> **Sistema Avançado e de Alta Performance para Monitorização de Atividade Pessoal, Produtividade e Coaching Inteligente com Foco Absoluto em Privacidade.**

![RotinaActivity Banner](icon.png)

---

## 📌 Visão Geral

O **RotinaActivity Ultimate** é uma aplicação desktop de próxima geração para Windows (64-bit), desenhada para utilizadores que procuram controlo total sobre o seu tempo, foco e produtividade diária. 

Inspirado em ferramentas como o *ActivityWatch*, o RotinaActivity eleva o conceito de rastreio de atividade ao combinar uma interface ultra-moderna (estilo Linear / Notion / Raycast / Arc), inteligência artificial local e em nuvem, replay forense minuto a minuto, automação de fluxos de trabalho e arquitetura **100% Offline-First**.

---

## ✨ Principais Funcionalidades

### ⚡ 1. Dashboard 360° de Produtividade
- **Pontuação de Produtividade em Tempo Real (0–100)**: Cálculo dinâmico baseado em hábitos, trocas de contexto e metas.
- **Gráficos Interativos**: Visualização por aplicação, site, categoria e projeto com gráficos de barras, linhas, radar e áreas.
- **Rastreio de Trocas de Contexto**: Mapeamento da dispersão de atenção ao longo do dia.
- **Métricas Globais**: Tempo ativo, tempo inativo (idle), rácio foco/pausa e estimativa de ganhos/horas faturáveis.

### 🔍 2. Linha do Tempo Forense & Replay (Forensic Timeline)
- **Scrubber Minuto a Minuto**: Navegação temporal contínua para inspecionar exatamente o que foi executado em qualquer momento do dia.
- **Filtros Avançados**: Pesquisa imediata por palavras-chave em títulos de janelas, URLs ou nomes de processos.

### 🤖 3. Coach de Produtividade com IA (Ollama Local & Cloud LLM)
- **Suporte Duplo**: Funciona 100% offline com **Ollama** (Llama 3, Mistral, Phi, etc.) ou com **OpenAI / Cloud LLMs**.
- **Análise Natural**: Resposta a perguntas diretas (*Ex.: "Quantas horas passei em reuniões esta semana?"*).
- **Detetor de Burnout & Dicas**: Identificação de padrões de fadiga, sessões excessivas sem pausas e sugestões de otimização de rotina.

### 🛡️ 4. Centro de Auditoria de Privacidade & Cofre Zero-Knowledge
- **Privacidade em Primeiro Lugar**: Base de dados local SQLite sem qualquer telemetria obrigatória.
- **Regras de Ofuscação por Regex**: Ocultação automática de títulos sensíveis (palavras-chave, dados bancários, etc.).
- **Detetor de Modo Incógnito**: Pausa ou anonimização automática durante navegação privada.
- **Cofre Encriptado AES-256**: Backups locais com encriptação *Zero-Knowledge*.

### 🎯 5. Modo Foco & Trabalho Profundo (Deep Work)
- **Temporizador Pomodoro Adaptativo**: Sessões configuráveis de trabalho com intervalos automáticos.
- **Bloqueador de Distrações**: Silenciamento de notificações e alertas durante o trabalho focado.
- **Score de Recuperação de Foco**: Medição do tempo necessário para retomar a concentração após interrupções.

### ⚡ 6. Motor Visual de Automação IF/THEN
- **Criador de Regras Visuais**: Ex.: *SE o processo for `Code.exe` ENTÃO atribui ao Projeto "RotinaActivity" e ativa o Modo Foco*.
- **Ações Automáticas**: Mapeamento automático de categorias, projetos e regras de privacidade.

### 💻 7. Monitor de Hardware & Desempenho do Sistema
- Correlação em tempo real do uso de **CPU, RAM, Disco e Rede** com os seus níveis de produtividade.

### 🏆 8. Metas, Gamificação & Projetos
- Metas diárias/semanais de foco, contadores de *streaks* (dias consecutivos), níveis de evolução e conquistas desbloqueáveis (*Badges*).

### 📊 9. Relatórios & Exportador Multi-Formato
- Exportação completa em **PDF, Excel/CSV, JSON e Markdown** com resumos visuais e síntese gerada por IA.

### 🔧 10. Agente de Bandeja do Sistema (RotinaActivityAgent)
- Processo leve em segundo plano na barra de tarefas (System Tray) para monitorização contínua com consumo mínimo de recursos.

---

## 🛠️ Arquitetura & Tecnologias

- **Backend & Host Desktop**: .NET 8 C# (WPF + Chromium WebView2)
- **Agente em Segundo Plano**: .NET 8 Win32 Service Agent (`RotinaActivityAgent`)
- **Frontend / Interface**: React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Vite
- **Armazenamento**: Base de Dados Local SQLite (`Microsoft.Data.Sqlite`) com suporte a exportação PostgreSQL
- **Servidor Interno**: Kestrel REST & WebSocket API para comunicação local bidirecional
- **Compilação & Instalador**: Script PowerShell automatizado (`build.ps1`) e Inno Setup 6 (`setup.iss`)

---

## 📂 Estrutura do Projeto

```text
RotinaActivity/
├── src/
│   ├── RotinaActivity/          # Aplicação Principal (.NET 8 WPF + API Kestrel)
│   │   ├── Abstractions/        # Modelos e Interfaces
│   │   ├── Services/            # Rastreio Win32, SQLite, IA Coach, Automação
│   │   ├── MainWindow.xaml.cs   # Inicialização do WebView2 e Servidor Local
│   │   └── ui/                  # Aplicação Frontend em React + TypeScript + Vite
│   │       ├── src/             # Componentes da Interface (Dashboard, Timeline, AI Coach, etc.)
│   │       └── package.json     # Dependências Node.js
│   │
│   └── RotinaActivityAgent/     # Agente de Bandeja do Sistema (.NET 8 Background Agent)
│       └── Program.cs           # Monitorização Win32 de janelas e idle time
│
├── build.ps1                    # Script PowerShell de compilação e diagnóstico
├── setup.iss                    # Script do instalador Inno Setup 6
├── RotinaActivity.sln           # Solução Visual Studio / .NET 8
├── icon.ico / icon.png          # Ícones oficiais do sistema
├── .gitignore                   # Ficheiros ignorados pelo Git
└── README.md                    # Documentação do projeto
```

---

## ⚙️ Requisitos do Sistema

- **Sistema Operativo**: Windows 10 ou Windows 11 (64-bit)
- **Para Desenvolvimento / Compilação**:
  - [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
  - [Node.js 18+](https://nodejs.org/) (com npm)
  - [Inno Setup 6](https://jrsoftware.org/isinfo.php) (opcional, para gerar o instalador `.exe`)
  - [Ollama](https://ollama.com/) (opcional, para IA 100% local)

---

## 🚀 Como Executar e Compilar

### 1. Modo de Desenvolvimento (Development)

1. **Instalar dependências e compilar a UI**:
   ```powershell
   cd src/RotinaActivity/ui
   npm install
   npm run build
   cd ../../../
   ```

2. **Abrir e Executar o Projeto**:
   - Abra a solução `RotinaActivity.sln` no Visual Studio 2022 ou VS Code.
   - Execute o projeto `RotinaActivity` (ou prima `F5`).

---

### 2. Compilação Automática e Geração do Instalador (Production Pipeline)

O projeto inclui um pipeline automatizado via `build.ps1` que realiza todo o processo de build, geração de executáveis portáveis e criação do instalador:

```powershell
# Executar o script de build automatizado no PowerShell
.\build.ps1
```

O script irá automaticamente:
1. Converter/verificar os ícones da aplicação (`icon.ico` / `icon.png`).
2. Compilar a UI web (`React / Vite`).
3. Compilar a aplicação principal (`RotinaActivity.exe`) e o agente (`RotinaActivityAgent.exe`) em ficheiros únicos e autónomos (*single-file self-contained win-x64*).
4. Gerar a pasta portável em `publish_portable/`.
5. Invocar o Inno Setup para criar o instalador em `Output/RotinaActivity_Setup.exe`.
6. Registar todos os diagnósticos e logs de execução em `build.txt`.

---

## 📤 Como Preparar e Enviar para o GitHub

Para publicar a sua aplicação no GitHub pela primeira vez, siga os passos abaixo no PowerShell ou Terminal:

### Passo 1: Inicializar o Repositório Git (caso ainda não esteja inicializado)
```powershell
git init
```

### Passo 2: Adicionar os Ficheiros e Fazer o Commit Inicial
*(O ficheiro `.gitignore` já está configurado para ignorar pastas pesadas como `node_modules`, `bin`, `obj`, `Output`, etc.)*

```powershell
git add .
git commit -m "Initial commit: RotinaActivity Ultimate - Sistema de Produtividade & IA"
```

### Passo 3: Criar um Repositório no GitHub
1. Aceda a [GitHub - New Repository](https://github.com/new).
2. Dê o nome ao repositório: `RotinaActivity` (ou o nome da sua preferência).
3. Deixe o repositório **Público** ou **Privado** e **não** assinale a opção de criar um README (pois já o criámos).
4. Clique em **Create repository**.

### Passo 4: Associar o Repositório Remoto e Fazer Push
Copie o URL do seu novo repositório GitHub e execute os seguintes comandos no terminal:

```powershell
# Mudar o ramo principal para 'main'
git branch -M main

# Associar o repositório do GitHub (substitua SEU_USUARIO pelo seu utilizador do GitHub)
git remote add origin https://github.com/SEU_USUARIO/RotinaActivity.git

# Enviar os ficheiros para o GitHub
git push -u origin main
```

---

## 🔒 Garantia de Privacidade

O **RotinaActivity** foi concebido com uma filosofia **Privacy-First**:
- **0% Telemetria Obrigatória**: Todos os seus dados de rastreio de janelas, títulos e hábitos ficam armazenados estritamente na sua máquina na base de dados SQLite local.
- **Processamento Local de IA**: Quando utilizado com o Ollama, nenhuma informação sai do seu computador.

---

## 📄 Licença

Este projeto é disponibilizado sob a licença MIT. Consulte o ficheiro [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">Desenvolvido com ❤️ para máxima produtividade e privacidade.</p>
# RotinaActivity
