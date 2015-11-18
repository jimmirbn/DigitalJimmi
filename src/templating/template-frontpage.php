<?php
/*
Template Name: Frontpage
*/

get_header(); 
?>
<div class="container">
	<div class="videoBG">
		<video autoplay="autoplay" poster="<?php echo get_stylesheet_directory_uri() ?>/assets/img/poster.png" id="bgvid" loop><source src="<?php echo get_stylesheet_directory_uri() ?>/assets/video_2.mp4" type="video/mp4"></video>
	</div>

	<div class="circle">
		<svg width="502.975px" height="502.975px" class="circle_svg">
			<path fill="none" stroke="#ffffff" stroke-width="2" stroke-miterlimit="10" d="M115.478,461.869"/>
			<path fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" d="M388.763,461.043"/>
			<path fill="none" stroke="#ffffff" stroke-width="2" stroke-miterlimit="10" d="M41.235,387.696C15.783,348.488,1,301.714,1,251.487
			C1,113.147,113.147,1,251.487,1c138.34,0,250.487,112.147,250.487,250.487c0,49.615-14.425,95.861-39.311,134.772"/>
			<path class="pathCircle" fill="none" stroke="none" stroke-width="2" stroke-miterlimit="10" d="M115.478,461.869
			c-29.66-19.215-55-44.531-74.242-74.173"/>
			<path fill="none" stroke="#ffffff" stroke-width="2" stroke-miterlimit="10" d="M200.152,496.709
			c-30.676-6.391-59.295-18.391-84.738-34.877"/>
			<path fill="none" stroke="#ffffff" stroke-width="2" stroke-miterlimit="10" d="M388.763,461.027
			c-25.152,16.51-53.455,28.613-83.812,35.213"/>
			<path class="path" fill="none" stroke="none" stroke-width="2" stroke-miterlimit="10" d="M462.664,386.26
			c-19.08,29.836-44.31,55.359-73.901,74.783"/>
			<path class="path" fill="none" stroke="none" stroke-width="2" stroke-miterlimit="10" d="M304.971,496.256
			c-17.227,3.746-35.115,5.719-53.464,5.719c-17.595,0-34.766-1.814-51.335-5.266"/>
		</svg>
      <div class="modal-cover"></div>

		<div class="circle__inner">
			<a href="#" class="close fa fa-close"></a>
			<div class="intro-container">
			<p class="introAni intro">Frontend</p>
			<p class="introAni intro2">Developer</p>
			</div>
			<!--<img class="logo active" src="<?php echo get_field('center_image'); ?>" alt="">-->
			<?php include('templates/circle-1.php'); ?>
			<?php include('templates/circle-2.php'); ?>
			<?php include('templates/circle-3.php'); ?>
		</div>
		<div class="circle__component circle__component--1">
			<img src="<?php echo get_stylesheet_directory_uri() ?>/assets/img/user1.png" alt="">
		</div>
		<div class="circle__component circle__component--2">
			<img src="<?php echo get_stylesheet_directory_uri() ?>/assets/img/work.png" alt="">
		</div>
		<div class="circle__component circle__component--3">
			<img src="<?php echo get_stylesheet_directory_uri() ?>/assets/img/personal.png" alt="">
			
		</div>
	</div>
	
</div>
<?php get_footer(); ?>