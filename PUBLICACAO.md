# Publicar sem custo de hospedagem

O Caixa é um site estático. Não precisa de VPS para a página inicial nem para o protótipo.

## GitHub Pages

1. Publique este projeto em um repositório GitHub público.
2. Em **Settings → Pages**, selecione a branch `main` e a pasta `/ (root)`.
3. O GitHub gera uma URL `github.io` sem custo de hospedagem.
4. Quando tiver um domínio próprio, configure-o em **Settings → Pages → Custom domain** e ajuste os registros DNS no Registro.br.

O arquivo `index.html` é a página de apresentação; `app.html` abre a demonstração interativa.

## Domínio e e-mail

Para o programa Claude Startups, a página atualmente pede um e-mail empresarial correspondente ao domínio do site. Assim, use o mesmo domínio na página e no endereço de e-mail.

O Registro.br é uma opção simples para `*.com.br`. Para e-mail, procure primeiro um plano de hospedagem de domínio que aceite sua região; alguns provedores têm um plano gratuito limitado. Antes de assinar, confira preço de renovação, número de caixas de entrada, e se o plano permite enviar e receber mensagens.

## Sem VPS por enquanto

Uma VPS exigiria cuidar de atualizações, segurança, backup e disponibilidade. O protótipo atual não tem servidor nem API, então uma hospedagem estática é suficiente. Se o produto ganhar uma função de IA ou sincronização, essa parte pode ser hospedada separadamente, mantendo as chaves de API fora do navegador.

