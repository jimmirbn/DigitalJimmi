<?php get_header(); ?>
	<?php if (have_posts()): while (have_posts()) : the_post(); ?>
		<div class="container" role="main">
				<?php the_content(); ?>
		</div><!-- /main-content -->	
	<?php endwhile;endif; ?>
<?php get_footer(); ?>