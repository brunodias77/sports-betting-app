# Requirements Document

## Introduction

Este documento define os requisitos para implementar a interface de usuário completa do Sistema de Gerenciamento de Apostas Esportivas. O projeto já possui uma arquitetura sólida com Zustand para gerenciamento de estado, Zod para validação e TailwindCSS para estilização. O objetivo é criar uma interface intuitiva e responsiva que permita aos usuários visualizar eventos esportivos, fazer apostas, gerenciar seu saldo e acompanhar estatísticas, utilizando apenas TailwindCSS sem bibliotecas de UI externas.

## Requirements

### Requirement 1

**User Story:** Como um usuário, eu quero visualizar uma lista de eventos esportivos disponíveis, para que eu possa escolher em quais eventos apostar.

#### Acceptance Criteria

1. WHEN o usuário acessa a página principal THEN o sistema SHALL exibir uma lista de eventos esportivos com informações básicas (times, data, odds)
2. WHEN não há eventos disponíveis THEN o sistema SHALL exibir uma mensagem informativa
3. WHEN os eventos estão carregando THEN o sistema SHALL exibir um indicador de loading
4. WHEN ocorre erro ao carregar eventos THEN o sistema SHALL exibir uma mensagem de erro clara
5. IF um evento está ao vivo THEN o sistema SHALL destacar visualmente o status "LIVE"
6. WHEN o usuário visualiza um evento THEN o sistema SHALL mostrar as odds atuais para casa, empate (se aplicável) e visitante

### Requirement 2

**User Story:** Como um usuário, eu quero fazer apostas em eventos esportivos, para que eu possa tentar ganhar dinheiro com minhas previsões.

#### Acceptance Criteria

1. WHEN o usuário clica em um evento THEN o sistema SHALL abrir um modal/formulário de aposta
2. WHEN o usuário preenche o formulário de aposta THEN o sistema SHALL validar o valor da aposta contra o saldo disponível
3. WHEN o usuário confirma uma aposta válida THEN o sistema SHALL deduzir o valor do saldo e criar a aposta
4. WHEN o usuário tenta apostar mais do que possui THEN o sistema SHALL exibir erro de saldo insuficiente
5. WHEN uma aposta é criada com sucesso THEN o sistema SHALL exibir uma notificação de confirmação
6. WHEN o usuário cancela o formulário THEN o sistema SHALL fechar o modal sem fazer alterações

### Requirement 3

**User Story:** Como um usuário, eu quero visualizar minhas apostas ativas e históricas, para que eu possa acompanhar meu desempenho.

#### Acceptance Criteria

1. WHEN o usuário acessa a seção de apostas THEN o sistema SHALL exibir uma lista de todas as apostas
2. WHEN o usuário filtra por status THEN o sistema SHALL mostrar apenas apostas do status selecionado (ativas, ganhas, perdidas)
3. WHEN o usuário visualiza uma aposta THEN o sistema SHALL mostrar detalhes completos (evento, valor, odds, ganho potencial, status)
4. WHEN não há apostas THEN o sistema SHALL exibir uma mensagem informativa
5. WHEN há apostas ativas THEN o sistema SHALL destacar visualmente essas apostas
6. WHEN uma aposta foi ganha THEN o sistema SHALL mostrar o valor ganho em destaque

### Requirement 4

**User Story:** Como um usuário, eu quero gerenciar meu saldo (depositar e sacar), para que eu possa controlar meu dinheiro na plataforma.

#### Acceptance Criteria

1. WHEN o usuário acessa a seção de saldo THEN o sistema SHALL exibir o saldo atual de forma destacada
2. WHEN o usuário clica em depositar THEN o sistema SHALL abrir um formulário de depósito
3. WHEN o usuário preenche um valor válido de depósito THEN o sistema SHALL adicionar o valor ao saldo
4. WHEN o usuário tenta depositar valor inválido THEN o sistema SHALL exibir mensagens de erro específicas
5. WHEN uma transação é concluída THEN o sistema SHALL exibir notificação de sucesso
6. WHEN o usuário visualiza o saldo THEN o sistema SHALL mostrar o valor formatado em reais (R$)

### Requirement 5

**User Story:** Como um usuário, eu quero visualizar estatísticas das minhas apostas, para que eu possa analisar meu desempenho.

#### Acceptance Criteria

1. WHEN o usuário acessa a seção de estatísticas THEN o sistema SHALL exibir métricas principais (total de apostas, taxa de vitória, ganhos/perdas)
2. WHEN há dados suficientes THEN o sistema SHALL calcular e exibir a taxa de vitória em percentual
3. WHEN o usuário não tem apostas THEN o sistema SHALL exibir estatísticas zeradas com mensagem explicativa
4. WHEN o usuário visualiza estatísticas THEN o sistema SHALL destacar visualmente ganhos em verde e perdas em vermelho
5. WHEN há apostas ativas THEN o sistema SHALL mostrar o valor total em apostas pendentes

### Requirement 6

**User Story:** Como um usuário, eu quero navegar facilmente entre as diferentes seções da aplicação, para que eu possa acessar todas as funcionalidades.

#### Acceptance Criteria

1. WHEN o usuário acessa a aplicação THEN o sistema SHALL exibir uma navegação clara com todas as seções
2. WHEN o usuário está em uma seção THEN o sistema SHALL destacar visualmente a seção ativa
3. WHEN o usuário clica em uma seção THEN o sistema SHALL navegar para a seção correspondente
4. WHEN o usuário está em dispositivo móvel THEN o sistema SHALL adaptar a navegação para telas pequenas
5. WHEN o usuário acessa qualquer seção THEN o sistema SHALL manter o header com saldo visível

### Requirement 7

**User Story:** Como um usuário, eu quero receber feedback visual claro sobre minhas ações, para que eu entenda o que está acontecendo na aplicação.

#### Acceptance Criteria

1. WHEN o usuário realiza uma ação THEN o sistema SHALL exibir notificações toast apropriadas
2. WHEN ocorre um erro THEN o sistema SHALL exibir mensagem de erro clara e acionável
3. WHEN uma operação está em andamento THEN o sistema SHALL exibir indicadores de loading
4. WHEN o usuário interage com elementos THEN o sistema SHALL fornecer feedback visual (hover, focus, active states)
5. WHEN o usuário preenche formulários THEN o sistema SHALL validar em tempo real e mostrar erros específicos

### Requirement 8

**User Story:** Como um usuário, eu quero que a aplicação seja responsiva, para que eu possa usá-la em diferentes dispositivos.

#### Acceptance Criteria

1. WHEN o usuário acessa em desktop THEN o sistema SHALL exibir layout otimizado para telas grandes
2. WHEN o usuário acessa em tablet THEN o sistema SHALL adaptar o layout para telas médias
3. WHEN o usuário acessa em mobile THEN o sistema SHALL exibir layout otimizado para telas pequenas
4. WHEN o usuário rotaciona o dispositivo THEN o sistema SHALL manter a usabilidade
5. WHEN há listas ou tabelas THEN o sistema SHALL implementar scroll horizontal em telas pequenas se necessário