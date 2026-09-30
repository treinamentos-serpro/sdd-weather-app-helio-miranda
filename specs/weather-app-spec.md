# Especificação de Produto: Weather App

## Overview

O Weather App é uma aplicação web em pt-BR para consultar o clima atual e a previsão diária de uma cidade. A pessoa pesquisa e seleciona o local, consulta hoje e os quatro dias seguintes e alterna temperaturas entre Celsius e Fahrenheit. O MVP prioriza consulta rápida em celular e planejamento em desktop, sem conta, geolocalização automática, histórico ou armazenamento de dados meteorológicos.

Open-Meteo é a fonte definida para geocodificação e meteorologia. A especificação define como dados da fonte são apresentados; a publicação depende de validar contrato, limites, termos e atribuição do provedor.

## Functional Requirements

- **FR-01 — Pesquisar cidade:** aceitar nome de cidade com acentos, espaços, hífens e apóstrofos; apresentar resultados selecionáveis com nome e contexto geográfico disponível; não pesquisar input vazio ou composto apenas por espaços.
- **FR-02 — Exibir clima atual:** exibir temperatura, condição meteorológica em pt-BR, horário da atualização no fuso da cidade, umidade relativa, velocidade do vento, precipitação e pressão atmosférica, quando os respectivos dados forem válidos.
- **FR-03 — Exibir previsão diária:** exibir cinco datas consecutivas, hoje e os quatro dias seguintes no calendário local da cidade. Cada dia contém condição, temperaturas mínima e máxima e probabilidade máxima de precipitação quando válidas.
- **FR-04 — Alternar unidade:** apresentar Celsius após cada novo carregamento da aplicação; permitir alternância bidirecional para Fahrenheit. Exibir temperaturas com uma casa decimal, aplicando conversão antes do arredondamento.
- **FR-05 — Suportar celular e desktop:** disponibilizar busca, seleção, clima atual, previsão e alternância de unidade em ambos os formatos, sem rolagem horizontal da página nas viewports de aceite.
- **FR-06 — Tratar estados da consulta:** comunicar carregamento, ausência de resultados, erro, timeout e resposta parcial. A nova tentativa é manual; cada acionamento inicia uma única consulta.

## User Stories

- **US-01 (FR-01) — Busca de destino:** Como Rafael, viajante que pesquisa lugares que não conhece, quero buscar e selecionar uma cidade para consultar o clima do destino correto.
- **US-02 (FR-02) — Clima para hoje:** Como Joana, pessoa que decide o que vestir ou levar, quero consultar o clima atual da cidade selecionada para me preparar antes de sair.
- **US-03 (FR-03) — Planejamento semanal:** Como Marina, pessoa que planeja atividades da semana, quero comparar a previsão diária de hoje e dos quatro dias seguintes para escolher um dia adequado para uma atividade ao ar livre.
- **US-04 (FR-04) — Preferência de unidade:** Como Joana, pessoa que prefere uma unidade de temperatura, quero alternar entre Celsius e Fahrenheit para interpretar os valores sem ambiguidade.
- **US-05 (FR-05) — Consulta em movimento:** Como Rafael, viajante que consulta o tempo principalmente pelo celular, quero acessar as funções principais em uma tela móvel para verificar o clima durante a viagem.
- **US-06 (FR-06) — Recuperação de problemas:** Como Rafael, viajante que pode estar com conexão instável, quero receber uma mensagem clara e poder tentar novamente quando a busca não encontrar a cidade ou os dados não carregarem para saber como continuar a consulta.

## Acceptance Criteria

- **AC-01 (FR-01, US-01)**
	- **Given:** a pessoa informou um nome não vazio.
	- **When:** envia a pesquisa e a geocodificação retorna pelo menos uma correspondência.
	- **Then:** cada resultado aparece como opção e mostra nome da cidade, região e país fornecidos pela fonte.
- **AC-02 (FR-01, US-01)**
	- **Given:** o campo está vazio ou contém somente espaços.
	- **When:** a pessoa tenta enviar a pesquisa.
	- **Then:** nenhuma solicitação de geocodificação é iniciada e o campo permanece editável com indicação para informar uma cidade.
- **AC-03 (FR-01, US-01)**
	- **Given:** o nome pesquisado contém caracteres acentuados, espaço, hífen ou apóstrofo e há uma correspondência de teste.
	- **When:** a pessoa envia a pesquisa.
	- **Then:** o termo é enviado preservando esses caracteres e o resultado correspondente pode ser selecionado sem que o texto seja interpretado como conteúdo de interface.
