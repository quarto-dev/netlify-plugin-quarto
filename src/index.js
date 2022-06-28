// This is the main file for the Netlify Build plugin netlify-plugin-quarto.
// Please read the comments to learn more about the Netlify Build plugin syntax.
// Find more information in the Netlify documentation.
import {
  getLatestReleaseAsset,
  getAssetByTag,
  downloadReleaseAsset,
} from './github.js'
import * as path from 'path'
import * as os from 'os'
import { mkdir } from 'fs/promises'
/* eslint-disable no-unused-vars */
// The plugin main logic uses `on...` event handlers that are triggered on
// each new Netlify Build.
// Anything can be done inside those event handlers.
// Information about the current build are passed as arguments. The build
// configuration file and some core utilities are also available.
export async function onPreBuild({
  // Whole configuration file. For example, content of `netlify.toml`
  netlifyConfig,
  // Users can pass configuration inputs to any plugin in their Netlify
  // configuration file.
  // For example:
  //
  //   [[plugins]]
  //   package = "netlify-plugin-{{name}}"
  //     [plugins.inputs]
  //     foo = "bar"
  inputs,
  // `onError` event handlers receive the error instance as argument
  error,

  // Build constants
  constants: {
    // Path to the Netlify configuration file. `undefined` if none was used
    CONFIG_PATH,
    // Directory that contains the deploy-ready HTML files and assets
    // generated by the build. Its value is always defined, but the target
    // might not have been created yet.
    PUBLISH_DIR,
    // The directory where function source code lives.
    // `undefined` if not specified by the user.
    IS_LOCAL,
    // Version of Netlify Build as a `major.minor.patch` string
    SITE_ID,
  },

  // Core utilities
  utils: {
    // Utility to report errors.
    // See https://github.com/netlify/build#error-reporting
    build,
    // Utility to display information in the deploy summary.
    // See https://github.com/netlify/build#logging
    status,
    // Utility for caching files.
    // See https://github.com/netlify/build/blob/master/packages/cache-utils#readme
    cache,
    // Utility for running commands.
    // See https://github.com/netlify/build/blob/master/packages/run-utils#readme
    run,
  },
}) {
  try {
    const tdir = path.join(os.tmpdir(), 'quarto')
    // QUARTO_VERSION can be set up as a build environment variable for no-config
    // runs, or to override the version in the configuration file.
    const quartoVersion = process.env["QUARTO_VERSION"] ?
    process.env["QUARTO_VERSION"] : inputs.version

    const asset =
      quartoVersion == 'latest'
        ? await getLatestReleaseAsset()
        : await getAssetByTag(quartoVersion)
    let quartoTarPath = path.join(os.tmpdir(), `quarto_${asset.tag}.tar.gz`)
    await mkdir(tdir, { recursive: true })
    let restored = await cache.restore(quartoTarPath)
    if (!restored) {
      await downloadReleaseAsset({
        asset_id: asset.asset_id,
        path: quartoTarPath,
      })
      // // TODO: consider breaking these out for more specific build errors?
      await cache.save(quartoTarPath)
    }
    // strip off the root dir of quarto-<version>/
    await run('tar', ['-xzf', quartoTarPath, "-C", tdir, "--strip-components", "1"])
  } catch (error) {
    // Report a user error
    build.failBuild('Error message', { error })
  }

  // Console logs are shown in Netlify logs
  console.log('Netlify configuration', netlifyConfig)
  console.log('Plugin configuration', inputs)
  console.log('Build directory', PUBLISH_DIR)

  // Display success information
  status.show({ summary: 'Success!' })
}

export async function onBuild({
  // Whole configuration file. For example, content of `netlify.toml`
  netlifyConfig,
  // Users can pass configuration inputs to any plugin in their Netlify
  // configuration file.
  // For example:
  //
  //   [[plugins]]
  //   package = "netlify-plugin-{{name}}"
  //     [plugins.inputs]
  //     foo = "bar"
  inputs,
  // `onError` event handlers receive the error instance as argument
  error,

  // Build constants
  constants: {
    // Path to the Netlify configuration file. `undefined` if none was used
    CONFIG_PATH,
    // Directory that contains the deploy-ready HTML files and assets
    // generated by the build. Its value is always defined, but the target
    // might not have been created yet.
    PUBLISH_DIR,
    // The directory where function source code lives.
    // `undefined` if not specified by the user.
    IS_LOCAL,
    // Version of Netlify Build as a `major.minor.patch` string
    SITE_ID,
  },

  // Core utilities
  utils: {
    // Utility to report errors.
    // See https://github.com/netlify/build#error-reporting
    build,
    // Utility to display information in the deploy summary.
    // See https://github.com/netlify/build#logging
    status,
    // Utility for caching files.
    // See https://github.com/netlify/build/blob/master/packages/cache-utils#readme
    cache,
    // Utility for running commands.
    // See https://github.com/netlify/build/blob/master/packages/run-utils#readme
    run,
    // Utility for dealing with modified, created, deleted files since a git commit.
    // See https://github.com/netlify/build/blob/master/packages/git-utils#readme
    git,
    // Utility for handling Netlify Functions.
    // See https://github.com/netlify/build/tree/master/packages/functions-utils#readme
    functions,
  },
}) {
  try {
    const tdir = path.join(os.tmpdir(), 'quarto')

    // QUARTO_CMD can be set up as a build environment variable for no-config
    // runs, or to override the version in the configuration file.
    const cmd = process.env["QUARTO_CMD"] ?
      process.env["QUARTO_CMD"] : inputs.cmd

    // quarto will be at /tmp/quarto/bin/quarto
    // and this will run at the project root for the working directory
    // inputs.cmd by default is just "render" so will get `/tmp/quarto/bin/quarto render`
    await run.command(path.join(tdir, 'bin/quarto ') + cmd)
  } catch (error) {
    build.failBuild('Error message', { error })
  }
  status.show({ summary: 'Success!' })
}

// Other available event handlers
/*

// Before build commands are executed
export const onPreBuild = function () {}

// Build commands are executed
// After Build commands are executed
export const onPostBuild = function () {}

// Runs on build success
export const onSuccess = function () {}

// Runs on build error
export const onError = function () {}

// Runs on build error or success
export const onEnd = function () {}

*/
