<?php


namespace Oat\TaoSystemRequirements;

use GuzzleHttp\Client;


class Model
{
    private $cache;
    private $data;

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->cache = new Cache();
        $this->data = $this->fetch();
        if (!$this->data) {
            throw new \Exception('No system requirement data available');
        }
    }

    /**
     * Get all data
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * Get browser data only
     * @return array
     */
    public function getBrowsers(): array
    {
        return !empty($this->data['browsers']) ? $this->data['browsers'] : [];
    }

    /**
     * Get viewport and device data only
     * @return array
     */
    public function getViewportDevices(): array
    {
        return !empty($this->data['viewportDevices']) ? $this->data['viewportDevices'] : [];
    }

    /**
     * Get server data only
     * @return array
     */
    public function getServer(): array
    {
        return !empty($this->data['server']['stack']) ? $this->data['server']['stack'] : [];
    }

    /**
     * Get virtualization data only
     * @return array
     */
    public function getVirtualized(): array
    {
        return !empty($this->data['server']['virtualized']) ? $this->data['server']['virtualized'] : [];
    }

    /**
     * Get release only
     * @return string
     */
    public function getRelease(): string
    {
        return !empty($this->data['release']) ? $this->data['release'] : '';
    }

    /**
     * Retrieve data from cache or API
     * @return array
     */
    private function fetch(): array
    {
        $cacheData = $this->cache->retrieve();
        $data = $cacheData['data'];
        if (!$data || $cacheData['expired']) {
            $remoteData = $this->fetchRemote();
            if ($remoteData) {
                $data = $remoteData;
                $this->cache->store($data);
            }
        }
        return $data;
    }

    private function fetchRemote()
    {
        $response = wp_remote_get(Settings::get('api.url') . '/' . Settings::get('api.path'));
        if (wp_remote_retrieve_response_code($response) !== 200) {
            return false;
        }
        $body = wp_remote_retrieve_response_code($response);
        if(is_array($body)){
            return $body;
        }
        else {
            return false;
        }
    }
}