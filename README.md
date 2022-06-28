Quarto - A Netlify plugin to publish Quarto projects on Netlify

## File-based installation

You can alternatively also use this plugin by adding the following two files to your project.

* `package.json`:

  Add the following file to your repository:

  ```json
  {
      "dependencies": {
          "@quarto/netlify-plugin-quarto": "^0.0.5"
      }
  }
  ```

* `netlify.toml`:

  Add the following file to your repository:

  ```toml
  [[plugins]]
  package = "@quarto/netlify-plugin-quarto"
  ```

## Configuration

The Quarto plugin has two optional configuration options: `version` and `cmd`.

* `version`

  By default, `version` has value `latest`, which installs the latest quarto release
  from the [GitHub repository](https://github.com/quarto-dev/quarto-cli/releases).

  You can also specify a particular version, such as `0.9.629`.

  This option is also controlled by the environment variable `QUARTO_VERSION`.
  If present, this environment variable takes precedence over the input value.

* `cmd`

  By default, `cmd` has value `render`, which renders a quarto project in the top-level
  directory, generating typically a `_site` or `_book` directory as output.

  If you need a more complex quarto command,
  provide a different value. For example, to render a particular subdirectory of the
  repository, use `render PATH-TO-SUBDIRECTORY` as the value.

  For full information, see the output of `quarto render help`.

  This option is also controlled by the environment variable `QUARTO_CMD`.
  If present, this environment variable takes precedence over the input value.





