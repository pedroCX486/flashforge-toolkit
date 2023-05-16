# Flashforge Toolkit

An small toolkit for Flashforge printers that contains a NestJS backend serving data and a static Vue3 front-end (showing that data and the printer's webcam) in a single package.

## Back-End Instructions

### Installation

```bash
$ yarn install
```

### Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Extra Info

Inside the `app.service.ts` you can find where to put your printer's IP address (make sure it's a static IP set in your router!), that's all you need in order to start seeing data from your printer in the front-end.

## Front-End Instructions

### Installation

**First** go inside the the flashforge-toolkit-client folder (or open it with another VSCode window), then run the commands below.

```bash
$ yarn install
```

### Running the app

```bash
$ yarn dev
```

### Building the app

```bash
$ yarn build
```

### Extra Info

The code was made ugly on purpose so its easier to understand all it does. Everything in the app depends on the backend (you don't need to set IP addresses or anything, really, in there).

**Warning**: Running it in real time with `yarn dev` will not deploy it to the backend (aka prod), so for any changes you need to deploy, run `yarn build`. The backend automatically picks it up from the front-end's `/dist` folder. No need to copy-paste.

### License

[ISC](https://opensource.org/license/isc-license-txt/)