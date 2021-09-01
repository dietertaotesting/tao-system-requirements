<?php


namespace Oat\TaoSystemRequirements;

/**
 * Data cache
 */
class Cache
{
    private $dataFile;

    public function __construct() {
        $this->dataFile = Settings::get('root') . '/' . Settings::get('cache.directory') . '/' . basename(Settings::get('api.path'));
    }

    /**
     * Store data in a file
     * @param array $data
     * @return bool
     */
    public function store(array $data):bool {
        return !!file_put_contents($this->dataFile, json_encode($data));
    }

    /**
     * Retrieve data from the cache
     * @return array
     */
    public function retrieve():array {
        if(!file_exists($this->dataFile)){
            return [
                'data' => false,
                'expired' => true
            ];
        }
        $data = json_decode(file_get_contents($this->dataFile), 1);
        return [
            'data' => $data,
            'expired' => time()- filemtime($this->dataFile) > Settings::get('cache.lifetime')
        ];
    }
}