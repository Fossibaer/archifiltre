# Archifiltre

Archifiltre allows you to visualize and improve your file trees. Learn more about it [here](https://archifiltre.fabrique.social.gouv.fr/).

### Launch the app

First install the dependencies

```bash
yarn
```

Then copy the example env file

```bash
cp .env.example .env
```

(Optionnal) Install the React Developper Tools in your chrome browser. Then, find the extension install path and add it to the .env file. More info [here](https://electronjs.org/docs/tutorial/devtools-extension). You must provide the absolute path.


You should use autoreloading when developping, using

```bash
yarn dev
```

and in another terminal, to launch the electron app:

```bash
yarn dev-app
```

and then, reload your electron app with the refresh command (`CMD + R` on OS X)

You can make the app automatically load a specific folder by doing:

```bash
yarn dev --autoload /absolute/or/relative/path/to/folder
```

## Building/releasing the app

First, prepare the build in production mode

```bash
yarn prepare-prod
```

Then you can package the app for the right platform:

```bash
yarn win32
yarn win64
yarn mac
yarn linux
yarn win32-msi
yarn win64-msi
```

Or you can prepare the build and build for all four platforms with one command:

```bash
yarn build-prod
```

Once built, production binaries are found in the dist folder, each in their corresponding platform's subfolder.

## Contributing

To contribute, see more [here](https://github.com/SocialGouv/archifiltre/blob/master/CONTRIBUTING.md)


## Import script

Archifiltre provides you with an export script that you can run directly on your file server. To know more about it, go [here](https://github.com/SocialGouv/archifiltre/blob/master/scripts/README.md)
