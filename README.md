# i-Diário App

Aplicativo para o professor com lançamento de frequência e registro de conteúdos offline, integrado ao [i-Diário](https://github.com/portabilis/i-diario) e [i-Educar](https://github.com/portabilis/i-educar)

## Dependências

Para executar o projeto é necessário a utilização de alguns softwares.

- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [i-Diário](https://github.com/portabilis/i-diario)

## Instalação

Clone o repositório:

```bash
git clone https://github.com/portabilis/i-diario-app.git && cd i-diario-app
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `src/environments/environment.ts` e o configure:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

```ts 
// src/environments/environment.ts
export const environment = {
  app: {
    version: '<VERSION>', // A versão do aplicativo (x.x.x)
    token: '<TOKEN>',     // AUTH_TOKEN
    cities_url: '<URL>',  // URL do i-Diário
  },
  production: false,
};
```

> É mandatório que o i-Diário tenha a variável `AUTH_TOKEN` configurada no arquivo `config/secrets.yml` do contrário o aplicativo não conseguirá autenticar na API do i-Diário.

Execute o servidor:

```bash
npm run start
```

Será possível acessar o aplicativo através do browser na URL [http://localhost:4200](http://localhost:4200).

## Sincronização com i-Diário

- Criar um usuário do tipo servidor, vinculado com um professor e com turmas no ano letivo atual
- Realizar login com o usuário e senha do professor no aplicativo
- Clicar no ícone de sincronização

## Deploy

O deploy do aplicativo se dá através do build e publicação nas lojas de aplicativos.

É interessante seguir os passos da [documentação](https://ionicframework.com/docs/angular/your-first-app/deploying-mobile) do framework.

### Build

Antes de enviar para as lojas será necessário fazer um build e assinar o aplicativo com seu certificado.

#### Android

Para fazer a publicação na Play Store é necessário o uso do [Android Studio](https://developer.android.com/studio).

#### iOS

Para fazer a publicação na Apple Store é necessário o uso do [Xcode](https://developer.apple.com/xcode/)

```bash
npm run build
npx capacitor-assets generate
npx cap add ios
npx cap add android
npx cap copy
npx cap sync
npx cap open ios
npx cap open android
```

#### Android 16 (API 36)

A Play Store exige que o aplicativo segmente o Android 16 (nível 36 da API). Como a pasta `android/` é
gerada pelo `npx cap add android` e o template do Capacitor 6 vem com a API 34, depois de gerá-la é
necessário ajustar os arquivos abaixo antes do build:

- `android/variables.gradle`: `compileSdkVersion = 36` e `targetSdkVersion = 36`
- `android/build.gradle`: `classpath 'com.android.tools.build:gradle:8.13.0'`
- `android/gradle/wrapper/gradle-wrapper.properties`:
  `distributionUrl=https\://services.gradle.org/distributions/gradle-8.14.3-all.zip`

O build exige o JDK 17 ou mais recente. No Android 16 o app sempre é exibido de ponta a ponta (edge-to-edge),
então confira se a barra de status e a barra de navegação não cobrem o conteúdo.

## Perguntas frequentes (FAQ)

Algumas perguntas aparecem recorrentemente. Olhe primeiro por aqui: [FAQ](https://github.com/portabilis/i-educar-website/blob/master/docs/faq.md).

---

Powered by [Portábilis](https://portabilis.com.br/).
