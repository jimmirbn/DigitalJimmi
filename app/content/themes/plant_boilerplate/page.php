<?php get_header(); ?>
	<?php if (have_posts()): while (have_posts()) : the_post(); ?>
		<div id="main-content" role="main">
				<h1><?php the_title(); ?></h1>
				<?php the_content(); ?>
		</div><!-- /main-content -->	
	<?php endwhile;endif; ?>
	<?php get_sidebar(); ?>
<?php get_footer(); ?>