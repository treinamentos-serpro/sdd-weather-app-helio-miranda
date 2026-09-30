# Contexto

A empresa precisa de uma aplicação web para que usuários consultem o tempo em cidades de seu interesse e planejem atividades. O briefing estabelece busca de cidades, visualização do clima atual e da previsão de cinco dias, alternância entre Celsius e Fahrenheit e uso em dispositivos móveis.

## Personas iniciais

- **Marina, que planeja atividades da semana**
	- **Objetivo principal:** escolher os melhores dias para atividades ao ar livre com base no clima atual e na previsão.
	- **Contexto de uso:** consulta em desktop em casa para planejar a semana e revisita pelo celular quando está fora.
	- **Métrica de sucesso:** identifica rapidamente qual dos próximos cinco dias atende melhor ao plano, sem confundir datas ou condições.
- **Rafael, viajante**
	- **Objetivo principal:** consultar o clima de uma cidade de destino antes ou durante uma viagem.
	- **Contexto de uso:** principalmente no celular, em movimento e possivelmente com conexão instável; pode pesquisar lugares que não conhece.
	- **Métrica de sucesso:** encontra e confirma a cidade correta e entende a previsão local sem precisar recorrer a outra fonte.
- **Joana, pessoa que decide o que vestir ou levar**
	- **Objetivo principal:** verificar a temperatura e as condições do dia para se preparar antes de sair.
	- **Contexto de uso:** consulta rápida no celular; pode preferir Celsius ou Fahrenheit conforme seu hábito.
	- **Métrica de sucesso:** consegue identificar a temperatura, a condição atual e a unidade selecionada sem ambiguidade.

As personas e métricas são hipóteses iniciais derivadas do briefing e devem ser validadas com usuários reais.

# Requisitos Funcionais

- **Busca de cidades:** permitir que a pessoa usuária pesquise uma cidade e selecione o local cujos dados deseja consultar.
- **Clima atual:** exibir as condições meteorológicas atuais para a cidade selecionada.
- **Previsão:** exibir a previsão do tempo para cinco dias para a cidade selecionada.
- **Unidades de temperatura:** permitir alternar a apresentação da temperatura entre Celsius e Fahrenheit.
- **Uso móvel:** disponibilizar as funções principais em dispositivos móveis.

# Requisitos Não-Funcionais

- **Responsividade:** conteúdo e controles devem se adaptar a telas móveis e desktop, mantendo legibilidade e uso sem rolagem horizontal indevida.
- **Acessibilidade:** controles devem ter rótulos compreensíveis, ordem de foco lógica e suporte a teclado e tecnologias assistivas.
- **Desempenho:** busca e consulta devem responder em tempo adequado; metas numéricas ainda precisam ser definidas.
- **Resiliência:** falhas de rede ou indisponibilidade dos dados meteorológicos não devem deixar a interface sem orientação; erros devem ser comunicados com clareza.
- **Usabilidade:** cidade consultada, período da previsão e unidade de temperatura devem ficar claros para reduzir interpretações incorretas.
- **Privacidade:** caso sejam coletados dados de localização ou preferências, seu uso e armazenamento devem ser minimizados e explicados à pessoa usuária.

# Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| A fonte de dados meteorológicos ficar indisponível ou responder lentamente | Média | Alto: impede ou atrasa a consulta | Tratar timeout e erros, mostrar feedback claro e permitir nova tentativa. |
| A busca retornar uma cidade homônima ou incorreta | Média | Alto: exibe dados de outra localização | Diferenciar resultados com informações como estado/região e país, quando disponíveis. |
| A previsão de cinco dias ser interpretada de formas diferentes | Alta | Médio: o período exibido pode não corresponder à expectativa | Definir se o dia atual está incluído e comunicar claramente o intervalo apresentado. |
| A interface não funcionar bem em telas pequenas ou com tecnologias assistivas | Média | Alto: dificulta ou impede o uso por parte do público | Validar layouts móveis, navegação por teclado e semântica acessível durante o desenvolvimento. |
| Limites de uso ou condições da fonte de dados restringirem consultas | Média | Alto: pode degradar ou interromper o serviço | Confirmar limites e termos de uso antes de integrar a fonte e definir comportamento para falhas. |
| A troca entre Celsius e Fahrenheit produzir valor ou rótulo inconsistente | Baixa | Médio: pode levar a decisões baseadas em temperatura mal interpretada | Manter valor e unidade sincronizados e validar conversões em ambos os sentidos. |

