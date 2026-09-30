# Backlog de Tarefas: Weather App

Tarefas derivadas de [`plans/weather-app-plan.md`](../plans/weather-app-plan.md) e rastreadas à spec. IDs são estáveis; a ordem de execução é definida pelas entregas e dependências, não pela numeração. Tarefas marcadas `Nenhuma` podem começar em paralelo. Os gates de decisão devem ser resolvidos antes da publicação, ainda que partes da implementação possam avançar em paralelo.

## Rastreabilidade com a spec

| Tarefa | Requisitos, critérios ou decisões relacionados |
|---|---|
| T-01 | FR-01, FR-02, FR-03, FR-06; NFR-08; Open Question 1 |
| T-02 | NFR-01, NFR-04; Open Question 2 |
| T-03 | FR-02, FR-03; AC-04 a AC-08; Open Question 3 |
| T-04 | FR-01 a FR-06; AC-01 a AC-17 |
| T-05 | FR-04; AC-09 a AC-11 |
| T-06 | FR-04; AC-09 a AC-11 |
| T-07 | FR-02, FR-03; AC-04 a AC-08 |
| T-08 | FR-02, FR-03; AC-04 a AC-08 |
| T-09 | FR-02, FR-03; AC-05, AC-07; NFR-05 |
| T-10 | FR-02, FR-03; AC-05, AC-07; NFR-05 |
| T-11 | FR-01; AC-02, AC-03; NFR-07 |
| T-12 | FR-01; AC-02, AC-03; NFR-07 |
| T-13 | FR-01, FR-06; AC-01 a AC-04, AC-17; NFR-07, NFR-08 |
| T-14 | FR-01, FR-06; AC-01 a AC-04, AC-17; NFR-07, NFR-08 |
| T-15 | FR-02, FR-03, FR-06; AC-05 a AC-08; NFR-05, NFR-08 |
| T-16 | FR-02, FR-03, FR-06; AC-05 a AC-08; NFR-05, NFR-08 |
| T-17 | FR-01 a FR-06; AC-01 a AC-17; NFR-06, NFR-07 |
| T-18 | FR-01 a FR-06; AC-01 a AC-17; NFR-06, NFR-07 |
| T-19 | FR-01; AC-01 a AC-04, AC-17; NFR-02, NFR-07 |
| T-20 | FR-02; AC-05, AC-06; NFR-02, NFR-05 |
| T-21 | FR-03, FR-06; AC-07, AC-08; NFR-02, NFR-05 |
| T-22 | FR-06; AC-04, AC-08, AC-14 a AC-16; NFR-02, NFR-08 |
| T-23 | FR-01 a FR-06; AC-01 a AC-17 |
| T-24 | FR-05; AC-12, AC-13; NFR-03 |
| T-25 | FR-01; AC-01 a AC-04, AC-17; NFR-02, NFR-07 |
| T-26 | FR-02; AC-05, AC-06; NFR-02, NFR-05 |
| T-27 | FR-06; AC-14 a AC-16; NFR-02 |
| T-28 | US-01 a US-05; AC-01, AC-03, AC-05, AC-07, AC-09 a AC-13, AC-17 |
| T-29 | US-06; FR-06; AC-04, AC-08, AC-14 a AC-16 |
| T-30 | NFR-02; AC-12, AC-15 |
| T-31 | NFR-04; AC-12, AC-13 |
| T-32 | NFR-01; AC-16 |
| T-33 | NFR-01 a NFR-08; AC-01 a AC-17 |
| T-34 | FR-03; AC-07, AC-08 |
| T-35 | FR-03, FR-04; AC-07 a AC-11; NFR-02, NFR-05 |

## Prioridade e tamanho

`P0` bloqueia a primeira fatia visível de clima atual; `P1` completa o MVP e seus gates de release; `P2` seria trabalho adiável sem bloquear o escopo atual. Todas as tarefas P0 e P1 são necessárias antes de declarar o MVP completo; não há trabalho P2 no backlog porque ele não contém itens fora do escopo da spec. Tamanho relativo: `P` pequeno, `M` médio, `G` grande.

