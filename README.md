Quarto - A Netlify plugin to publish Quarto projects on Netlify

# Install

Please install this plugin from the Netlify app.

# Configuration

The Quarto plugin has two optional configuration options: `version` and `cmd`.

* `version`

  By default, `version` has value `latest`, which installs the latest quarto release
  from the [GitHub repository](https://github.com/quarto-dev/quarto-cli/releases).

  You can also specify a particular version, such as `0.9.629`.

* `cmd`

  By default, `cmd` has value `render`, which renders a quarto project in the top-level
  directory, generating typically a `_site` or `_book` directory as output.

  If you need a more complex quarto command,
  provide a different value. For example, to render a particular subdirectory of the
  repository, use `render PATH-TO-SUBDIRECTORY` as the value.

  For full information, see the output of `quarto render help`.



## File-based installation

You can use the plugin by adding the following two files to your project.

* `package.json`:

  ```json
  {
      "dependencies": {
          "@quarto/netlify-plugin-quarto": "^0.0.5"
      }
  }
  ```

* `netlify.toml`:

  ```toml
  [[plugins]]
  package = "@quarto/netlify-plugin-quarto"
  ```

## UI-based installation

(Currently unavailable, waiting for plugin to be approved for inclusion)

You can install this plugin directly [through the Netlify UI](https://app.netlify.com/plugins/quarto/install):
https://app.netlify.com/plugins/quarto/install.

