<?php include 'header.php'; ?>

<main style="max-width:1200px; margin:auto; padding:30px;">
<h2 style="text-align:center; margin-bottom:30px;">Our Products</h2>

<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:20px;">

<?php
$products = [
    ['name'=>'Running Shoes','image'=>'https://upload.wikimedia.org/wikipedia/commons/a/a6/Altra_trail_running_shoe%2C_Lone_Peak%2C_side_view.jpg','id'=>'shoes'],
    ['name'=>'Graphic T-Shirt','image'=>'https://upload.wikimedia.org/wikipedia/commons/5/5e/WMDE-Give-Aways_T-Shirt_mit_Wikipedia-Logo.jpg','id'=>'tshirt'],
    ['name'=>'Travel Backpack','image'=>'https://upload.wikimedia.org/wikipedia/commons/d/d5/Isla_Decepci%C3%B3n_%282012%29.jpg', 'id'=>'backpack'],
];
foreach($products as $prod):
?>
<div style="background:white; width:300px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.1); padding:15px; display:flex; flex-direction:column; justify-content:space-between; text-align:center; transition: transform 0.2s;">
    <div style="height:200px; overflow:hidden; margin-bottom:10px;">
        <img src="<?=$prod['image']?>" alt="<?=$prod['name']?>" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
    </div>
    <div>
        <h3><?=$prod['name']?></h3>
        <a href="product.php?item=<?=$prod['id']?>&utm_source=demo&utm_medium=link&utm_campaign=summer_sale" 
           style="text-decoration:none; background:#222; color:white; padding:8px 15px; border-radius:5px;">View Product</a>
    </div>
</div>
<?php endforeach; ?>

</div>
</main>

<?php include 'footer.php'; ?>
