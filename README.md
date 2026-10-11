# Caixa

Uma ferramenta gratuita e open source para autônomos e pequenos negócios acompanharem clientes, serviços, recebimentos, despesas e o saldo que esperam ter nos próximos meses.

O Caixa tenta resolver uma pergunta prática: **depois de pagar as contas que já conheço, quanto deve sobrar?** Não conecta a bancos e não exige cadastro.

## O que já funciona

- Visão geral de saldo confirmado, entradas, despesas, valores a receber e contas atrasadas.
- Cadastro de clientes e associação de recebimentos ao cliente.
- Quadro de serviços com orçamento, valor combinado, prazo e etapas até a entrega.
- Lançamentos editáveis de receitas e despesas, com vencimento, categoria, observação e status.
- Associação de lançamentos a clientes e serviços.
- Projeção de fluxo para 30, 60 ou 90 dias, com pendências e saldo estimado.
- Histórico pesquisável, filtros e relatório por mês e categoria.
- Importação de CSV com identificação de colunas comuns, detecção de duplicatas e modelo para baixar.
- Exportação de CSV e cópia de segurança JSON, com opção de restaurar a cópia.
- Lembrete de cobrança copiável para revisar antes de enviar.
- Interface em português adaptada para celular e computador.

## Abrir

Abra `index.html` no navegador para conhecer o projeto e `app.html` para usar a demonstração. Não é necessário instalar dependências.

O site público é servido pelo GitHub Pages: https://gaberel014.github.io/caixa/

## Como os dados são guardados

Os clientes e lançamentos ficam no `localStorage` do navegador atual. Não há conta de usuário, servidor de dados, conexão bancária ou integração de API. Os dados não sincronizam entre dispositivos. Baixe cópias de segurança regularmente; o projeto não criptografa o conteúdo local.

## Importar CSV

O importador aceita arquivos separados por vírgula ou ponto e vírgula. O modelo baixável usa estas colunas:

`Descricao;Tipo;Categoria;Cliente;Servico;Vencimento;Status;Valor;Observacao`

Datas podem estar em `AAAA-MM-DD` ou `DD/MM/AAAA`. Revise as linhas no Caixa depois de importar, especialmente o tipo e o sinal dos valores. O importador ignora lançamentos que parecem duplicados com a mesma descrição, valor e data.

## Limites desta versão

O Caixa é um organizador de registros pessoais. Não calcula impostos, não substitui contabilidade, não verifica saldo bancário e não gera documentos fiscais. A projeção usa somente os lançamentos que a pessoa cadastrou. A demonstração pública vem com dados fictícios.

Esta versão ainda não chama a API do Claude. Se a comunidade validar a necessidade de resumos automáticos, a integração deverá usar um endpoint seguro no servidor, consentimento explícito e limites de custo. Chaves de API não devem ser colocadas no código do navegador.

## Próximos passos do projeto

1. Conversar com autônomos e pequenos negócios e registrar quais tarefas financeiras mais tomam tempo.
2. Corrigir o fluxo de importação com arquivos de exemplo fornecidos voluntariamente por quem testar.
3. Priorizar melhorias pela frequência do problema, e não pelo tamanho da lista de funcionalidades.
4. Só desenhar sincronização e uso multiusuário depois de decidir como proteger os dados.
5. Avaliar uma integração com Claude somente depois de validar um uso concreto; esta versão não chama a API.

## Contribuir

Ideias, relatos de uso e contribuições são bem-vindos. Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

MIT. Consulte [LICENSE](LICENSE).

