<?php
$options = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);	
$bdd = new PDO('mysql:host=localhost;dbname=oclock', 'root','', $options);