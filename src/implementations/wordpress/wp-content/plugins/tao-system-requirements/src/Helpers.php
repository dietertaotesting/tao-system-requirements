<?php


namespace Oat\TaoSystemRequirements;


class Helpers
{
    private static function camelToWords(string $camel):string {
        return implode(' ', preg_split('/(?=[A-Z])/', lcfirst($camel)));
    }
    /**
     * camelCase to Capitalized Case
     * @param string $camel
     * @return string
     */
    public static function camelToCapitalizedWords(string $camel): string
    {
        return ucwords(self::camelToWords($camel));
    }

    /**
     * camelCase to Capitalized Case
     * @param string $camel
     * @return string
     */
    public static function camelToCapitalizeFirstOnly(string $camel): string
    {
        return ucfirst(strtolower(self::camelToWords($camel)));
    }

    /**
     * camelCase to snake_case
     * @param $camel
     * @return string
     */
    public static function camelToSnake($camel): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $camel));
    }

    /**
     * Fetch the description (such as this line and the next one)
     * from a Doc comment
     * @param string $comment
     * @return string
     */
    public static function commentToDescription(string $comment):string{
        $description = [];
        foreach(array_map('trim', explode("\n", $comment)) as $line) {
            if(false !== strpos($line, '@')){
                break;
            }
            preg_match('~\*(?:\t| )+(?<comment>.*)$~', $line, $matches);
            if(!empty($matches['comment'])){
                $description[] = $matches['comment'];
            }
        };
        return implode("\n", $description);
    }

    /**
     * Get the 'Foo'-bit from renderFoo, but only on function that start with 'render'
     * @param string $methodName
     * @return string
     */
    public static function methodNameToLabel(string $methodName): string {
        preg_match('~render(?<label>\w+)~', $methodName, $matches);
        if (empty($matches['label'])) {
            return '';
        }
        return self::camelToCapitalizeFirstOnly($matches['label']);
    }

    /**
     * Turn renderFoo into tao_core_foo, but only on function that start with 'render'
     * @param string $methodName
     * @return string
     */
    public static function methodNameToShortCode(string $methodName): string
    {
        preg_match('~render(?<label>\w+)~', $methodName, $matches);
        if (empty($matches['label'])) {
            return '';
        }
        return self::camelToSnake('taoCore' . $matches['label']);
    }
}