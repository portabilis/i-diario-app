# i-Diário App

Aplicativo para o professor com lançamento de frequência e registro de conteúdos offline, integrado com o software livre [i-Diário](https://github.com/portabilis/i-diario) e [i-Educar](https://github.com/portabilis/i-educar)

## Pré requisitos

- node.js
- npm


## Instalação

- Instalar a biblioteca do ionic

```bash
$ npm install -g ionic
```

- Baixar o i-Diário App:

```bash
$ git clone https://github.com/portabilis/i-diario-app.git
```

- Instalar as dependências

```bash
$ cd i-diario-app
$ npm install
```

- Iniciar o servidor

```bash
$  ionic serve
```

## Publicações na loja do Android e iOS

Seguir os passos na [documentação](https://ionicframework.com/docs/v1/guide/publishing.html) do framework

## Sincronização com i-Diário

- Criar um usuário do tipo servidor, vinculado com um professor e com turmas no ano letivo atual
- Realizar login com o professor no aplicativo
- Clicar no ícone de sincronização
