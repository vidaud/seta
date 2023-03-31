# ESLint and Prettier

**ESLint** is a tool for identifying and reporting on patterns found in the code, with the goal of making it more reliable, scalable, and preventing certain bugs.

**Prettier** is a code formatter that helps achieve a consistent code style across the team.

This document describes how to work with ESLint and Prettier in the project.

## Checking code

To check the code, run the following command:

```bash
npm run lint
```

This will run both ESLint and Prettier on the code, and will report any errors or warnings.

All the Prettier rules are forwarded to the ESLint configuration, so there's no need to run Prettier separately.

## Fixing code

To automatically fix (when possible) and format the code, run the following command:

```bash
npm run lint:fix
```

This will try to resolve any issues that can be fixed without human intervention.

## VS Code extension

Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) from the VS Code Marketplace to automate the previous steps.

Open the project's `.vscode/settings.json` file and add the following configuration:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": false
}
```

Once the extension is installed and enabled, it will automatically run all the code quality and formatting rules when you save a file, and will fix and format the code accordingly.

The errors and warnings will be reported directly in the editor, and you can also see them in the **Problems** tab for all the open files.

## Pre-commit hook

To prevent committing code that doesn't pass the quality checks, there's a pre-commit hook enabled in the project that will verify all the staged files.

If any of the files fail the verification (the warnings do not count towards this), the commit will be aborted and you'll need to fix the issues before committing again.

Using the VS Code extension means the errors will be immediately visible in the editor, so you can fix them before committing your code, thus avoiding the pre-commit hook from failing.

## Final notes

Please take into account that currently many of the rules are set to report warnings instead of errors, because fixing all the issues would require a significant amount of work.

The goal is to gradually fix the warnings and move some of the rules to errors, so that the code quality is improved over time.

To not increase the scope of this effort, **please try to fix all the warnings in any new code you add to the project**.

<!-- You can see the list of all the rules in the [ESLint configuration file](../.eslintrc.json). -->