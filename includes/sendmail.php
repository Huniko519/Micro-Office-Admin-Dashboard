<?php 
global $_REQUEST;
$response = array('error'=>'');
$contact_email = 'user@example.com';

// type
$type = $_REQUEST['type'];	
// parse
parse_str($_POST['data'], $post_data);	
		

		$user_name = stripslashes(strip_tags(trim($post_data['username'])));
		$user_email = stripslashes(strip_tags(trim($post_data['email'])));
		$user_subject = stripslashes(strip_tags(trim($post_data['subject'])));
		$user_msg =stripslashes(strip_tags(trim( $post_data['message'])));
			
		if (trim($contact_email)!='') {
			$subj = 'Message from MicroOffice';
			$msg = $subj." \r\nName: $user_name \r\nE-mail: $user_email \r\nSubject: $user_subject \r\nMessage: $user_msg";
		
			$head = "Content-Type: text/plain; charset=\"utf-8\"\n"
				. "X-Mailer: PHP/" . phpversion() . "\n"
				. "Reply-To: $user_email\n"
				. "To: $contact_email\n"
				. "From: $user_email\n";
		
			if (!@mail($contact_email, $subj, $msg, $head)) {
				$response['error'] = 'Error send message!';
			}
		} else 
				$response['error'] = 'Error send message!';	
		
		

	//echo json_encode($post_data['username'].''.$post_data['email'].''$post_data['subject'].''.$post_data['message']);	
	echo json_encode($response);
	die();
?>