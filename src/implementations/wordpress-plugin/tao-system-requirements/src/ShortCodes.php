<?php


namespace Oat\TaoSystemRequirements;

use Oat\TaoSystemRequirements\Traits\ViewTrait;

/**
 * Create WP Short Codes for all features
 */
class ShortCodes
{
    use ViewTrait;

    private $shortCodeParameters;

    private $domain = 'back-end';

    public function __construct()
    {
        $this->shortCodeParameters = $this->collectParameters();

    }


    public function registerRegular()
    {
        foreach ($this->shortCodeParameters as $parameters) {
            add_action('init',
                function () use ($parameters) {
                    add_shortcode($parameters['code'],
                        function () use ($parameters) {
                            return call_user_func($parameters['callback']);
                        });
                });
        }
    }

    /**
     * Pull method names from Controller and build shortcodes
     * @return array
     */
    private function collectParameters(): array
    {
        $controller = new Controller();
        $structure = new \ReflectionClass($controller);

        $parameters = [];

        foreach ($structure->getMethods() as $method) {
            $methodName = $method->getName();
            $label = Helpers::methodNameToLabel($methodName);
            if (!$label) {
                continue;
            }
            $code = Helpers::methodNameToShortCode($methodName);
            $parameters[$code] = [
                'label' => $label,
                'description' => Helpers::commentToDescription($method->getDocComment()),
                'code' => $code,
                'callback' => [$controller, $methodName]
            ];
        }
        ksort($parameters);
        return $parameters;
    }

    /**
     * Generate the shortcode listing
     * @return string
     */
    public function getOverviewTable(): string
    {
        return $this->render([
            'shortcode-overview' => $this->shortCodeParameters
        ]);
    }

    /**
     * Display all shortcodes in the plugin overview page
     */
    public function displayOverviewTable()
    {
        echo $this->getOverviewTable();
    }

}