<?php


namespace Oat\TaoSystemRequirements;

/**
 * Handles the connection with WordPress
 */
class WpBridge
{

    private $shortCodes;
    private $capability = 'edit_pages';
    private $linkParam = 'tsrd-overview';
    private $pluginBaseName;
    private $pluginRoot;
    private $resources = [];

    public function __construct(string $pluginBaseName, string $pluginRoot)
    {
        $this->pluginBaseName = $pluginBaseName;
        $this->pluginRoot = $pluginRoot;
        $this->initSettings();
        $this->shortCodes = new ShortCodes();
        $this->registerShortCodes();
        $this->registerHelpScreen();
        $this->resources[] = 'styles.css';
        $this->registerResources();
    }

    public function loadResource()
    {
        foreach($this->resources as $resource){
            $info = pathinfo($resource);
            $type = $info['extension'];
            $id = Settings::get('plugin.name') . '-' . $type . '-' . $info['filename'];
            $localPath = '/assets/' . $type . '/' . $resource;
            $httpPath = Settings::get('plugin.url') . $localPath;
            $buster = date('Y-m-d-H-i-s', filemtime(Settings::get('root') . $localPath));
            if($type === 'js'){
                wp_enqueue_script($id, $httpPath, [], $buster, true);
            }
            if($type === 'css'){
                wp_enqueue_style($id, $httpPath, [], $buster);
            }
        }
    }

    public function registerResources() {
        add_action( 'wp_enqueue_scripts', [$this, 'loadResource']);
    }

    private function initSettings()
    {
        $name = trim(dirname($this->pluginBaseName), '/');
        Settings::init(
            array_merge([
                'plugin' => [
                    'basename' => $this->pluginBaseName,
                    'name' => $name,
                    'url' => '/wp-content/plugins/' . $name
                ],
                'root' => $this->pluginRoot
            ],
                json_decode(file_get_contents($this->pluginRoot . '/config/config.json'), 1)
            )
        );

    }

    private function registerShortCodes()
    {
        $this->shortCodes->registerRegular();
    }

    public function addHelpScreenLinks(array $actions): array
    {
        $myActions = ['overview' => '<a href="' . esc_url(add_query_arg(array('page' => $this->linkParam), admin_url('index.php'))) . '">Short code overview</a>'];

        return array_merge($actions, $myActions);
    }

    public function addHelpScreen()
    {
        add_action('admin_menu', function () {
            add_dashboard_page(
                'TAO System Requirements and Downloads: Short codes',
                'System Requirements',
                $this->capability,
                $this->linkParam,
                [$this->shortCodes, 'displayOverviewTable']
            );
        });
    }

    private function registerHelpScreen()
    {

        add_filter(
            'plugin_action_links_' . $this->pluginBaseName,
            [$this, 'addHelpScreenLinks']
        );
        $this->addHelpScreen();
    }
}


