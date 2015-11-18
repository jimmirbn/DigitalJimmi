<?php get_header(); ?>
	<div id="main-content" role="main">
		<h2><?php _e( 'Categories for'); the_category(); ?></h2>
		<?php get_template_part('loop'); ?>
		<?php get_template_part('pagination'); ?>
	</div><!-- /main-content -->
	<?php get_sidebar(); ?>
<?php get_footer(); ?>