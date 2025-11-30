<?php include 'header.php'; ?>

<?php
$item = $_GET['item'] ?? 'unknown';
$productName = ucfirst($item);
?>

<main style="max-width:1200px; margin:auto; padding:20px; text-align:center;">
    <h2><?=htmlspecialchars($productName)?></h2>
    <p>Details about the <?=htmlspecialchars($productName)?> go here. This is a demo product.</p>
    <p>Price: <strong>$<?=rand(10,100)?></strong></p>

    <a href="index.php" style="padding:10px 20px; background:#222; color:white; border-radius:5px; text-decoration:none;">Back to Home</a>
</main>

<img src="https://pixel-track-1.com/pixel.php?page=product_<?=urlencode($item)?>" width="1" height="1" style="display:none;">

<?php include 'footer.php'; ?>
