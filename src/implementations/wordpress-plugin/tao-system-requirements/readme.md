# TAO System requirements

## WordPress plugin

This plugin retrieves the latest system requirements and download URLs from the API (behind a GH-Page) on [oat-sa.github.io/tao-system-requirements](https://oat-sa.github.io/tao-system-requirements). It provides WordPress shortcodes for all blocks as well as a stylesheet including all assets. Data will be cached in WP based on `config/config.json#cache:lifetime`.

### Shortcodes 
The shortcodes are generated from the method names and comments of `tao-system-requirements/src/Controller.php`. All methods starting with `render` create a corresponding shortcode. Currently the mapping is the following:

| Method                        | Short code                        | Label                  | Description                                                 |
|-------------------------------|-----------------------------------|------------------------|-------------------------------------------------------------|
| `renderBrowsers()`            | [tao_core_browsers]               | Browsers               | Supported browsers                                          |
| `renderDatabases()`           | [tao_core_databases]              | Databases              | Supported databases                                         |
| `renderLanguages()`           | [tao_core_languages]              | Languages              | Supported programming languages                             |
| `renderRelease()`             | [tao_core_release]                | Release                | Version number of the current TAO release                   |
| `renderServerSideAndSource()` | [tao_core_server_side_and_source] | Server side and source | Server-side requirements and source downloads combined      |
| `renderServers()`             | [tao_core_servers]                | Servers                | Supported web servers                                       |
| `renderSourceDownloads()`     | [tao_core_source_downloads]       | Source downloads       | Source downloads (zip archive, GitHub)                      |
| `renderViewportsAndDevices()` | [tao_core_viewports_and_devices]  | Viewports and devices  | Supported viewports and devices                             |
| `renderVirtualized()`         | [tao_core_virtualized]            | Virtualized            | Docker related (Docker Desktop and command line to run TAO) |
| `renderVirtualizedComplete()` | [tao_core_virtualized_complete]   | Virtualized complete   | Docker related with heading and description                 |


## Development

The plugin is usable and while it could be improved a bit here and there, we have no immediate need to do this. If you work on it, however, you will need to bump the version in `tao-system-requirements.php` and to deploy by executing one of the following commands from de repository root.
```bash 
php ./src/implementations/wordpress-plugin/tao-system-requirements/deploy.php
# or
npm run deploy:wp-plugin
``` 
This creates a new archive `build/wp-plugin`, which will then be found from within WordPress.

You can test the plugin by installing it on a random WordPress.