| Tarefa | Prioridade | Tamanho |
|---|---|---|
| T-01 | P0 | M |
| T-02 | P1 | M |
| T-03 | P0 | P |
| T-04 | P0 | P |
| T-05 | P0 | P |
| T-06 | P0 | P |
| T-07 | P0 | P |
| T-08 | P0 | P |
| T-09 | P0 | M |
| T-10 | P0 | P |
| T-11 | P0 | P |
| T-12 | P0 | P |
| T-13 | P0 | M |
| T-14 | P0 | M |
| T-15 | P0 | M |
| T-16 | P0 | M |
| T-17 | P0 | G |
| T-18 | P0 | M |
| T-19 | P0 | M |
| T-20 | P0 | P |
| T-21 | P1 | P |
| T-22 | P0 | P |
| T-23 | P0 | M |
| T-24 | P0 | M |
| T-25 | P0 | M |
| T-26 | P0 | P |
| T-27 | P0 | P |
| T-28 | P1 | G |
| T-29 | P1 | M |
| T-30 | P1 | M |
| T-31 | P1 | M |
| T-32 | P1 | G |
| T-33 | P1 | P |
| T-34 | P1 | P |
| T-35 | P1 | P |

## Sequência de fatias verticais

1. **Fatia 1 — Busca e clima atual (P0):** T-01, T-03, T-04, T-05, T-07, T-09, T-11, T-13, T-15, T-17, T-19, T-20, T-22, T-23 e T-24. Ao concluir T-24, já é possível demonstrar busca, seleção de cidade e clima atual em celular e desktop; o componente da previsão não bloqueia essa demonstração. Rodar os testes P0 correspondentes antes de integrar a fatia seguinte.
2. **Fatia 2 — Previsão diária (P1):** T-21, T-34 e T-35; completar a validação integrada com T-28 e T-29. A demonstração passa a mostrar clima atual e os cinco dias, inclusive estado parcial.
3. **Fatia 3 — Pronto para release (P1):** T-02, T-30, T-31, T-32 e T-33. Aprovar metas e matriz de suporte, verificar acessibilidade/compatibilidade/desempenho e executar os gates do repositório.

## Cobertura dos requisitos funcionais

| Requisito funcional | Tarefas de implementação | Tarefas de teste/verificação |
|---|---|---|
| FR-01 — Pesquisar cidade | T-11, T-13, T-17, T-19, T-23 | T-12, T-14, T-18, T-25, T-28, T-29 |
| FR-02 — Exibir clima atual | T-15, T-17, T-20, T-23 | T-16, T-18, T-26, T-28 |
| FR-03 — Exibir previsão diária | T-15, T-17, T-21, T-34 | T-16, T-18, T-28, T-29, T-35 |
| FR-04 — Alternar unidade | T-05, T-17, T-20, T-21, T-23 | T-06, T-18, T-26, T-28, T-35 |
| FR-05 — Suportar celular e desktop | T-19, T-20, T-21, T-22, T-23, T-24, T-34 | T-25, T-26, T-27, T-28, T-30, T-31, T-35 |
| FR-06 — Tratar estados da consulta | T-13, T-15, T-17, T-22, T-23, T-34 | T-14, T-16, T-18, T-27, T-29 |

Todos os requisitos funcionais FR-01 a FR-06 têm tarefas de implementação e verificação; nenhum ficou sem tarefa correspondente.

## Entrega 1 — Decisões e contratos

### T-01 — Validar contrato e condições da Open-Meteo

- **Descrição:** confirmar a disponibilidade dos campos, fuso, limites, atribuição e termos de uso necessários ao MVP.
- **Critérios de aceite:**
  - Registrar evidência para nome, ID, coordenadas e contexto geográfico da geocodificação.
  - Registrar evidência para observação atual, timezone, umidade relativa, vento, precipitação, pressão e cinco dias de condição, mínima, máxima e probabilidade máxima de precipitação.
  - Registrar limites, atribuição e termos aplicáveis; cada dado ou condição não disponível fica identificado como bloqueio ou decisão pendente.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `plans/weather-app-plan.md`.
- **Tipo:** Infra.

### T-02 — Aprovar metas operacionais e navegadores

