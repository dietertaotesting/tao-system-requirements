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
        if (!$cacheData['data'] || $cacheData['expired']) {
            $freshData = $this->fetchRemote();
            if ($freshData) {
                $this->cache->store($freshData);
            }
        }
        if (!empty($freshData)) {
            return $freshData;
        } else if ($cacheData['data']) {
            return $cacheData['data'];
        } else {
            return [];
        }
    }

    private function fetchRemote()
    {
        $client = new Client();
        $response = $client->request('GET', Settings::get('api.url') . '/' . Settings::get('api.path'));
        if ($response->getStatusCode() !== 200) {
            return false;
        }
        return json_decode($response->getBody(), 1);
    }
}