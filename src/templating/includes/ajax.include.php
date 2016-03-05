<?php

class LoadImages {

	function __construct()
	{
		add_action( 'wp_ajax_nopriv_loadimages', array( $this, 'loadimages' ) );
		add_action( 'wp_ajax_loadimages', array( $this, 'loadimages' ) );
	}

	/**
	 * The AJAX method
	 *
	 * @return JSON
	 * @author Jens Sogaard
	 **/
	public function loadimages()
	{
		$imageNr = isset($_POST['imageNr']) ? $_POST['imageNr'] : '';
		
		// $itemsPerPage = isset($_POST['itemsPerPage']) ? $_POST['itemsPerPage'] : 5;

		$response = array(
			'images' => $this->getImages($imageNr)
		);

		$this->jsonResponse(1, "", $response);
	}

	/**
	 * Returns the projects
	 *
	 * @return Object
	 * @author Jens Sogaard
	 **/
	private function getImages($imageNr)
	{
		global $wpdb;

		$image = $wpdb->get_results("SELECT * FROM user");

	 	return $image[$imageNr];

		// $args = array(
		// 	// 'cache_results' => true,
		// 	'post_status' => 'any',
		// 	'post_type' => 'attachment',
		// 	'post_parent' => 54,
		// 	'post_mime_type' => 'image'
		// );
		// $args['posts_per_page'] = $itemsPerPage;
		// $args['paged'] = $page;

		// // print_r($args); 

		// $results = new WP_Query( $args );

		// //print_r($results);

		// $images = array();
		// foreach($results->posts as $postItem){
			
		// 	$images[] = array(
			
		// 		'image' =>  wp_get_attachment_url($postItem->ID)
		// 	);
		// }

		// return array(
		// 	'images' => $images,
		// 	'totalPages' => $results->max_num_pages,
		// 	'currentPage' => $args['paged']
		// );
	}

	private function jsonResponse($status, $message = "",$data = null)
	{
		// generate the response
		$response = json_encode(
			array(
				'status' => $status,
				'message' => $message,
				'data' => $data
			)
		);
		header( "Content-Type: application/json" );

		echo $response; 
		die();
	}
}
$projectsAJAX = new LoadImages();

