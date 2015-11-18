<div class="container circlecontent circle-2">
	<?php

// check if the repeater field has rows of data
if( have_rows('portfolio') ):

 	// loop through the rows of data
    while ( have_rows('portfolio') ) : the_row();

		?>
		<div class="box--portfolio">
		<a href="<?php the_sub_field('link') ?>"><h3><?php the_sub_field('headline') ?></h3></a>
			<a href="<?php the_sub_field('link') ?>"><img src="<?php the_sub_field('image'); ?>" alt=""></a>
			<p><?php the_sub_field('info') ?></p>
		</div>
		<?php 
        
    endwhile;

else :

    // no rows found

endif;

?>
</div>
