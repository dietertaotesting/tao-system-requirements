<?php


namespace Oat\TaoSystemRequirements;


use Doctrine\Inflector\InflectorFactory;

class ShortCodes
{
    private $shortCodeParameters;

    public function __construct()
    {
        $this->shortCodeParameters = $this->collectParameters();
    }

    public function registerRegular()
    {
        foreach ($this->shortCodeParameters as $parameters) {
            add_action('init',
                function () use ($parameters) {
                    add_shortcode($parameters['name'],
                        function () use ($parameters) {
                            return call_user_func($parameters['callback']);
                        });
                });
        }
    }

    private function collectParameters(): array
    {
        $inflector = InflectorFactory::create()->build();
        $structure = new \ReflectionClass(new Controller());
        $className = $structure->getNamespaceName() . '\\' . $structure->getName();

        $parameters = [];

        foreach ($structure->getMethods() as $method) {
            $methodName = $method->getName();
            preg_match('~render(\w+)~', $methodName, $matches);
            if (empty($matches[1])) {
                continue;
            }
            $label = $this->getLabel($method->getDocComment());
            if(!$label) {
                $label = ucwords(str_replace('_', ' ', $inflector->tableize($methodName)));
            }
            $parameters[] = [
                'label' => $label,
                'name' => $inflector->tableize('taoCore' . $matches[1]),
                'callback' => [$className, $methodName]
            ];
        }
        return $parameters;
    }

    private function getLabel(string $comment):string {
        preg_match('~@wpb\s+(?<label>.*)~', $comment, $matches);
        if(empty($matches['label'])){
            return '';
        }
        return trim($matches['label']);
    }

// function that runs when shortcode is called
    function wpb_demo_shortcode()
    {

// Things that you want to do.
        $message = 'Hello world!';

// Output needs to be return
        return $message;
    }
// register shortcode
//add_shortcode('greeting', 'wpb_demo_shortcode');
}