- **AC-04 (FR-01, FR-06, US-01, US-06)**
	- **Given:** a geocodificação responde com zero resultados.
	- **When:** a aplicação recebe a resposta.
	- **Then:** informa que não encontrou a cidade, mantém o termo para edição e não inicia uma consulta meteorológica.
- **AC-05 (FR-02, US-02)**
	- **Given:** uma cidade selecionada tem resposta válida com temperatura, condição reconhecida, horário da medição e métricas meteorológicas atuais.
	- **When:** a consulta termina.
	- **Then:** a tela identifica a cidade e apresenta temperatura na unidade atual, condição em pt-BR, horário no fuso local e, para cada métrica válida, umidade em %, vento em km/h, precipitação em mm e pressão em hPa.
- **AC-06 (FR-02, US-02)**
	- **Given:** a resposta não contém temperatura, condição reconhecida, horário ou uma ou mais métricas.
	- **When:** a tela apresenta o clima atual.
	- **Then:** não inventa nem reaproveita campos de outra cidade; identifica cada campo ausente ou inválido como indisponível e apresenta os demais campos válidos.
- **AC-07 (FR-03, US-03)**
	- **Given:** a cidade tem dados válidos para hoje e os quatro dias seguintes no fuso local, incluindo probabilidade máxima de precipitação.
	- **When:** a previsão é apresentada.
	- **Then:** aparecem exatamente cinco datas consecutivas, incluindo hoje, cada qual com condição, temperaturas mínima e máxima identificadas e probabilidade de precipitação em porcentagem.
- **AC-08 (FR-03, FR-06, US-03, US-06)**
	- **Given:** a resposta contém ao menos um dia válido, mas há dia ou campo diário ausente, inclusive a probabilidade máxima de precipitação.
	- **When:** a previsão é apresentada.
	- **Then:** somente dias e campos válidos são mostrados, o estado “Previsão incompleta” é apresentado e nenhum dado ausente é inferido.
- **AC-09 (FR-04, US-04)**
	- **Given:** a aplicação acabou de ser carregada.
	- **When:** qualquer temperatura é apresentada.
	- **Then:** o valor usa Celsius, é identificado como °C e tem uma casa decimal; recarregar a aplicação restaura Celsius.
- **AC-10 (FR-04, US-04)**
	- **Given:** a aplicação apresenta temperaturas de teste 0,0 °C, 100,0 °C e -40,0 °C.
	- **When:** a pessoa escolhe Fahrenheit e depois retorna a Celsius.
	- **Then:** os valores Fahrenheit são 32,0 °F, 212,0 °F e -40,0 °F; no retorno são 0,0 °C, 100,0 °C e -40,0 °C. Conversões usam °F = °C × 9/5 + 32 e °C = (°F - 32) × 5/9, arredondadas para uma casa decimal, com empate arredondado para longe de zero.
- **AC-11 (FR-04, US-04)**
	- **Given:** cidade e previsão estão carregadas.
	- **When:** a unidade é alternada.
	- **Then:** todos os valores e símbolos de temperatura são atualizados sem alterar cidade ou datas.
- **AC-12 (FR-05, US-05)**
	- **Given:** a aplicação está aberta em viewport de 390 × 844 pixels.
	- **When:** a pessoa executa busca, seleção, consulta atual e previsão e alterna unidade.
	- **Then:** cada ação pode ser concluída por teclado e ponteiro, com rolagem vertical permitida e sem rolagem horizontal da página.
- **AC-13 (FR-05, US-05)**
	- **Given:** a aplicação está aberta em viewport de 1280 × 800 pixels.
	- **When:** resultados atuais e previsão estão visíveis.
	- **Then:** a página não tem rolagem horizontal e busca, seleção e unidade podem ser acionadas.
- **AC-14 (FR-06, US-06)**
	- **Given:** uma consulta está pendente.
	- **When:** a resposta ainda não chegou.
	- **Then:** a aplicação comunica carregamento e não apresenta valores da nova cidade como confirmados.
- **AC-15 (FR-06, US-06)**
	- **Given:** a API retorna erro, resposta inválida ou falha de rede.
	- **When:** a aplicação processa a falha.
	- **Then:** comunica que não foi possível carregar os dados, não associa dados antigos à cidade nova e oferece nova tentativa manual; cada acionamento inicia uma única consulta.
