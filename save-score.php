<?php
require('bdd.php');
if (
	((isset($_POST['score'])) && ( $_POST['score'] != '')) &&
	((isset($_POST['duree'])) && ( $_POST['duree'] != ''))
){
	$options = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);	
	$bdd = new PDO('mysql:host=localhost;dbname=oclock', 'root','', $options);

	$query = $bdd->prepare("INSERT INTO scores VALUES (0,:score,:duree,Now())")or die(print_r($query->errorInfo()));


	$query -> execute(array(		
		'score' => $_POST['score'],
		'duree' => $_POST['duree']
	));
	$query->setFetchMode(PDO::FETCH_OBJ); 
}else{
	echo 'Erreur lors de l\'enregistrement';
}