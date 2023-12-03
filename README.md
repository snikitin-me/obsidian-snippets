## About this repo

The plugin allows to export code snippets from Obsidian to VSCode IDE.

## Examples

Example obsidian note with snippet formatting.

```
# Hellow world snippet

#sn/hellow-world

## Description

Simple example snippet

- [Hello World program](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program)

## Code

`` `
console.log('Hello world!');
`` `

```

## How to use

-   Clone this repo.
-   `yarn` to install dependencies
-   `yarn run dev` to start compilation in watch mode.
-   Swich on plugin in the Obsidian preference settings.
-   Open debuger in Obsidian `Cntrl+Shift+I`

You can set custom plugin settings:
- Tag prefix
- Path to VSCode snippet file

## How to test

```
yarn run test
```

## Useful links

- [Snippets in Visual Studio Code](https://code.visualstudio.com/docs/editor/userdefinedsnippets)
