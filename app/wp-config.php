<?php
/** Enable W3 Total Cache */
define('WP_CACHE', true); // Added by W3 Total Cache

/**
* The base configurations of the WordPress.
*
* This file has the following configurations: MySQL settings, Table Prefix,
* Secret Keys, WordPress Language, and ABSPATH. You can find more information
* by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
* wp-config.php} Codex page. You can get the MySQL settings from your web host.
*
* This file is used by the wp-config.php creation script during the
* installation. You don't have to use the web site, you can just copy this file
* to "wp-config.php" and fill in the values.
*
* @package WordPress
*/

/* ------------------------------ WEBSITE / APP GLOBAL SETTINGS - MUST BE REVIEWED ------------------------------ */
// current protocol
$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';
define('PROTOCOL', $protocol);
define('DOMAIN',$_SERVER['HTTP_HOST']);

// environment urls WITHOUT protocol
$localurl = 'local.digitaljimmi.com';
$productionurl = 'www.digitaljimmi.com';

// FACEBOOK SETTINGS (comment back in if this is a FB app)
// define('APP_ID','xxxxxxxxxxxxxxxx');
// define('APP_SECRET','xxxxxxxxxxxx');
// TODO quite possibly add a 'vanity/sharer url' for relaying FB posts and some such'es - awaiting the braintrust
// define('SHARER_URL','projectXX.myengeniusandgenericsharerdomain.tld');

// TESTING - bugherd project key - comment in #63 and optionally #49
// $bugherdProjectKey = "9tyttgzi3rvcx8cemmc0kw";

/* ------------------------------ WEBSITE / APP GLOBAL SETTINGS - MUST BE REVIEWED ------------------------------ */

switch($_SERVER['HTTP_HOST']) {
    case $localurl == $_SERVER['HTTP_HOST']:
    // local environment
        $url = PROTOCOL . $localurl;
        define('WP_HOME', PROTOCOL . $_SERVER['HTTP_HOST']);
        define('WP_SITEURL', PROTOCOL . $_SERVER['HTTP_HOST'].'/wordpress');
        define('DB_NAME', 'digitaljimmi_com_db');
        define('DB_USER', 'digitaljim_com');
        define('DB_PASSWORD', 'Jimmirbn16');
        define('DB_HOST', 'mysql18.unoeuro.com');
        define('ENVIRONMENT', 'production');
        define('WP_DEBUG', false);
        // define('WP_HOME', $url);
        // define('WP_SITEURL', $url.'/wordpress');
        // define('DB_NAME', 'digitaljimmi');
        // define('DB_USER', 'root');
        // define('DB_PASSWORD', 'root');
        // define('DB_HOST', 'localhost');
        // define('ENVIRONMENT', 'local');
        // define('WP_DEBUG', true);

        define('WP_CONTENT_URL', $url.'/content');
        define( 'WP_CONTENT_DIR', $_SERVER['DOCUMENT_ROOT'] . '/content' );
        // define('BUGHERD_PROJECT_KEY', $bugherdProjectKey);
    break;
    case "www.".$productionurl == $_SERVER['HTTP_HOST']:
    case $productionurl == $_SERVER['HTTP_HOST']:
        // production environment
        $url = PROTOCOL . $_SERVER['HTTP_HOST'];
        define('WP_HOME', PROTOCOL . $_SERVER['HTTP_HOST']);
        define('WP_SITEURL', PROTOCOL . $_SERVER['HTTP_HOST'].'/wordpress');
        define('DB_NAME', 'digitaljimmi_com_db');
        define('DB_USER', 'digitaljim_com');
        define('DB_PASSWORD', 'Jimmirbn16');
        define('DB_HOST', 'mysql18.unoeuro.com');
        define('ENVIRONMENT', 'production');
        define('WP_DEBUG', false);

        define('WP_CONTENT_URL', $url.'/content');
        define( 'WP_CONTENT_DIR', $_SERVER['DOCUMENT_ROOT'] . '/content' );
    break;
    // default :
    // // for working on the Boilerplate ... PLEASE REMOVE THIS FOR PRODUCTION SITES
    //     $url = PROTOCOL . $localurl;
    //     define('WP_HOME', $url);
    //     define('WP_SITEURL', $url.'/wordpress');
    //     define('DB_NAME', 'plantplant_wordpress-boilerplate');
    //     define('DB_USER', 'plantplant_wpboi');
    //     define('DB_PASSWORD', '7sySaCQATZrLeyNm');
    //     define('DB_HOST', 'db.plnt.dk');
    //     define('ENVIRONMENT', 'boilerplate');
    //     define('WP_DEBUG', true);
    // break;
}
/* Default */

define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

define( 'WP_AUTO_UPDATE_CORE', false );
define( 'DISALLOW_FILE_EDIT', true );
define('FS_METHOD','direct');
define('WP_DEFAULT_THEME', 'plant_boilerplate');

/**#@+
* Authentication Unique Keys and Salts.
*
* Change these to different unique phrases!
* You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
* You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
*
* @since 2.6.0
*/
define('AUTH_KEY',         'F<Q9P6b^ GY<taV{/0X|V.#8d5+e-C-5uciLk+xY-tp?=4RbNPZy,L7oxso|:t-Y');
define('SECURE_AUTH_KEY',  'pStMGem-]0n7_lB}+biKl[qGF5:m^KJ$O-vY[c,6^+<~ZKCyIRbB%o27SHTWH4na');
define('LOGGED_IN_KEY',    'Q/d3@,<$I*f9giFxeoT,Q5BcX3puiU|[9}KufpzpoVdhEFiR8?FpxGb2L2i+J!}?');
define('NONCE_KEY',        'T#w2q{+rKShZ8%G0T9<9v=yuVUnIas]hdK:-?2O4&u,yoSw3cJLH9&JI7:|bo*Rl');
define('AUTH_SALT',        'yJ2pZm]+emU_TsA6&ax7d)>XxK,%grk>[#TBc-NhX&.,D]yf/o+n|.I_BLR=6Ez/');
define('SECURE_AUTH_SALT', 'ga5Q~UiFzGF)L-i;-RF2f8wOIrq813Z>I7BL_nk|0D{/mH$&)IPHbQ2ADQ?j2 ;o');
define('LOGGED_IN_SALT',   'kDL 6P:{K4(y<`Tk6^z#[jieLKE|Fy|q.cu1[E&Sj1($7])t@$-(1)N{u2>SU|s[');
define('NONCE_SALT',       ',<*BBBDHn+<Ij0quJXuDwA@r}<O-bw[d)n+C;{^GFZ*p1y)eHk#T~hnP|tkKb!+&');


$table_prefix = 'wp_';

if (!defined('ABSPATH'))
define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once (ABSPATH . 'wp-settings.php');