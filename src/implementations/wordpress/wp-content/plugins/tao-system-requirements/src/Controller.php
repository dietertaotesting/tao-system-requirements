<?php


namespace Oat\TaoSystemRequirements;


class Controller
{
    private $data;

    public function __construct()
    {
        $this->data = (new Model())->getData();
    }

    /**
     * Render a template
     * @param array $data
     * @return string
     */
    private function render(array $data): string
    {
        $segment = key($data);
        $views = Settings::get('root') . '/views';
        $template = realpath($views . '/' . $segment . '.php');
        if (!$data || !$template) {
            return '';
        }
        ob_start();
        include $template;
        $html = ob_get_contents();
        ob_end_clean();
        return $html;
    }

    /**
     * @wpb All system requirements combined
     * @return string
     */
    public function renderAll(): string
    {
        return $this->render([
            'all' => $this->data
        ]);
    }

    /**
     * @wpb Supported browsers
     * @return string
     */
    public function renderBrowsers(): string
    {
        return $this->render([
            'browsers' => $this->data['browsers']
        ]);
    }

    /**
     * @wpb Supported programming languages
     * @return string
     */
    public function renderLanguages(): string
    {
        return $this->render([
            'languages' => $this->data['server']['stack']['languages']
        ]);
    }

    /**
     * @wpb Supported databases
     * @return string
     */
    public function renderDatabases(): string
    {
        return $this->render([
            'databases' => $this->data['server']['stack']['databases']
        ]);
    }

    /**
     * @wpb Supported web servers
     * @return string
     */
    public function renderServers(): string
    {
        return $this->render([
            'servers' => $this->data['server']['stack']['servers']
        ]);
    }

    /**
     * @wpb Docker related
     * @return string
     */
    public function renderVirtualized(): string
    {
        return $this->render([
            'virtualized' => $this->data['downloads']['virtualized']
        ]);
    }

    /**
     * @wpb Docker related with heading and description
     * @return string
     */
    public function renderFromVirtualized(): string
    {
        return $this->render([
            'from-virtualized' => [
                'virtualized' => $this->renderVirtualized()
            ]
        ]);
    }

    /**
     * @wpb Server-side requirements and source downloads
     * @return string
     */
    public function renderFromSource(): string
    {
        return $this->render([
            'from-source' => [
                'languages' => $this->renderLanguages(),
                'servers' => $this->renderServers(),
                'databases' => $this->renderDatabases(),
                'source-downloads' => $this->renderSourceDownloads()
            ]
        ]);
    }

    /**
     * @wpb Source downloads
     * @return string
     */
    public function renderSourceDownloads(): string
    {
        return $this->render([
            'source-downloads' => $this->data['downloads']['source']
        ]);
    }

    /**
     * @wpb Supported viewports and devices
     * @return string
     */
    public function renderViewportDevices(): string
    {
        return $this->render([
            'viewports-devices' => $this->data['viewportDevices']
        ]);
    }


    /**
     * @wpb Release
     * @return string
     */
    public function renderRelease(): string
    {
        return $this->render('release');
    }

}