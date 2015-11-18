<?php
/*
Template Name: Shop
*/
get_header(); ?>

<?php
                // Setup your custom query
                global $paged;
                if( get_query_var( 'paged' ) )
                $my_page = get_query_var( 'paged' );
                else {
                if( get_query_var( 'page' ) )
                $my_page = get_query_var( 'page' );
                else
                $my_page = 1;
                set_query_var( 'paged', $my_page );
                $paged = $my_page;
                }
                $args = array( 'post_type' => 'product', 'paged' => $my_page, 'posts_per_page' => 1 );
                $loop = new WP_Query( $args );
                //print_r($loop);
                echo '<ul>';
                while ( $loop->have_posts() ) : $loop->the_post();
                    
                    echo '<li class="product">';
                            echo '<a class="prod_image" href="'.esc_url( get_permalink( $post->ID ) ).'" title="'.esc_attr($post->post_title ? $post->post_title : $post->ID).'">';
                            if ( has_post_thumbnail($post->ID) ) {
                                echo get_the_post_thumbnail( $post->ID, apply_filters( 'single_product_large_thumbnail_size', 'shop_single' ) );
                            } else {
                                echo apply_filters( 'woocommerce_single_product_image_html', sprintf( '<img src="%s" alt="Placeholder" />', woocommerce_placeholder_img_src() ), $post->ID );
                            }
                            echo '</a>';                                
                            if(get_post_meta( $post->ID, '_regular_price', true) != ''){
                                echo '<span class="price"><span class="amount">$'.number_format(get_post_meta( $post->ID, '_regular_price', true), 2, '.', '').'</span></span>';
                            } else {
                                echo '<span class="price"><span class="amount">&nbsp;</span></span>';
                            }
                            echo '<p>'.substr(strip_tags($post->post_content),0,25).'...</p>';
                            echo '<div class="info"><a href="'.get_permalink().'">INFO</a></div>';
                        
                    echo '</li>';
                endwhile; 
                wp_pagenavi(array( 'query' => $loop )); 
                wp_reset_query();
                echo "</ul>";
                ?>
<?php get_footer(); ?>