<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js"> <!--<![endif]-->
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<title><?php wp_title(''); ?><?php if(wp_title('', false)) { echo ' :'; } ?> <?php bloginfo('name'); ?></title>
			
		<!-- meta -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width,initial-scale=1.0">
		<meta name="description" content="<?php bloginfo('description'); ?>">
		
		<!-- icons -->
			
		<!-- css + javascript -->
		<?php wp_head(); ?>

	</head>
	<body <?php body_class();?>>

	<div id="wrap">
		<header role="banner">

			<div id="logo"> 
				<h1><a rel="home" href="<?=get_bloginfo('url');?>" title="Home"><?=get_bloginfo('name');?></a></h1>
		   	</div>

		   	<nav id="primary-nav">
		   		<ul>
			       <?php wp_list_pages(); ?>
		   		</ul>
	   		</nav>
		</header><!--end header-->