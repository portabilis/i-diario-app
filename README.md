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

# Primeira instalação MacOS

Caso você esteja com a versão mais atual do `node`, `npm` e `node-gyp` é necessário instalar `npm install node-sass@4.12.0` para funcionar corretamente.

Instalei a versão `4.12.12` do `node-sass` como dependência do projeto para evitar problemas futuros.


# Build iOS

Como o projeto é antigo, foi necessário adicionar a plataforma com uma versão maior do iOS

> ionic cordova platform add ios@5.1.1

Depois de adicionado, basta abrir o arquivo `platforms/ios/Portabilis Diário.xcodeproj` no XCode e assinar com o certificado correto `Signing & Capabilities`