# Perguntas em Aberto (Open Questions)

1. **Como diferenciar cidades com o mesmo nome nos resultados da busca?**
	- **Impacto:** sem contexto geográfico suficiente, a pessoa pode selecionar o local errado e receber uma previsão irrelevante.
2. **Os cinco dias incluem hoje? A previsão deve ser diária ou incluir horários específicos?**
	- **Impacto:** define o intervalo, a quantidade de dados e o significado prático da previsão.
3. **A aplicação deve solicitar a localização atual automaticamente ou oferecer somente busca manual?**
	- **Impacto:** afeta permissões do navegador, privacidade e a experiência inicial.
4. **Quais condições meteorológicas devem ser exibidas além da temperatura?**
	- **Impacto:** determina quais dados a fonte precisa fornecer e a complexidade da interface.
5. **Qual é o tempo máximo aceitável para apresentar resultados de busca e previsão?**
	- **Impacto:** sem uma meta, desempenho e experiência não podem ser avaliados objetivamente.
6. **Os dados consultados devem ser armazenados em cache ou estar disponíveis parcialmente offline?**
	- **Impacto:** influencia atualidade, desempenho, consumo de rede e complexidade de implementação.
7. **Como a interface deve se comportar quando a busca não encontra resultados ou a rede falha?**
	- **Impacto:** sem uma decisão, esses estados podem resultar em uma experiência confusa ou sem saída.
8. **Qual deve ser a unidade padrão? A escolha deve permanecer apenas durante a sessão ou ser lembrada em visitas futuras?**
	- **Impacto:** define o valor inicial e se será necessário persistir uma preferência, com implicações de privacidade e armazenamento local.
9. **Qual fonte de dados deve fornecer geocodificação e previsão? Ela exige chave, tem limites ou condições de uso relevantes?**
	- **Impacto:** afeta custo, integração, segurança de credenciais, confiabilidade e viabilidade de uso.
10. **A aplicação terá autenticação, contas de usuário ou persistência de dados no servidor?**
	- **Impacto:** altera escopo, arquitetura, privacidade e esforço de implementação.
11. **Quais idiomas e convenções de localização (datas, horários e unidades) devem ser suportados?**
	- **Impacto:** influencia textos, formatação dos dados e o público que consegue usar a aplicação.

# Suposições (Assumptions)

- A aplicação será um app web acessível por navegadores em dispositivos móveis e desktop.
- A busca de cidade será o fluxo principal; geolocalização automática não é requisito confirmado.
- Os dados de clima e previsão virão de um serviço externo.
- Não há requisito informado para autenticação, conta de usuário ou persistência em servidor.
- A previsão e o clima serão apresentados em uma interface em português, conforme a decisão de treinamento abaixo.

# Decisões

- **Fonte de dados: Open-Meteo, sem chave de API, para geocodificação e previsão.**
	- **Justificativa:** permite consultar cidades e dados meteorológicos sem introduzir uma chave de API no exercício.
	- **Resolve:** a escolha do provedor e a necessidade de chave da pergunta 9. Limites e condições de uso ainda devem ser verificados.
- **“Cinco dias” significa hoje e os quatro dias seguintes.**
	- **Justificativa:** fixa um intervalo previsível para a primeira versão.
	- **Resolve:** se o dia atual está incluído na pergunta 2. A granularidade diária ou horária continua em aberto.
- **A unidade padrão será Celsius, com opção de alternar para Fahrenheit.**
	- **Justificativa:** define uma apresentação inicial consistente para o produto do treinamento, sem retirar a escolha da pessoa usuária.
	- **Resolve:** a unidade inicial da pergunta 8. Ainda não define se a preferência será lembrada entre visitas.
- **Não haverá autenticação nem persistência de dados em servidor.**
	- **Justificativa:** mantém o escopo focado na consulta meteorológica e reduz a necessidade de gerenciar contas e dados pessoais.
	- **Resolve:** a pergunta 10 para autenticação e persistência no servidor. Persistência local de preferências permanece em aberto.
- **O idioma da interface será português do Brasil (pt-BR).**
	- **Justificativa:** define o idioma para o público do treinamento e mantém a experiência consistente.
	- **Resolve:** o idioma da pergunta 11. Convenções específicas de formatação de data e hora ainda devem ser definidas.

As decisões acima fecham apenas os pontos indicados; as demais perguntas em aberto continuam pendentes para a especificação.

Este discovery deve ser revisado com as partes interessadas antes de servir de base para a especificação do produto.

