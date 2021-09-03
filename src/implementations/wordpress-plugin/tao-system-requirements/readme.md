# TAO System requirements

## WordPress plugin

This plugin retrieves the latest system requirements and download URLs from the API (behind a GH-Page) on [oat-sa.github.io/tao-system-requirements](https://oat-sa.github.io/tao-system-requirements). It provides WordPress shortcodes for all blocks as well as a stylesheet including all assets. Data will be cached in WP based on `config/config.json#cache:lifetime`.

### How the controller works
```php
/**
 * Supported web servers
 * @return string
 */
public function renderServers(): string
{
    return $this->render([
        'servers' => $this->data['server']['stack']['servers']
    ]);
}
```
This will look for a template `views/front-end/servers.php` (the name is based on the key of the array) and populate it with the API data from `server.stack.servers`. Note that only methods starting with `render` will be converted to WordPress shortcodes. As you can see in the table below, the name of the method as well as the comment are used to build the shortcode itself along with the label and the description.

### Shortcodes 
Currently the mapping is the following:

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

## Testing the implementation

You can test the plugin by installing it on a random WordPress:

- Create a random post
- Paste the shortcodes into the post

They should all display different sections of the system requirements. Note there will be duplicates because some shortcodes are wrappers of multiple others.

Example: `[tao_core_servers]` + `[tao_core_source_downloads]` = `[tao_core_server_side_and_source]`.