- **AC-16 (FR-06, US-06)**
	- **Given:** uma solicitação não recebe resposta em 10 segundos.
	- **When:** o limite é atingido.
	- **Then:** o carregamento termina, a aplicação informa timeout e oferece nova tentativa manual.
- **AC-17 (FR-01, FR-02, US-01, US-02)**
	- **Given:** há pelo menos um resultado de cidade apresentado.
	- **When:** a pessoa seleciona um resultado.
	- **Then:** a consulta meteorológica usa a localização associada àquele resultado e a tela identifica essa cidade antes de apresentar seus dados.

## Non-Functional Requirements

- **NFR-01 — Desempenho:** em 100 medições bem-sucedidas de cada fluxo sob conexão estável de teste (RTT até 150 ms e download de pelo menos 10 Mbps), P95 do envio da pesquisa até exibir resultados é no máximo 3 s; P95 do envio da consulta meteorológica até exibir clima e previsão é no máximo 5 s. Cada solicitação expira em 10 s.
- **NFR-02 — Acessibilidade:** conformidade WCAG 2.2 nível AA. Fluxos de busca, seleção, leitura do clima e alternância devem ser concluíveis por teclado; foco, nomes acessíveis, contraste e anúncios de carregamento/erro devem ser verificados manualmente e por ferramentas automatizadas.
- **NFR-03 — Responsividade:** nos viewports 390 × 844 e 1280 × 800 pixels, não há rolagem horizontal da página; rolagem vertical é permitida. Os fluxos dos AC-12 e AC-13 são executáveis nas respectivas viewports.
- **NFR-04 — Compatibilidade:** no momento de cada release, suportar as duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari, além das versões estáveis mais recentes de Safari em iOS e Chrome em Android.
- **NFR-05 — Localização:** interface e condições meteorológicas ficam em pt-BR. Datas são exibidas como dia da semana e DD/MM/AAAA; horários usam formato 24 horas. Ambos usam o fuso horário da cidade selecionada.
- **NFR-06 — Privacidade:** não solicitar geolocalização, criar conta, enviar histórico ou persistir pesquisa e unidade entre carregamentos. O nome pesquisado é enviado apenas ao serviço necessário para geocodificação.
- **NFR-07 — Segurança de entrada:** termos de pesquisa são tratados como texto, nunca como marcação ou conteúdo executável; input vazio não gera chamada externa.
- **NFR-08 — Dados externos:** cumprir atribuição, limites e termos do provedor antes da publicação. Respostas inválidas ou campos ausentes nunca são apresentados como dados confirmados.

## Matriz de Rastreabilidade

Cada linha liga uma história ao requisito funcional, aos critérios de aceite que a verificam e aos requisitos não funcionais aplicáveis. NFRs listados condicionam a implementação ou validação daquele fluxo; podem se aplicar a mais de uma história.

| User Story | Requisito funcional | Acceptance Criteria | NFRs relevantes |
|---|---|---|---|
| US-01 — Busca de destino | FR-01 | AC-01, AC-02, AC-03, AC-04, AC-17 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-06, NFR-07, NFR-08 |
| US-02 — Clima para hoje | FR-02 | AC-05, AC-06, AC-17 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-08 |
| US-03 — Planejamento semanal | FR-03 | AC-07, AC-08 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-08 |
| US-04 — Preferência de unidade | FR-04 | AC-09, AC-10, AC-11 | NFR-02, NFR-03, NFR-04, NFR-06 |
| US-05 — Consulta em movimento | FR-05 | AC-12, AC-13 | NFR-01, NFR-02, NFR-03, NFR-04 |
| US-06 — Recuperação de problemas | FR-06 | AC-04, AC-08, AC-14, AC-15, AC-16 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-06, NFR-08 |

## Edge Cases

- Cidade homônima: apresentar cidade, região e país disponíveis; manter seleção explícita e não carregar dados antes da escolha.
- Cidade inexistente ou geocoding sem resultados: informar ausência de correspondência, preservar o termo e não consultar meteorologia.
- Input vazio ou somente espaços: não enviar chamada externa; manter campo editável.
- Acentos, espaços, hífens ou apóstrofos: preservar o termo de busca e tratá-lo como texto literal.
- Falha de API, resposta inválida ou timeout: interromper carregamento, explicar o erro e oferecer nova tentativa manual; não associar dados antigos ao local recém-selecionado.
- Resposta parcial: exibir apenas campos e dias válidos, identificar a previsão como incompleta e não inferir valores.
- Nova busca durante carregamento: somente a resposta da seleção mais recente pode atualizar a tela.
- Falta de condição meteorológica reconhecida: mostrar “Condição indisponível”, sem inferir descrição.

