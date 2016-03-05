<?
include_once('includes/theme.include.php');
include_once ('includes/ajax.include.php');
// include_once('includes/facebook.include.php');
// include_once('includes/custom-post-type.include.php');


// function add_bugherd() {
//     print "
//         <script type='text/javascript'>
//             (function (d, t) {
//               var bh = d.createElement(t), s = d.getElementsByTagName(t)[0];
//               bh.type = 'text/javascript';
//               bh.src = '//www.bugherd.com/sidebarv2.js?apikey=" . BUGHERD_PROJECT_KEY . "';
//               s.parentNode.insertBefore(bh, s);
//               })(document, 'script');
//         </script>
//     ";
// }
function add_ga(){
    print "
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-52020352-2', 'auto');

          ga('send', 'pageview');

        </script>
    ";
}
function add_jsconstants() {
    print "
        <script type='text/javascript'>

            var isFacebook  = top!==self;   
            var baseUrl     = '".get_bloginfo('url')."';
            var themeUrl     = '".get_stylesheet_directory_uri()."';
            var domain      = '".DOMAIN."';
            var ajaxUrl     = '".admin_url('admin-ajax.php')."';
        </script>
    "; 
}
function theme_init() {  
    global $pagenow;
    if ( ! is_admin() && 'wp-login.php' !== $pagenow ) {
        
        $themeUrl = get_stylesheet_directory_uri();
        wp_register_script('modernizr', $themeUrl . (ENVIRONMENT !== 'local' ? '/js/modernizr-custom.min.js' : '/js/modernizr-custom.js') , false, '0.1', false);
        wp_enqueue_script('modernizr');
        wp_deregister_script('jquery');
        wp_register_script('jquery', $themeUrl . (ENVIRONMENT !== 'local' ? '/js/vendors.min.js' : '/js/vendors.js'), false, '0.1', true);  
        wp_enqueue_script('jquery');
        wp_register_script('site', $themeUrl . (ENVIRONMENT !== 'local' ? '/js/site.min.js' : '/js/site.js'), array('jquery'), '1.2', true);
        wp_enqueue_script('site');
        wp_register_style('style', $themeUrl . (ENVIRONMENT === 'local' ? '/style.min.css' : '/style.css'));
        wp_enqueue_style('style');
        // if (defined('BUGHERD_PROJECT_KEY')) {
        //     add_action('wp_head', 'add_bugherd');
        // }
        add_action('wp_head', 'add_jsconstants');
        add_action('wp_head', 'add_ga');
    }  
}

if( function_exists('acf_add_options_page') ) {
    
    acf_add_options_page();
    
}
add_action('init', 'theme_init');
add_filter('show_admin_bar', '__return_false');

add_action('fu_additional_html', 'my_fu_additional_html' );

function my_fu_additional_html() {
?>
<div class="fileUpload btn btn-primary">
    <span>Upload billede</span>
    <input type="file" value="" name="files[]" id="ug_photo" class="required upload" onchange="this.form.submit()">
</div>
<?php
}