- **Descrição:** obter aceite para os limites de desempenho, timeout e matriz de compatibilidade propostos no plano.
- **Critérios de aceite:**
  - Registrar decisão aprovada (ou substituta) para P95 de busca, P95 de forecast e timeout.
  - Registrar uma lista nominal de navegadores/dispositivos e versões suportadas.
  - Os valores aprovados aparecem em `plans/weather-app-plan.md`; não pode restar decisão em aberto nesta tarefa.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `plans/weather-app-plan.md`.
- **Tipo:** Infra.

### T-03 — Aprovar mapeamento pt-BR dos códigos WMO

- **Descrição:** validar descrições pt-BR, ícones e fallback para códigos desconhecidos.
- **Critérios de aceite:**
  - Uma tabela ou fonte de referência aprovada associa cada código WMO suportado à descrição pt-BR e à categoria de ícone.
  - Código nulo ou ausente da tabela é associado exatamente a “Condição indisponível”.
  - A referência aprovada está registrada em `plans/weather-app-plan.md` ou vinculada nele.
- **Dependências:** T-01.
- **Arquivos prováveis:** `plans/weather-app-plan.md`.
- **Tipo:** Infra.

### T-04 — Definir tipos de domínio compartilhados

- **Descrição:** criar os contratos TypeScript para cidade, clima atual, dia de previsão, dados consolidados, unidade e estados da consulta.
- **Critérios de aceite:**
  - `src/types/weather.ts` exporta `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e `Unit` com os campos definidos no plano.
  - Campos meteorológicos ausentes são tipados como anuláveis; nenhum valor default representa dado ausente.
  - Os status e códigos de erro compilam e distinguem `empty`, `network`, `api`, `timeout` e `invalid-response`.
  - `pnpm build` termina sem erros de tipo após a alteração.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Data.

## Entrega 2 — Funções puras

### T-05 — Implementar conversão de temperatura

- **Descrição:** criar funções puras para converter valores canônicos em Celsius e apresentar Celsius ou Fahrenheit.
- **Critérios de aceite:**
  - `0 °C`, `100 °C` e `-40 °C` produzem `32,0 °F`, `212,0 °F` e `-40,0 °F`; conversões inversas retornam `0,0 °C`, `100,0 °C` e `-40,0 °C`.
  - Saídas numéricas têm uma casa decimal e empates são arredondados para longe de zero.
  - Entrada `null` retorna `null`; valores de entrada não são alterados.
- **Dependências:** T-04.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data.

### T-07 — Implementar mapeamento de condições e ícones WMO

- **Descrição:** mapear códigos usados pela Open-Meteo às descrições aprovadas em pt-BR.
- **Critérios de aceite:**
  - Para cada código da tabela aprovada em T-03, a função retorna a descrição e o ícone correspondentes.
  - `null` e um código numérico ausente da tabela retornam “Condição indisponível” e o ícone de fallback.
  - `src/lib/weatherCodes.ts` não importa React nem executa chamadas de rede.
- **Dependências:** T-03, T-04.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Tipo:** Data.

### T-09 — Implementar formatação de rótulo do dia

- **Descrição:** criar funções puras em `lib/format.ts` para produzir rótulos legíveis de datas forecast sem deslocamento de calendário.
- **Critérios de aceite:**
  - `formatForecastDayLabel('2026-09-30')` retorna um rótulo pt-BR que identifica quarta-feira e 30/09.
  - O mesmo rótulo é retornado em processos com timezone local diferente.
  - Data inválida retorna resultado inválido em vez de lançar exceção.
- **Dependências:** T-04.
- **Arquivos prováveis:** `src/lib/format.ts`.
- **Tipo:** Data.

### T-11 — Normalizar termos de busca

- **Descrição:** implementar a validação de input vazio e normalização limitada a espaços externos.
- **Critérios de aceite:**
  - Input vazio ou composto somente por espaços retorna resultado inválido.
  - Para input válido, espaços externos são removidos e acentos, hífens, apóstrofos e espaços internos são preservados.
  - A função retorna texto literal e não interpreta HTML ou marcação.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/lib/searchQuery.ts`.
- **Tipo:** Data.

## Entrega 3 — Services

### T-13 — Implementar serviço de geocoding

