<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<base href="/wordpress-angular-plugin/">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<title><?php echo $page_title; ?></title>
	<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,700|Roboto+Condensed:400,700" async>
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" async>
	<link href="<?php echo $main_css; ?>" type="text/css" rel="stylesheet" media="screen" />
</head>
<body ng-app="mainApp" ng-cloak>

<nav class="navbar navbar-inverse navbar-toggleable-md bg-inverse" role="navigation">
	<a class="navbar-brand mr-auto" ui-sref="home">
		<img src="https://angularjs.org/img/angularjs-for-header-only.svg" height="40" alt="Angular.js">
	</a>

	<ul class="nav navbar-nav my-2">
		<li class="nav-item" ui-sref-active="active"><a class="nav-link" ui-sref="home">Home</a></li>
        <li class="nav-item" ui-sref-active="active"><a class="nav-link" ui-sref="weather">Weather</a></li>
	</ul><!--// end .navbar-nav -->
</nav>

<main class="page-main my-5">
	<div class="container">
		<ui-view />
	</div>
</main>

<script>
window.WP = {
	plugin_url: "<?php echo $plugin_url; ?>"
}
</script>
<script type="text/javascript" src="<?php echo $main_js; ?>" async></script>

<script>
(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='//www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-1979028-1');ga('send','pageview');
</script>
</body>
</html>