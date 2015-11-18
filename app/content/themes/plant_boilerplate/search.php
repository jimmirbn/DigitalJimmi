<?php get_header(); ?>
		<div id="main-content" role="main">
				<h1><?php echo sprintf( __( '%s Search Results for '), $wp_query->found_posts ); echo get_search_query(); ?></h1>
				<?php get_template_part('loop'); ?>
		</div><!-- /main-content -->	
	<?php get_sidebar(); ?>
<?php get_footer(); ?>