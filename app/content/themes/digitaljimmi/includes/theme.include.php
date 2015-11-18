<?php
/* Enable thumbnails to post & page */
add_theme_support('post-thumbnails', array('post', 'page'));
/* Register menu */
register_nav_menus( array(
    'primary' => __( 'Primary Menu', 'Main navigation' ),
) );
/* Remove auto added p-tags */
// remove_filter( 'the_content', 'wpautop' );
// remove_filter( 'the_excerpt', 'wpautop' );