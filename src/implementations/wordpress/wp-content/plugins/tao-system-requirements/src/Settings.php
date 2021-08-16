<?php

namespace Oat\TaoSystemRequirements;


class Settings
{

    private $data = [];

    private static $instance;

    private function __construct()
    {
    }

    public static function init(array $data) {
        $instance = settings::getInstance();
        $instance->data = $data;
    }

    public static function getInstance()
    {
        if (!isset(self::$instance)) {
            $class = __CLASS__;
            self::$instance = new $class;
        }
        return self::$instance;
    }

    /**
     * reads data from the settings
     *
     * @code
     * settings::read('foo.bar')
     * @endcode
     *
     * @param string $name the name of the variable to read
     * @return mixed  the content of the requested variable or false if the variable does not exist
     *
     */
    public static function get(string $name)
    {
        $instance = settings::getInstance();
        if (isset($instance->data[$name])) {
            return $instance->data[$name];
        } else if (strpos($name, '.') !== false) {
            $current[0] =& $instance->data;
            $i = 1;
            $name = explode('.', $name);
            $return = false;
            foreach ($name as $key => $value) {
                if (!isset($current[$i - 1][$value])) {
                    return false;
                }
                $return = $current[$i - 1][$value];
                $current[$i] =& $current[$i - 1][$value];
                $i++;
            }
            return $return;
        }
        return false;
    }

}
