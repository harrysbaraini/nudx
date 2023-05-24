NUD - Not-Using-Docker-Containers Development Environment
=========================================================

> ATTENTION: I'VE BEEN USING FOR LOCAL DEVELOPMENT, BUT IT'S STILL IN A VERY EARLY STAGE - NO TESTS HAVE EVEN BEEN WRITTEN - SO BUGS ARE EXPECTED.

This is a pet-project that I created to get rid of Docker and to also learn Nix to create my dev environments.

[![Version](https://img.shields.io/npm/v/nudx.svg)](https://npmjs.org/package/nudx)

# Working with NUDX

First step is to install Nudx. For now, as it's just a pet-project, the only way to install it is by
running `npm install -g nudx` or `yarn global add nudx`.

After that, go to your project directory and run `nudx site create`. You will be prompted with a few options.
A `dev.json` file will be created in the directory. Take a look at it and change accordingly.

> Sorry, but for now there's no documentation about what options are available for services.

If you change `dev.json`, you will need to run `nudx site build --force`. It's already in Roadmap to build it
again automatically when a change is detected.

To run the server, just run `nudx up`. It will run a Caddy server that will be responsible to proxy requests
to your sites.

Then, run `nudx site start` in your site directory and it will be available to be accessed on the host you
configured in `dev.json`.

## Resolving DNS to localhost

Automatic DNS resolving is not yet implemented, so for now you need to configure how your network resolves hosts
your localhost. Depending on your system, there are a few options:

### On MacOS, Add your chosen domain TLD to /etc/resolver
This is the method I'm using. Considering you will use *.localhost as domain:

```
sudo echo "nameserver 127.0.0.1" > /etc/resolver/localhost
dscacheutil -flushcache
```

### Install and set up DnsMasq
TODO

### Add hosts to /etc/hosts
TODO

<!-- toc -->
* [Working with NUDX](#working-with-nudx)
* [Usage](#usage)
* [Commands](#commands)
* [Developing NUDX](#developing-nudx)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g nudx
$ nudx COMMAND
running command...
$ nudx (--version)
nudx/0.0.2 darwin-x64 node-v18.16.0
$ nudx --help [COMMAND]
USAGE
  $ nudx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nudx down`](#nudx-down)
* [`nudx help [COMMANDS]`](#nudx-help-commands)
* [`nudx plugins`](#nudx-plugins)
* [`nudx plugins:install PLUGIN...`](#nudx-pluginsinstall-plugin)
* [`nudx plugins:inspect PLUGIN...`](#nudx-pluginsinspect-plugin)
* [`nudx plugins:install PLUGIN...`](#nudx-pluginsinstall-plugin-1)
* [`nudx plugins:link PLUGIN`](#nudx-pluginslink-plugin)
* [`nudx plugins:uninstall PLUGIN...`](#nudx-pluginsuninstall-plugin)
* [`nudx plugins:uninstall PLUGIN...`](#nudx-pluginsuninstall-plugin-1)
* [`nudx plugins:uninstall PLUGIN...`](#nudx-pluginsuninstall-plugin-2)
* [`nudx plugins update`](#nudx-plugins-update)
* [`nudx reload`](#nudx-reload)
* [`nudx site build`](#nudx-site-build)
* [`nudx site create`](#nudx-site-create)
* [`nudx site remove`](#nudx-site-remove)
* [`nudx site shell`](#nudx-site-shell)
* [`nudx site start`](#nudx-site-start)
* [`nudx site stop`](#nudx-site-stop)
* [`nudx status`](#nudx-status)
* [`nudx up`](#nudx-up)

## `nudx down`

Shutdown the server and all configured sites

```
USAGE
  $ nudx down

DESCRIPTION
  Shutdown the server and all configured sites

EXAMPLES
  $ nudx down
```

_See code: [dist/commands/down.ts](https://github.com/harrysbaraini/nudx/blob/v0.0.2/dist/commands/down.ts)_

## `nudx help [COMMANDS]`

Display help for nudx.

```
USAGE
  $ nudx help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for nudx.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `nudx plugins`

List installed plugins.

```
USAGE
  $ nudx plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ nudx plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `nudx plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nudx plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ nudx plugins add

EXAMPLES
  $ nudx plugins:install myplugin 

  $ nudx plugins:install https://github.com/someuser/someplugin

  $ nudx plugins:install someuser/someplugin
```

## `nudx plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ nudx plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ nudx plugins:inspect myplugin
```

## `nudx plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nudx plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ nudx plugins add

EXAMPLES
  $ nudx plugins:install myplugin 

  $ nudx plugins:install https://github.com/someuser/someplugin

  $ nudx plugins:install someuser/someplugin
```

## `nudx plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ nudx plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ nudx plugins:link myplugin
```

## `nudx plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nudx plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nudx plugins unlink
  $ nudx plugins remove
```

## `nudx plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nudx plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nudx plugins unlink
  $ nudx plugins remove
```

## `nudx plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nudx plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nudx plugins unlink
  $ nudx plugins remove
```

## `nudx plugins update`

Update installed plugins.

```
USAGE
  $ nudx plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `nudx reload`

Reload Nudx server

```
USAGE
  $ nudx reload

DESCRIPTION
  Reload Nudx server
```

_See code: [dist/commands/reload.ts](https://github.com/harrysbaraini/nudx/blob/v0.0.2/dist/commands/reload.ts)_

## `nudx site build`

Build site definition

```
USAGE
  $ nudx site build [-f] [-r]

FLAGS
  -f, --force
  -r, --reload

DESCRIPTION
  Build site definition

EXAMPLES
  $ nudx site build

  $ nudx site build --force
```

## `nudx site create`

Create a new site definition in the current directory

```
USAGE
  $ nudx site create [-f] [-r]

FLAGS
  -f, --force
  -r, --reload

DESCRIPTION
  Create a new site definition in the current directory

EXAMPLES
  $ nudx site create
```

## `nudx site remove`

Remove app from Nudx

```
USAGE
  $ nudx site remove

DESCRIPTION
  Remove app from Nudx

EXAMPLES
  $ nudx app remove
```

## `nudx site shell`

Enter the site shell

```
USAGE
  $ nudx site shell

DESCRIPTION
  Enter the site shell
```

## `nudx site start`

Start site

```
USAGE
  $ nudx site start [-s <value>]

FLAGS
  -s, --site=<value>

DESCRIPTION
  Start site

EXAMPLES
  $ nudx site start

  $ nudx site start
```

## `nudx site stop`

Stop site

```
USAGE
  $ nudx site stop [-s <value>]

FLAGS
  -s, --site=<value>

DESCRIPTION
  Stop site

EXAMPLES
  $ nudx site stop

  $ nudx site stop
```

## `nudx status`

List status of running sites and processes

```
USAGE
  $ nudx status

DESCRIPTION
  List status of running sites and processes

EXAMPLES
  $ nudx status

  $ nudx status
```

_See code: [dist/commands/status.ts](https://github.com/harrysbaraini/nudx/blob/v0.0.2/dist/commands/status.ts)_

## `nudx up`

Initialize the server and all configured sites

```
USAGE
  $ nudx up [-v]

FLAGS
  -v, --verbose

DESCRIPTION
  Initialize the server and all configured sites

EXAMPLES
  $ nudx up
```

_See code: [dist/commands/up.ts](https://github.com/harrysbaraini/nudx/blob/v0.0.2/dist/commands/up.ts)_
<!-- commandsstop -->

# Developing NUDX

> Documentation To Be Defined
