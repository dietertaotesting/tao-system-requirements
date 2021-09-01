<?php

class Builder
{
    public function __construct()
    {
        $this->listFiles();
    }

    private function listFiles()
    {
        $buildDir = realpath('./build') . '/wp-plugin';
        $parseDir = dirname(__DIR__) . '/tao-system-requirements';
        $archive = basename($parseDir) . '.zip';

        if(!is_dir($buildDir)){
            mkdir($buildDir, 0755, true);
        }

        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($parseDir));

        chdir($parseDir);
        $zip = new ZipArchive;
        $zip->open($archive, ZipArchive::CREATE);

        foreach ($iterator as $file) {
            if ($file->isDir()) {
                continue;
            }
            $zip->addFile(ltrim(str_replace($parseDir, '', $file->getPathname()), '\\/'));
        }

        $zip->close();

        rename ($parseDir . '/' . $archive, $buildDir . '/' . basename($archive));
    }


}

new Builder();