<?php
require('bdd.php');
?>
<!doctype html>
<html lang="fr">
<head>
	<title>Memory</title>
	<meta charset="utf-8" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
	
	<meta name="language" content="fr" />
	
	<link href="dist/css/style.css" rel="stylesheet" />
	<link href="https://fonts.googleapis.com/css?family=Nunito:300,400,600&display=swap" rel="stylesheet">
	<script src="dist/js/app.js" defer></script>
	
	<link rel="shortcut icon" type="image/png" href="dist/images/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="dist/images/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="dist/images/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="dist/images/favicon-16x16.png" />
</head>
<body>

<header>
	<img src="dist/images/logo.svg" alt="Logo Memory"/>
	<h1>Memory</h1>
</header>

<div id="intro">
	<div class="text-center">
		<h2>Meilleurs scores</h2>
		<ul class="results">
			<?php
			$query = $bdd->prepare("SELECT * FROM scores ORDER BY total DESC LIMIT 0,10")or die(print_r($query->errorInfo()));


			$query -> execute();
			$query->setFetchMode(PDO::FETCH_OBJ); 
			
			while($donnees = $query->fetch())
			{
				echo '<li>
					1. <strong>'.$donnees->total.' point'.($donnees->total > 1 ? 's' : '').'</strong> en '.floor($donnees->duree/60/1000).' minute(s) 
					'.(($donnees->duree/1000 - floor($donnees->duree/60/1000)*60)).'
					sec</li>';

			}
			?>
			
		</ul>	
		<button>C'est parti !<span></span></button>
	</div>
</div>


<div id="memory"></div>

</body>
</html>