- **Descrição:** consultar a API de geocoding e normalizar resultados para `City`.
- **Critérios de aceite:**
  - Montar URL com `name`, `count=10`, `language=pt` e `format=json`.
  - Mapear ID, nome, coordenadas, região e país; contexto ausente vira `null`.
  - Resposta JSON válida sem `results` ou com `results: []` retorna lista vazia; JSON inválido ou `results` com tipo incompatível retorna `invalid-response`.
  - HTTP não-2xx retorna `api`; rejeição de `fetch` retorna `network`; 10 segundos sem resposta retorna `timeout`.
  - Aceitar `AbortSignal` e não iniciar forecast.
- **Dependências:** T-04, T-11.
- **Arquivos prováveis:** `src/services/geocodingService.ts`.
- **Tipo:** Data.

### T-15 — Implementar serviço de forecast

- **Descrição:** consultar dados atuais e diários, validar payload e normalizar para `WeatherData`.
- **Critérios de aceite:**
  - Montar a solicitação com coordenadas, `current`, `daily`, `temperature_unit=celsius`, `wind_speed_unit=kmh`, `timezone=auto` e `forecast_days=5`.
  - Incluir `relative_humidity_2m`, `wind_speed_10m`, `precipitation` e `surface_pressure` em `current`.
  - Incluir `precipitation_probability_max` em `daily`.
  - Mapear observação, timezone e arrays diários por índice, preservando temperaturas canônicas em Celsius.
  - Mapear umidade para %, vento para km/h, precipitação para mm e pressão para hPa; valores ausentes ou inválidos viram `null`.
  - Mapear a probabilidade máxima diária para `precipitationProbabilityPercent`, mantendo valores de 0 a 100 e `null` se ausente ou inválida.
  - Mapear cada campo do payload para o campo correspondente de `WeatherData`/`ForecastDay`; campo ausente ou não finito vira `null`.
  - `forecastComplete` é `true` somente com cinco datas consecutivas no fuso retornado e condition/min/max válidos em cada dia; caso contrário, é `false`.
  - Payload com ao menos um dado meteorológico utilizável retorna dados parciais; payload sem nenhum dado utilizável retorna `invalid-response`.
- **Dependências:** T-01, T-04, T-07, T-09.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data.

## Entrega 4 — Hook e estado

### T-17 — Implementar hook de fluxo meteorológico

- **Descrição:** orquestrar busca, seleção, forecast, unidade, retry manual e estados de consulta.
- **Critérios de aceite:**
  - Pesquisa e consulta têm estados independentes; vazio da pesquisa resulta em `searchStatus=empty`.
  - Qualquer payload meteorológico com pelo menos um campo utilizável resulta em `weatherStatus=success`; forecast incompleto mantém `forecastComplete=false`.
  - Erros preservam os códigos `network`, `api`, `timeout` ou `invalid-response`; retry manual gera exatamente uma chamada.
  - Ao selecionar uma nova cidade, os dados da cidade anterior são limpos; respostas anteriores não alteram estado.
  - Alternar unidade não chama nenhum service e mantém cidade e datas.
  - Query e unidade não são gravadas em `localStorage` ou `sessionStorage`; um novo carregamento inicia em Celsius sem query persistida.
- **Dependências:** T-11, T-13, T-15.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** UI.

## Entrega 5 — Componentes

### T-19 — Implementar busca e seleção de cidade

- **Descrição:** criar os componentes de formulário e lista de resultados conectáveis por props.
- **Critérios de aceite:**
  - Input aceita acentos, espaços, hífens e apóstrofos; envio vazio não aciona `onSearch`.
  - Cada resultado renderiza nome e contexto geográfico disponível e sua seleção aciona `onSelectCity` uma vez com o `City` correspondente.
  - Input, submit e resultados têm roles/names acessíveis; busca e seleção são operáveis por teclado.
- **Dependências:** T-11, T-17.
- **Arquivos prováveis:** `src/components/SearchForm.tsx`, `src/components/CityResults.tsx`.
- **Tipo:** UI.

### T-20 — Implementar visualização do clima atual

