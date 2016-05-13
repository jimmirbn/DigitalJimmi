<?php 
/*
Template Name: Konf
*/
get_header();
global $wpdb;
$results = $wpdb->get_results("SELECT * FROM image_slider",ARRAY_A);
$arrayLength = count($results);

?>

<div slider class="slider-container" orig="<?php echo $arrayLength ?>">
<?php 
foreach ($results as $key => $value) {?>
  <div class="slide" style="background-image:url('<?php echo $value[profile_picture] ?>');">
    <button id="' + newImageId + '" class="deleteBtn" type="button">DELETE</button>
  </div>
<?
}
?>
</div>
<div class="loading" ng-class="{active: sliderctrl.isLoading}"></div>
<?php get_footer(); ?>