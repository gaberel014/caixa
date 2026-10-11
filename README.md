# Caixa

Um jeito simples de acompanhar o dinheiro que entra e sai de um pequeno negócio.

Caixa é um projeto open source em português para autônomos, freelancers e pequenos negócios. A primeira versão funciona no navegador, sem cadastro, servidor ou chave de API. Os registros ficam salvos no próprio dispositivo.

## O que já funciona

- Resumo de saldo, entradas, saídas e valores a receber
- Gráfico simples dos últimos seis meses
- Registro de entradas e despesas com categoria, data e status
- Busca e filtros por tipo
- Marcação de contas como recebidas ou pagas
- Exportação de movimentações para CSV
- Layout adaptado para celular
- Dados de exemplo e opção para restaurá-los

## Abrir no computador

Baixe ou clone o repositório e abra `index.html` no navegador para ver a apresentação do produto. A demonstração interativa está em `app.html`. Não é necessário instalar dependências.

## Sobre esta primeira versão

O Caixa começou como um protótipo feito com vibe coding. A proposta ainda precisa ser validada com autônomos e pequenos negócios; contribuições e relatos de uso ajudam a decidir o que construir em seguida.

## Privacidade

Esta versão não envia os registros para um servidor. Os dados são guardados no `localStorage` do navegador em uso. Limpar os dados do navegador também apaga os registros. O projeto ainda não oferece sincronização entre dispositivos nem cópias de segurança automáticas.

## Próximos passos

1. Conversar com autônomos e pequenos negócios para entender como controlam o caixa hoje.
2. Usar a ferramenta com dados fictícios e recolher sugestões antes de inserir informações financeiras reais.
3. Melhorar importação e exportação a partir das necessidades que aparecerem.
4. Avaliar contas compartilhadas e sincronização somente depois de validar a procura e desenhar a proteção dos dados.
5. Considerar uma integração opcional com Claude para resumir o mês, sempre com consentimento e custos claros.

## Contribuir

Ideias, relatos de uso e contribuições são bem-vindos. Veja [CONTRIBUTING.md](CONTRIBUTING.md) para combinar mudanças e abrir uma contribuição.

## Licença

MIT. Consulte [LICENSE](LICENSE).

## Aviso

Caixa é uma ferramenta de organização pessoal. Os totais são calculados a partir dos registros inseridos e não substituem contabilidade, orientação tributária ou integração bancária.

