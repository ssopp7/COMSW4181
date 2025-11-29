<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Demo Shop</title>
<style>
    body { margin:0; font-family: Arial, sans-serif; background:#f9f9f9; }
    header { background:#222; color:white; padding:20px 0; text-align:center; position:sticky; top:0; z-index:1000; }
    header h1 { margin:0; font-size:2em; }
    nav { margin-top:10px; }
    nav a {
        color:white; margin:0 15px; text-decoration:none; font-weight:bold; font-size:1.1em;
        transition:0.2s;
    }
    nav a:hover { color:#f0c040; }
</style>
</head>
<body>

<header>
    <h1>My Demo Shop</h1>
    <nav>
        <a href="index.php">Home</a>
        <a href="products.php">Products</a>
        <a href="about.php">About</a>
        <a href="contact.php">Contact</a>
    </nav>
</header>

<img src="https://pixel-track-1.42web.io/pixel.php?page=<?= urlencode(ltrim($_SERVER['REQUEST_URI'], '/')) ?>" style="display:none;" />
