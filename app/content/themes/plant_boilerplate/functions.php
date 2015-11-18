<?
// if (!is_admin()) {
//     add_action('wp_enqueue_scripts', function() {

//         $baseurl_childtheme = get_stylesheet_directory_uri();

//         // main style
//         wp_register_style('screen', $baseurl_childtheme . '/style.css');
//         wp_enqueue_style('screen');


//         // -----------------------------------------------------------------------------------------------------------

//         wp_register_script('modernizr', $baseurl_childtheme . '/js/modernizr-custom.js' , '', '', false);
//         wp_enqueue_script('modernizr');

//         wp_deregister_script( 'jquery' ); 
//         wp_register_script('jquery', $baseurl_childtheme . '/js/site.js','', '1.0', true);
//         wp_enqueue_script('jquery');

//         add_action('wp_head', 'add_jsconstants');
//         function add_jsconstants() {
//             print "
//                 <script type='text/javascript'>
//                     var isFacebook  = top!==self;   
//                     var baseUrl     = '".get_bloginfo('url')."';
//                     var themeUrl     = '".get_stylesheet_directory_uri()."';
//                     var domain      = '".DOMAIN."';
//                     var ajaxUrl     = '".admin_url('admin-ajax.php')."';
//                 </script>
//             "; 
//         }

//         // bugherd script loading only in 'staging' environment
//         if (defined('BUGHERD_PROJECT_KEY')) {
//             add_action('wp_head', 'add_bugherd');
//             function add_bugherd() {
//                 print "
//                     <script type='text/javascript'>
//                         (function (d, t) {
//                           var bh = d.createElement(t), s = d.getElementsByTagName(t)[0];
//                           bh.type = 'text/javascript';
//                           bh.src = '//www.bugherd.com/sidebarv2.js?apikey=" . BUGHERD_PROJECT_KEY . "';
//                           s.parentNode.insertBefore(bh, s);
//                           })(document, 'script');
//                     </script>
//                 ";
//             }
//         }
//     });
// }

/* Remove auto added p-tags */
add_filter('jpeg_quality', function($arg){ return (int)100; });
add_filter( 'wp_editor_set_quality', function($arg){ return (int)100; });
add_filter( 'automatic_updates_is_vcs_checkout', '__return_false' );

/* Responsive times. Images should always be max-width:100% */
add_filter( 'post_thumbnail_html', 'remove_width_attribute', 10 );
add_filter( 'image_send_to_editor', 'remove_width_attribute', 10 );
function remove_width_attribute( $html ) {
   $html = preg_replace( '/(width|height)="\d*"\s/', "", $html );
   return $html;
}

/* Object to array */
function object_to_array($data)
{
    if (is_array($data) || is_object($data)) {
        $result = array();
        foreach ($data as $key => $value) {
            $result[$key] = object_to_array($value);
        }
        return $result;
    }
    return $data;
}

/* Sanitize filenames */
add_filter('sanitize_file_name', function($string) {
    $string = str_replace("æ", "ea", $string);
    $string = str_replace("ø", "oe", $string);
    $string = str_replace("å", "aa", $string);
    $string = str_replace("Æ", "ea", $string);
    $string = str_replace("Ø", "oe", $string);
    $string = str_replace("Å", "aa", $string);
    
    $string = str_replace(" ", "_", $string);
    $string = str_replace("..", ".", $string);
    $string = strtolower($string);

    preg_match_all("/[^0-9^a-z^_^.]/", $string, $matches);
    foreach ($matches[0] as $value) {
            $string = str_replace($value, "", $string);
    }
    return $string;
}, 10);

/* Make sure that we replace current site_url from postcontent on save - avoid links and images pointing to staging/dev server */
add_filter('content_save_pre',function($content) {
    $content = str_ireplace('src=\"'.get_bloginfo('url'), 'src=\"', $content );
    return str_ireplace('href=\"'.get_bloginfo('url'), 'href=\"', $content );
},'99');


/** ALLOW SVG **/
add_filter('upload_mimes', function($mimes){
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
});