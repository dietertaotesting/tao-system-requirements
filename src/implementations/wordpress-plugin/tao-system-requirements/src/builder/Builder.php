<?php

namespace Oat\TaoSystemRequirements\builder;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use ZipArchive;
use Parsedown;

class Builder
{
    private $pluginRoot;
    private $buildDir;

    public function __construct()
    {
        $this->pluginRoot = $this->normalizePath(dirname(__DIR__, 2));
        $this->buildDir = $this->normalizePath(realpath('./build') . '/wordpress-plugin');

        if (!is_dir($this->buildDir)) {
            mkdir($this->buildDir, 0755, true);
        }
    }

    public function deploy() {
        $this->buildArchive();
        $this->convertReadme();
    }

    /**
     * Deploy: Zip the plugin and copy the archive to the build directory
     */
    private function buildArchive()
    {
        $archive = basename($this->pluginRoot) . '.zip';
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($this->pluginRoot));

        chdir($this->pluginRoot);

        $zip = new ZipArchive;
        $zip->open($archive, ZipArchive::CREATE);

        foreach ($iterator as $file) {
            if ($file->isDir()) {
                continue;
            }
            $path = $this->normalizePath($file->getPathname());
            $path = ltrim(str_replace($this->pluginRoot, '', $path), '/');
            if(false !== strpos($path, 'builder')
                || false !== strpos($path, 'readme-assets')
                || in_array(basename($path), ['deploy.php', 'composer.json', 'composer.lock'])
            ){
                continue;
            }
            $zip->addFile($path);
        }

        $zip->close();

        rename($this->pluginRoot . '/' . $archive, $this->buildDir . '/' . basename($archive));
    }


    private function convertReadme()
    {
        $parseDown = new Parsedown();
        $assetDir = $this->pluginRoot . '/readme-assets';
        $readmeContent = $parseDown->text(file_get_contents($this->pluginRoot . '/readme.md'));
        $readmeStyles = file_get_contents($assetDir . '/style.css');
        $readmeTpl = file_get_contents($assetDir . '/index.tpl');
        file_put_contents(
            $this->buildDir . '/index.html',
            str_replace(
                ['{STYLES}', '{CONTENTS}'],
                [$readmeStyles, $readmeContent],
                $readmeTpl
            )
        );
    }

   private function normalizePath($path)
    {
        return preg_replace('~(\\\\|/)+~', '/', $path);
    }

}