- **Descrição:** apresentar um hero meteorológico com cidade, temperatura, condição/ícone e métricas atuais.
- **Critérios de aceite:**
  - A temperatura é destacada e convertida pela função de `lib/temperature` usando `unit`; condição e ícone vêm de `lib/weatherCodes`.
  - Renderiza umidade em %, vento em km/h, precipitação em mm e pressão em hPa.
  - Valores nulos são exibidos como indisponíveis; código WMO desconhecido usa descrição e ícone de fallback.
- **Dependências:** T-05, T-07, T-09, T-17.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`, `src/lib/temperature.ts`, `src/lib/weatherCodes.ts`.
- **Tipo:** UI.

### T-21 — Implementar visualização da previsão

- **Descrição:** apresentar os dias válidos, condições e temperaturas mínima/máxima.
- **Critérios de aceite:**
  - Previsão completa renderiza exatamente cinco itens na ordem de hoje até hoje + 4.
  - Cada item apresenta rótulo do dia de `lib/format`, ícone WMO, temperaturas mínima/máxima na unidade selecionada e probabilidade de chuva em %.
  - Previsão parcial renderiza somente os campos recebidos e apresenta “Previsão incompleta”.
- **Dependências:** T-05, T-07, T-09, T-17.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`.
- **Tipo:** UI.

### T-22 — Implementar estados de status e erro

- **Descrição:** apresentar loading, vazio, falha categorizada e retry manual.
- **Critérios de aceite:**
  - Para cada estado `loading`, `empty`, `network`, `api`, `timeout` e `invalid-response`, a UI renderiza o respectivo estado/mensagem pt-BR em região acessível; os estados de erro são distinguíveis.
  - O controle retry aciona o callback uma vez por ativação por teclado ou ponteiro; nenhum retry ocorre sem ativação.
  - Texto renderizado não contém payload, URL interna ou stack trace fornecido como erro.
- **Dependências:** T-17.
- **Arquivos prováveis:** `src/components/WeatherStatus.tsx`.
- **Tipo:** UI.

## Entrega 6 — Integração

### T-23 — Compor a aplicação

- **Descrição:** compor a primeira fatia vertical de busca e clima atual pelo ponto de entrada da aplicação, sem aguardar o componente da previsão.
- **Critérios de aceite:**
  - `App.tsx` chama `useWeather` e passa estado e callbacks por props a `SearchForm`, `CityResults`, `CurrentWeather` e `WeatherStatus`.
  - Não existem imports de `src/services/` em `App.tsx` ou `src/components/`.
  - Busca, seleção e clima atual funcionam sem exibir previsão diária; `App.tsx` não mantém cópias locais de query, cidade, dados meteorológicos ou unidade.
- **Dependências:** T-19, T-20, T-22.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI.

### T-24 — Ajustar o layout responsivo da aplicação

- **Descrição:** adequar o contêiner e a composição global aos viewports de aceite.
- **Critérios de aceite:**
  - No browser, com viewports 390 × 844 e 1280 × 800, `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
  - Rolagem vertical é possível quando o conteúdo excede 844 ou 800 px de altura.
  - Alterações desta tarefa ficam em `src/App.tsx` e `src/index.css`; nenhuma regra de serviço ou domínio é alterada.
- **Dependências:** T-23.
- **Arquivos prováveis:** `src/App.tsx`, `src/index.css`.
- **Tipo:** UI.

### T-34 — Integrar previsão diária à aplicação

- **Descrição:** adicionar o componente de previsão à composição existente do clima atual.
- **Critérios de aceite:**
  - `App.tsx` passa os cinco dias e a unidade atual a `ForecastList`.
  - Selecionar cidade exibe clima atual e previsão; resposta parcial apresenta “Previsão incompleta”.
  - Com previsão completa, em 390 × 844 e 1280 × 800 pixels, `scrollWidth <= clientWidth`.
  - A integração não cria cópia local de forecast ou unidade fora do estado de `useWeather`.
- **Dependências:** T-21, T-23, T-24.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI.

## Entrega 7 — Testes

### T-06 — Testes unitários da conversão de temperatura

- **Descrição:** criar testes unitários Vitest para as funções puras de `src/lib/temperature.ts`.
- **Critérios de aceite:**
  - Asserções verificam `0 °C = 32,0 °F`, `100 °C = 212,0 °F` e `-40 °C = -40,0 °F`, e os três valores retornam ao Celsius original.
  - Asserções verificam uma casa decimal e empate arredondado para longe de zero em ambos os sinais.
  - `null` produz `null`, nunca `0` ou `NaN`.
- **Dependências:** T-05.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Tipo:** Test.

### T-08 — Testar mapeamento WMO

- **Descrição:** verificar descrições e ícones dos códigos aprovados e seus fallbacks.
- **Critérios de aceite:**
  - Para cada código da tabela de T-03, asserções comparam descrição e ícone com os valores aprovados.
  - Código não mapeado e `null` retornam “Condição indisponível” e o ícone de fallback.
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/unit/weatherCodes.test.ts`.
- **Tipo:** Test.

