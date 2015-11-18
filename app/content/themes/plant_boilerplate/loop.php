<?php if (have_posts()): while (have_posts()) : the_post(); ?>
	
	<article  id="post-<?php the_ID(); ?>" <?php post_class(''); ?>>
		<header>
			<h2>
				<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a>
			</h2>
		</header>

		<?php the_content();?>
		
		<footer>
			<p class="text-muted">
				<small>
					<span class="date "><?php the_time('F j, Y'); ?> <?php the_time('g:i a'); ?></span>
					<span class="author fa fa-keyboard-o"> <?php _e( 'by'); ?> <?php the_author_posts_link(); ?></span>
					<?php if(!is_singular()):?><span class="comments"> <?php comments_popup_link( __( 'Leave your thoughts'), __( '<i class="fa fa-comment"> 1 Comment</i>'), __( '<i class="fa fa-comments"> % Comments</i>')); ?></span><?php endif;?>
				</small>
			</p>
		</footer>
	</article>
	<!-- /article -->
	
<?php endwhile; ?>

<?php else: ?>

	<!-- article -->
	<article>
		<header>
			<h2><?php _e( 'Sorry, nothing to display.'); ?></h2>
		</header>
	</article>
	<!-- /article -->

<?php endif; ?>