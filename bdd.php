<?php
$options = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);	
//$bdd = new PDO('mysql:host=localhost;dbname=oclock', 'root','', $options);
$bdd = new PDO('mysql:host=fl154127-001.privatesql:35193;dbname=Qommunity', 'loicFlament','Cappiie1989', $options);