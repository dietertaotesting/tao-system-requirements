<?php


namespace Oat\TaoSystemRequirements\Traits;

use Oat\TaoSystemRequirements\Settings;

trait ViewTrait
{
    public function getView(string $segment):string{
        $dir = Settings::get('root') . '/views/' . $this->domain;
        return realpath($dir . '/' . $segment . '.php');
    }

    /**
     * Render a template
     * @param array $data
     * @return string
     */
    private function render(array $data): string
    {
        $template = $this->getView(key($data));
        if (!$data || !$template) {
            return '';
        }
        ob_start();
        include $template;
        $html = ob_get_contents();
        ob_end_clean();
        return $html;
    }
}