## Assumptions

- O produto é uma aplicação web utilizável em navegadores de desktop e dispositivos móveis.
- A busca manual por cidade é o fluxo principal; geolocalização automática não é requisito confirmado.
- Open-Meteo será a fonte de geocodificação e previsão, sem necessidade de chave de API para o exercício. Limites e condições de uso ainda devem ser verificados.
- “Cinco dias” significa hoje e os quatro dias seguintes, com previsão diária.
- Clima atual compreende temperatura, condição, horário da medição, umidade relativa, velocidade do vento, precipitação e pressão atmosférica; previsão diária compreende condição, mínima, máxima e probabilidade máxima de precipitação. Sensação térmica, índice UV e previsão horária não fazem parte do MVP.
- A data de hoje e os horários são determinados pelo fuso da cidade selecionada; presume-se que a fonte forneça esse fuso e os campos definidos acima.
- Celsius é a unidade inicial; Fahrenheit também deve estar disponível.
- A unidade só permanece selecionada durante o carregamento atual da aplicação; recarregar restaura Celsius.
- Não há cache meteorológico intencional nem modo offline no MVP.
- A interface será apresentada em português do Brasil.
- Não haverá autenticação, contas de usuário nem persistência de dados no servidor.
- A especificação cobre consulta de clima e previsão, sem prometer precisão maior do que a fornecida pela fonte externa.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| A fonte de dados fica indisponível ou responde lentamente. | Média | Alto: impede ou atrasa consultas. | Timeout de 10 s, estado de erro, nova tentativa manual e validação dos limites do provedor antes da publicação. |
| A busca retorna cidade homônima ou incorreta. | Média | Alto: apresenta dados de outro local. | Exibir contexto geográfico disponível e exigir seleção explícita antes da consulta. |
| O período de cinco dias é interpretado incorretamente. | Alta | Médio: a previsão pode não corresponder à expectativa. | Comunicar que o período inclui hoje e identificar cada dia. |
| A experiência é inadequada em telas pequenas ou para pessoas que usam tecnologias assistivas. | Média | Alto: dificulta ou impede o uso. | Testar viewports de aceite e conformidade WCAG 2.2 AA antes da publicação. |
| Limites ou termos da fonte restringem consultas ou uso dos dados. | Média | Alto: degrada ou impede o serviço. | Verificar limites e condições antes da integração e definir o tratamento de falhas. |
| Conversão ou rótulo de unidade fica inconsistente. | Baixa | Médio: pode levar a decisões baseadas em temperatura mal interpretada. | Validar alternância em todos os valores exibidos e atualizar valores e rótulos em conjunto. |

## Out of Scope

- Autenticação, contas de usuário e persistência de dados em servidor.
- Geolocalização automática ou solicitação de permissão para localização, até que essa necessidade seja decidida.
- Favoritos, histórico de pesquisas ou sincronização entre dispositivos.
- Alertas meteorológicos, notificações ou recomendações personalizadas de atividades.
- Previsão horária; a primeira versão especifica previsão diária.
- Disponibilidade offline ou garantia de cache de dados meteorológicos.
- Sensação térmica e índice UV.
- Suporte a idiomas além de português do Brasil.
- Garantias próprias de precisão meteorológica ou substituição de serviços oficiais de alerta.

## Open Questions

1. **Open-Meteo atende ao contrato de dados e aos requisitos de uso?** Confirmar disponibilidade de geocodificação, fuso, horário atual, condição, umidade, vento, precipitação, pressão, mínima/máxima diária, probabilidade máxima diária de precipitação, limites, atribuição e termos. É bloqueador de publicação.
2. **As metas operacionais propostas são aprovadas?** Confirmar P95 de 3 s para busca, 5 s para meteorologia, timeout de 10 s e matriz de navegadores com a pessoa responsável pelo produto.
3. **O mapeamento pt-BR das condições meteorológicas está aprovado?** Validar as descrições previstas e a mensagem para códigos desconhecidos antes da publicação.