### T-10 — Testar rótulo local do dia

- **Descrição:** verificar a formatação pt-BR dos rótulos diários do forecast.
- **Critérios de aceite:**
  - `formatForecastDayLabel('2026-09-30')` retorna um rótulo que identifica quarta-feira e 30/09.
  - O mesmo rótulo é retornado quando o timezone local do processo de teste muda.
  - Data inválida retorna “Data indisponível” sem exceção não tratada.
- **Dependências:** T-09.
- **Arquivos prováveis:** `tests/unit/format.test.ts`.
- **Tipo:** Test.

### T-12 — Testar normalização de busca

- **Descrição:** verificar validação de input e preservação de nomes de cidades.
- **Critérios de aceite:**
  - Input vazio e composto somente por espaços retornam resultado inválido; `"  São Paulo  "` retorna `"São Paulo"`.
  - `"São José-dos-Campos d'Avila"` retorna o mesmo texto interno, preservando acentos, hífen e apóstrofo.
- **Dependências:** T-11.
- **Arquivos prováveis:** `tests/unit/searchQuery.test.ts`.
- **Tipo:** Test.

### T-14 — Testar service de geocoding com fetch mockado

- **Descrição:** testar isoladamente `geocodingService` substituindo `fetch` por mock, sem acessar rede real.
- **Critérios de aceite:**
  - `fetch` mockado confirma parâmetros codificados corretamente e mapeamento para `City`.
  - Resposta JSON válida sem `results` ou com `results: []` é estado vazio; JSON inválido ou tipo incompatível é erro de resposta.
  - Asserções verificam `api` para HTTP não-2xx, `network` para rejeição de `fetch`, `timeout` ao atingir 10 s e `invalid-response` para JSON/schema inválido.
  - Cancelamento não atualiza resultados nem apresenta mensagem de falha ao usuário.
- **Dependências:** T-13.
- **Arquivos prováveis:** `tests/unit/geocodingService.test.ts`.
- **Tipo:** Test.

### T-16 — Testar serviço de forecast

- **Descrição:** verificar parâmetros, alinhamento dos arrays e classificação de resposta completa, parcial ou inválida.
- **Critérios de aceite:**
  - `fetch` mockado valida URL, unidades, timezone e cinco dias.
  - `daily` solicita `precipitation_probability_max` e cada valor entre 0–100 mapeia por índice para `precipitationProbabilityPercent`.
  - Dados completos produzem cinco `ForecastDay` em ordem correta.
  - Dados de fixture verificam o mapeamento de umidade, vento, precipitação, pressão e probabilidade de chuva para suas unidades normalizadas.
  - Arrays com tamanhos diferentes não produzem associação por índice inválido; campos ausentes/não finitos resultam em `null` e `forecastComplete=false`.
  - Payload parcial com dado utilizável retorna sucesso incompleto; sem dado utilizável retorna `invalid-response`.
  - Asserções verificam `api`, `network`, `timeout` e cancelamento de acordo com o contrato de serviço.
- **Dependências:** T-15.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Tipo:** Test.

### T-18 — Testar estados e orquestração do hook

