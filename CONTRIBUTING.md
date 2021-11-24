# Contributing Guide

To contribute, you can do the standard fork, make changes and PR style stuff. For more info read below.

## Commit Messages

We use a slightly modified version of the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) commit messages.

The format is as follows.

> _Note:_ `<>` means that this fields is mandatory. `[]` mean that they are optional.

```
<type>(<scope>)[delimiter]: <description>
```

The `type` of a commit can be any one of the following types:

- `fix` - A fix or patch of some kind
- `feat`/`feature` - New feature added
- `BREAKING` - A breaking change
- `perf` - A minor change to improve performance which does not affect UX
- `refractor` - A code change which does not fix anything or add a new feature
- `lint`/`style` - Stylistic changes to the code (e.g. linting) which doesn't affect the actual meaning of the code
- `docs` - Documentation or website update
- `test` - Modifying or adding tests (permitted only in `src/__tests__`)
- `ci` - Changes relating to CI

The scope of the commit refers to what section the commit affects. For example, a `fix` type commit affecting the command `/dog` would have a scope of command. Analyse this example commit:

```
fix(command): Fixed /dog not showing dog images
```

In the above commit, the change is a fix, which affects a command. It has fixed the `/dog` command not showing dog images. Scopes are more loose than types, but here are a few example scopes you could use:

- command - Anything to do with commands
- deps - Anything to do with dependencies
- data - Anything to do with the `src/data` folder

... and so on.

A delimiter is an optional character which can be used to bring attention to a commit. Consider the example commit below:

```
BREAKING(deps)!: changed the mathjs dep to otherpackage.js
```

As you can see, the delimiter here is an exclamation mark. This is used to bring attention to the fact that this commit is a breaking one. Here are some delimiters you could append to your commit:

- ! - Reserved for important and breaking commits
- \+ - New important feature you would like to draw attention to
- & - A fix to a previous commit (e.g. when you have already pushed a commit and want to append it)

... and so on.

Finally, a description is just your standard commit message.
