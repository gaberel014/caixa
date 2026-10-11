# Site, domínio e e-mail sem VPS

O Caixa é um protótipo estático. A demonstração não precisa de VPS: não tem servidor, banco de dados ou chave de API.

## Demonstração pública

O GitHub Pages está sendo usado para apresentar o projeto open source e o protótipo local. Ele aceita domínio próprio em repositórios públicos do plano grátis. Para usar a URL atual, mantenha Pages configurado na branch `main`, pasta `/ (root)`.

Site atual: <https://gaberel014.github.io/caixa/>

A página inicial apresenta o produto; `app.html?v=3` abre a demonstração atualizada. Um domínio próprio pode ser conectado em **Settings → Pages → Custom domain** para a fase de protótipo.

GitHub diz que Pages não é hospedagem grátis permitida para operar uma empresa online ou um SaaS comercial. Antes de oferecer o Caixa como serviço comercial ou coletar dados de clientes online, mova o site para um host que permita esse uso. Cloudflare Pages serve ativos estáticos sem cobrança por pedido; Pages Functions usam a cota do Workers Free, atualmente até 100.000 pedidos por dia. Uma integração com a API do Claude teria custo de API separado.

## Domínio `.com.br`

O Registro.br cobra R$ 40 por ano para registrar um domínio `.br`. O cadastro pede CPF ou CNPJ do titular; registre no nome de quem realmente deve controlar o domínio e guarde acesso à conta. A disponibilidade do nome e regras de categorias específicas precisam ser conferidas no próprio Registro.br.

## E-mail com domínio próprio

A candidatura do Claude Startups pede endereço de e-mail empresarial associado ao domínio do site. Use uma caixa de correio que vocês controlem e que represente a empresa/projeto candidato. Não use o endereço de outra empresa como se fosse seu; nos termos, os benefícios são associados à empresa indicada na candidatura.

Uma opção de baixo custo é verificar se o plano gratuito do Zoho Mail está disponível na região da equipe: até cinco usuários e 5 GB por usuário, mas sem IMAP/POP e limitado a determinados data centers. Se não estiver disponível, o Zoho divulga planos pagos a partir de aproximadamente R$ 5 por pessoa/mês; confirme preço, forma de cobrança e impostos no cadastro.

Com duas caixas pagas a cerca de R$ 5/mês cada e domínio de R$ 40/ano, o total estimado seria R$ 160/ano, média de R$ 13,33/mês. O pagamento pode ser anual, então confira o valor à vista antes de assinar. Se o e-mail gratuito estiver disponível, o domínio seria o único custo recorrente necessário para esse conjunto.

## Antes de pagar

O anúncio da Anthropic de 6 de outubro de 2026 diz que startups fundadas nos últimos cinco anos ou financiadas nos últimos dois podem se candidatar. Porém, o FAQ que aparece na página oficial ainda informa que os benefícios de Claude Team e US$ 1.000 em API estão em revisão por excesso de inscrições. Relatos recentes no Reddit também mencionam aprovações revertidas e novas revisões. Trate os benefícios como incertos até aparecerem confirmados na Claude Console.

Verifique o requisito, a situação dos benefícios e a disponibilidade do endereço antes de comprar um domínio só para se candidatar. Esta candidatura é da empresa identificada por vocês; as regras públicas consultadas não mostram CNPJ como requisito explícito, mas a Anthropic verifica aplicações e decide a elegibilidade.

## Por que não usar VPS

Uma VPS exige manter sistema, segurança, backups e disponibilidade. O protótipo atual é HTML, CSS e JavaScript estáticos, então GitHub Pages é suficiente. Se o projeto ganhar uma API de Claude, ela deve rodar separada do navegador com a chave guardada como segredo; esse serviço pode ser avaliado depois, conforme custo e necessidade.

