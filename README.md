oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
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
nudx/0.0.1 darwin-x64 node-v18.15.0
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
* [`nudx site build`](#nudx-site-build)
* [`nudx site create`](#nudx-site-create)
* [`nudx site reload`](#nudx-site-reload)
* [`nudx site remove`](#nudx-site-remove)
* [`nudx site shell`](#nudx-site-shell)
* [`nudx up`](#nudx-up)

## `nudx down`

Shutdown the server and all configured sites

```
USAGE
  $ nudx down

DESCRIPTION
  Shutdown the server and all configured sites

EXAMPLES
  $ nudx shutdown
```

_See code: [dist/commands/down.ts](https://github.com/harrysbaraini/nudx/blob/v0.0.1/dist/commands/down.ts)_

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

## `nudx site reload`

Reload Nudx server

```
USAGE
  $ nudx site reload

DESCRIPTION
  Reload Nudx server
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

## `nudx up`

Initialize the server and all configured sites

```
USAGE
  $ nudx up [-f] [-v]

FLAGS
  -f, --force
  -v, --verbose

DESCRIPTION
  Initialize the server and all configured sites

EXAMPLES
  $ nudx up
```

_See code: [dist/commands/up.ts](https://github.com/harrysbaraini/nudx/blob/v0.0.1/dist/commands/up.ts)_
<!-- commandsstop -->

# Developing NUDX

> Documentation To Be Defined
