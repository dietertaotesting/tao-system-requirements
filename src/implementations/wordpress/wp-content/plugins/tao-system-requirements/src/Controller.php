<?php


namespace Oat\TaoSystemRequirements;


use Oat\TaoSystemRequirements\Traits\ViewTrait;

class Controller
{
    use ViewTrait;

    private $data;

    private $domain = 'front-end';

    public function __construct()
    {
        $this->data = (new Model())->getData();
    }

    /**
     * Supported browsers
     * @return string
     */
    public function renderBrowsers(): string
    {
        return $this->render([
            'browsers' => $this->data['browsers']
        ]);
    }

    /**
     * Supported programming languages
     * @return string
     */
    public function renderLanguages(): string
    {
        return $this->render([
            'languages' => $this->data['server']['stack']['languages']
        ]);
    }

    /**
     * Supported databases
     * @return string
     */
    public function renderDatabases(): string
    {
        return $this->render([
            'databases' => $this->data['server']['stack']['databases']
        ]);
    }

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

    /**
     * Docker related (Docker Desktop and command line to run TAO)
     * @return string
     */
    public function renderVirtualized(): string
    {
        return $this->render([
            'virtualized' => $this->data['downloads']['virtualized']
        ]);
    }

    /**
     * Docker related with heading and description
     * @return string
     */
    public function renderVirtualizedComplete(): string
    {
        return $this->render([
            'virtualized-complete' => [
                'virtualized' => $this->renderVirtualized()
            ]
        ]);
    }

    /**
     * Server-side requirements and source downloads combined
     * @return string
     */
    public function renderServerSideAndSource(): string
    {
        return $this->render([
            'server-side-source' => [
                'languages' => $this->renderLanguages(),
                'servers' => $this->renderServers(),
                'databases' => $this->renderDatabases(),
                'source-downloads' => $this->renderSourceDownloads()
            ]
        ]);
    }

    /**
     * Source downloads (zip archive, GitHub)
     * @return string
     */
    public function renderSourceDownloads(): string
    {
        return $this->render([
            'source-downloads' => $this->data['downloads']['source']
        ]);
    }

    /**
     * Supported viewports and devices
     * @return string
     */
    public function renderViewportsAndDevices(): string
    {
        return $this->render([
            'viewports-devices' => $this->data['viewportDevices']
        ]);
    }


    /**
     * Version number of the current TAO release
     * @return string
     */
    public function renderRelease(): string
    {
        return $this->render('release');
    }

}