- **Descrição:** verificar transições de estado e coordenação entre serviços com dependências substituídas.
- **Critérios de aceite:**
  - Para cada transição configurada, asserções verificam status e dados resultantes em `idle`, `loading`, `success`, `error` e `empty`.
  - Payload parcial com dado utilizável termina em `success` e `forecastComplete=false`; sem dado utilizável termina em `error` com `invalid-response`.
  - Testes verificam uma chamada por retry, ignoram resolução fora de ordem e confirmam zero chamadas ao alternar unidade.
  - Teste de montagem/recarregamento confirma que query e unidade não são persistidas e que a unidade inicial é Celsius.
- **Dependências:** T-17.
- **Arquivos prováveis:** `tests/unit/useWeather.test.tsx`.
- **Tipo:** Test.

### T-25 — Testar busca e seleção de cidade na UI

- **Descrição:** cobrir os componentes de busca e resultados com Testing Library.
- **Critérios de aceite:**
  - Ao enviar termo válido do fixture, `onSearch` recebe o texto esperado uma vez e a lista renderiza os resultados do fixture.
  - Input vazio não chama `onSearch`; o termo com acento, hífen e apóstrofo é recebido sem alteração.
  - Selecionar o resultado de fixture aciona `onSelectCity` uma vez com o ID esperado; busca e seleção podem ser feitas por teclado e localizadas por role/name.
  - Um termo contendo marcação, como `<img src=x onerror=alert(1)>`, é exibido como texto e não cria elemento `img` ou executa conteúdo.
- **Dependências:** T-19, T-23.
- **Arquivos prováveis:** `tests/unit/components/SearchForm.test.tsx`, `tests/unit/components/CityResults.test.tsx`.
- **Tipo:** Test.

### T-26 — Testar clima atual na UI

- **Descrição:** cobrir a apresentação do clima atual com dados controlados.
- **Critérios de aceite:**
  - Com fixture atual, o teste encontra temperatura, unidade, descrição/ícone WMO e umidade, vento, precipitação e pressão com unidades esperadas.
  - Métricas ausentes exibem indisponível; código WMO desconhecido exibe “Condição indisponível” e ícone de fallback.
  - Para a mesma temperatura, props Celsius e Fahrenheit produzem os valores e símbolos definidos por T-05.
- **Dependências:** T-20, T-23.
- **Arquivos prováveis:** `tests/unit/components/CurrentWeather.test.tsx`.
- **Tipo:** Test.

### T-35 — Testar previsão diária na UI

- **Descrição:** cobrir previsão completa e parcial com dados controlados.
- **Critérios de aceite:**
  - Fixture completa renderiza exatamente cinco cards em ordem cronológica, de hoje até hoje + 4.
  - Cada card exibe rótulo de `lib/format`, ícone WMO, máxima/mínima convertidas conforme `unit` e probabilidade de chuva em porcentagem.
  - Probabilidade `null` exibe indisponível; fixture parcial exibe somente dados válidos e “Previsão incompleta”.
- **Dependências:** T-21, T-34.
- **Arquivos prováveis:** `tests/unit/components/ForecastList.test.tsx`.
- **Tipo:** Test.

### T-27 — Testar estados loading, erro e vazio dos componentes

- **Descrição:** testar os estados dos componentes com Testing Library, cobrindo vazio e loading, além das categorias de erro.
- **Critérios de aceite:**
  - Cada estado input fixture (loading, empty, network, api, timeout e invalid-response) renderiza a região acessível correspondente.
  - Ativar retry por teclado ou ponteiro chama o callback uma vez; renderizar erro sem interação chama zero vezes.
  - Com payload bruto contendo stack trace, a mensagem visível não inclui o stack trace nem a resposta JSON.
- **Dependências:** T-22, T-23.
- **Arquivos prováveis:** `tests/unit/components/WeatherStatus.test.tsx`.
- **Tipo:** Test.

### T-28 — Testar a jornada principal com E2E

- **Descrição:** validar busca, seleção e consulta meteorológica com APIs interceptadas em desktop e no projeto Playwright `mobile`.
- **Critérios de aceite:**
  - Com rotas interceptadas, a pessoa pesquisa o termo fixture, seleciona a cidade fixture e a UI identifica essa cidade.
  - A resposta fixture completa produz clima atual e exatamente cinco itens diários; alternar unidade atualiza valores e símbolos sem nova requisição de forecast.
  - O teste passa no projeto `mobile` em 390 × 844 e em `chromium` desktop em 1280 × 800, verifica `scrollWidth <= clientWidth` e não faz requisições aos endpoints reais.