if(isset($_GET['testProjects']) && $_GET['testProjects'] == 1){
	$projectsAJAX->loadimages();
} 
Class CPH5starHost {
private $userTable = 'user';
/**
	 * Update a user
	 *
	 * @return boolean
	 * @author Jens Sogaard
	 **/
	public function updateUser($params)
	{
		if($params['picture_base64'] != ""){
			$profile_picture = $this->handleProfilePicture($params['picture_base64'], $params['picture_orientation']);
			if($profile_picture === false){
				return false;
			}
			$params['profile_picture'] = $profile_picture;
		}


		$allowedFields = array('profile_picture');
		
		global $wpdb;

		// $fields = array();
		// $fieldTypes = array();
		
		// foreach($params as $k => $v){
		// 	if(in_array($k, $allowedFields)){
		// 		$fields[$k] = $v;
		// 		$fieldTypes[] = '%s';
		// 	}
		// }

		// $result = $wpdb->update( 
		// 	$this->userTable,
		// 	$fields, 
		// 	array('id' => $userId),
		// 	$fieldTypes,
		// 	array('%s')
		// );	

		$result = $wpdb->insert( 
				$this->userTable,
				array( 
					'profile_picture' => $params['profile_picture']
				), 
				array( 
					'%s' 
				) 
			);

		if($result === false){
			return false;
		} else {
			return true;
		}
	}


	private function handleProfilePicture($picture_base64, $orientation)
	{

		$picture_base64 = explode(";base64,",$picture_base64);
		$picture_base64 = $picture_base64[count($picture_base64)-1];

		$upload_dir = wp_upload_dir();
		
		$relativePathToUploads = parse_url($upload_dir['baseurl']);
		$relativePathToUploads = $relativePathToUploads['path'];
		
		
		$output_width = 400;
		$output_height = 400;		
		$output_filename = "profile_". md5("238974298". microtime()) . ".jpg";

		$image = imagecreatefromstring(base64_decode($picture_base64));

		//list($source_width, $source_height, $source_type) = getimagesize($source_path);
		$source_width = imagesx($image);
		$source_height = imagesy($image);
		$source_type = 'IMAGETYPE_JPEG';

		$source_gdim = $image;

		$source_aspect_ratio = $source_width / $source_height;
		$desired_aspect_ratio = $output_width / $output_height;

		// if ($source_aspect_ratio > $desired_aspect_ratio) {
		    /*
		     * Triggered when source image is wider
		     */
		//     $temp_height = $output_height;
		//     $temp_width = ( int ) ($output_height * $source_aspect_ratio);
		// } else {
		    /*
		     * Triggered otherwise (i.e. source image is similar or taller)
		     */
		    $temp_width = $source_width;
		    $temp_height = ( int ) ($source_width / $source_aspect_ratio);
		// }

		/*
		 * Resize the image into a temporary GD image
		 */

		// $temp_gdim = imagecreatetruecolor($temp_width, $temp_height);
		// imagecopyresampled(
		//     $temp_gdim,
		//     $source_gdim,
		//     0, 0,
		//     0, 0,
		//     $temp_width, $temp_height,
		//     $source_width, $source_height
		// );

		/*
		 * Copy cropped region from temporary image into the desired GD image
		 */

		// $x0 = ($temp_width - $output_width) / 2;
		// $y0 = ($temp_height - $output_height) / 2;
		// $desired_gdim = imagecreatetruecolor($output_width, $output_height);
		// imagecopy(
		//     $desired_gdim,
		//     $temp_gdim,
		//     0, 0,
		//     $x0, $y0,
		//     $output_width, $output_height
		// );

		imagejpeg($image, $upload_dir['basedir'] . "/" . $output_filename, 100);		

		// Rotate according to EXIF
		if (!empty($orientation)) {
			switch ($orientation) {
			   case 3:
			   		$image = imagecreatefromjpeg($upload_dir['basedir'] . "/" . $output_filename);
			       	$image = imagerotate($image, 180, 0);
			       	imagejpeg($image, $upload_dir['basedir'] . "/" . $output_filename, 100);		
			       	break;
			   case 6:
			        $image = imagecreatefromjpeg($upload_dir['basedir'] . "/" . $output_filename);
			        $image = imagerotate($image, -90, 0);
			       	imagejpeg($image, $upload_dir['basedir'] . "/" . $output_filename, 100);		
			       	break;

			   case 8:
			   		$image = imagecreatefromjpeg($upload_dir['basedir'] . "/" . $output_filename);
			       	$image = imagerotate($image, 90, 0);
			       	imagejpeg($image, $upload_dir['basedir'] . "/" . $output_filename, 100);		
			       	break;
			}
		}
		// EOF - Rotate according to EXIF

		//imagedestroy($desired_gdim);

		return $relativePathToUploads . "/" . $output_filename;
	}
}

add_action( 'wp_ajax_nopriv_gateway', 'gateway' );
add_action( 'wp_ajax_gateway', 'gateway' );
function gateway() {

	$task = isset($_POST['task']) ? $_POST['task'] : '';

	switch ($_POST['task']) {

		case 'updateUser':
			$cph = new CPH5starHost();
			
			if(!isset($_POST['picture_base64'])) $_POST['picture_base64'] = "";
			if(!isset($_POST['picture_orientation'])) $_POST['picture_orientation'] = "";
			$objective = $cph->updateUser($_POST);
			if($objective !== false){
				jsonResponse(1,'updated',$objective);
			} else {
				jsonResponse(0,'user could not be updated');
			}
			break;

		default:
			$status = 0;
			$message = "missing task";
			break;
	}
}

function jsonResponse($status,$message,$data = null)
{
	header('Content-Type: application/json');
	print json_encode(
		array(
			'status' => $status,
			'message' => isset($message) ? $message : "",
			'data' => $data
		)
	);
	die();
}