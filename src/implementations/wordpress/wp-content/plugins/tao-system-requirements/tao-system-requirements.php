<?php
/**
 * Plugin Name:       TAO System Requirements and Downloads
 * Plugin URI:        https://to/do
 * Description:       Registers short codes to display TAO system requirements and downloads in real time
 * Version:           1.0.0
 * Requires at least: 5.5
 * Requires PHP:      7.2
 * Author:            Dieter Raber
 * License:           GPL v2
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://to/do
 */

require_once 'vendor/autoload.php';

use Oat\TaoSystemRequirements\ShortCodes;
use Oat\TaoSystemRequirements\Settings;

$root = dirname(__FILE__);
Settings::init(
    array_merge([
        'root' => $root
    ],
        json_decode(file_get_contents($root . '/config/config.json'), 1)
    )
);

try {
    $shortCodes = new ShortCodes();
    $shortCodes->registerRegular();
} catch (Exception $e) {
    //print $e->getMessage();
}