- **Dependências:** T-23, T-24, T-34, T-06, T-08, T-10, T-12, T-14, T-16, T-18, T-25, T-26, T-35.
- **Arquivos prováveis:** `tests/e2e/weather-search-and-forecast.spec.ts`.
- **Tipo:** Test.

### T-29 — Testar falhas e recuperação com E2E

- **Descrição:** validar estados vazio, erro, timeout, resposta parcial e retry manual em fluxo integrado.
- **Critérios de aceite:**
  - Resposta de geocoding sem resultados exibe estado vazio e a rota forecast tem contador de chamadas igual a zero.
  - Fixtures de erro de rede/API e timeout exibem estado de erro; ativar retry gera exatamente uma nova chamada.
  - Fixture parcial exibe “Previsão incompleta” e não renderiza cinco dias como se todos fossem válidos.
- **Dependências:** T-23, T-24, T-14, T-16, T-18, T-27.
- **Arquivos prováveis:** `tests/e2e/weather-error-recovery.spec.ts`.
- **Tipo:** Test.

## Entrega 8 — Hardening

### T-30 — Verificar acessibilidade

- **Descrição:** realizar a verificação WCAG 2.2 AA dos fluxos principais, além dos testes automatizados.
- **Critérios de aceite:**
  - Checklist registra resultado de busca, seleção, consulta e retry operados somente por teclado.
  - Checklist registra ordem de foco, nomes acessíveis, contraste e anúncios de estados para cada fluxo principal.
  - Cada falha tem referência ao critério NFR-02 e severidade; qualquer falha impeditiva fica marcada como bloqueio de release.
- **Dependências:** T-24, T-28, T-29.
- **Arquivos prováveis:** `tests/e2e/`, checklist de QA acordado para o release.
- **Tipo:** Test.

### T-31 — Verificar compatibilidade de navegadores

- **Descrição:** executar smoke tests por navegador e dispositivo conforme matriz aprovada em T-02.
- **Critérios de aceite:**
  - Um resultado passa/falha e versão executada é registrado para cada navegador/dispositivo aprovado em T-02.
  - Em cada ambiente, busca, seleção, consulta atual, previsão e troca de unidade passam; falha em qualquer fluxo é registrada e bloqueia release.
- **Dependências:** T-02, T-24, T-28, T-29.
- **Arquivos prováveis:** `playwright.config.ts`, `tests/e2e/`, checklist de QA acordado para o release.
- **Tipo:** Test.

### T-32 — Validar metas de desempenho

- **Descrição:** medir os fluxos conforme protocolo aprovado e registrar P95 de busca e consulta meteorológica.
- **Critérios de aceite:**
  - Registrar 100 durações bem-sucedidas para geocoding e 100 para forecast, com RTT e largura de banda dentro dos limites de T-02.
  - Calcular P95 separado por fluxo e comparar com os limites aprovados; registrar pass/fail e configuração do ambiente.
  - Teste controlado confirma timeout no valor aprovado; medições usam ambiente mockado/controlado, sem rajada de chamadas ao provedor público.
- **Dependências:** T-02, T-24, T-28.
- **Arquivos prováveis:** `tests/e2e/`, relatório de QA acordado para o release.
- **Tipo:** Test.

### T-33 — Executar gates do repositório

- **Descrição:** executar lint, build e testes definidos pelo projeto antes de considerar a entrega concluída.
- **Critérios de aceite:**
  - Os quatro comandos (`pnpm lint`, `pnpm build`, `pnpm test`, `pnpm test:e2e`) têm exit code 0 para aprovar o gate.
  - Para exit code diferente de 0, registrar comando, saída relevante e classificação como regressão da feature ou falha preexistente; gate permanece bloqueado até resolução ou aceite explícito.
- **Dependências:** T-06, T-08, T-10, T-12, T-14, T-16, T-18, T-25, T-26, T-27, T-28, T-29, T-30, T-31, T-32.
- **Arquivos prováveis:** Nenhum; somente validação dos arquivos em `src/` e `tests/`.
- **Tipo:** Infra.