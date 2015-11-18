<?php
/* AJAJX */
/* Example
 add_action( 'wp_ajax_nopriv_exampleAction', 'exampleAction' );
 add_action( 'wp_ajax_exampleAction', 'exampleAction' );
 function exampleAction() {
 // global $wpdb; // If you need to call the database
 $success = 1;
 $message = '';
 $data = null;
 // generate the response
 $response = json_encode(
 array(
 'success' => $success,
 'message' => $message,
 'data' => $data
 )
 );
 header( "Content-Type: application/json" );
 echo $response;
 exit;
 }*/
/* EOF - AJAX */