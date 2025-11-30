<?php include 'header.php'; ?>

<main style="max-width:600px; margin:auto; padding:40px;">
    <h2 style="text-align:center; margin-bottom:30px;">Contact Us</h2>

    <form style="display:flex; flex-direction:column; gap:15px;">
        <input type="text" placeholder="Your Name" style="padding:10px; border-radius:5px; border:1px solid #ccc;">
        <input type="email" placeholder="Your Email" style="padding:10px; border-radius:5px; border:1px solid #ccc;">
        <textarea placeholder="Your Message" style="padding:10px; border-radius:5px; border:1px solid #ccc; min-height:100px;"></textarea>
        <button type="submit" style="padding:10px 20px; border:none; background:#222; color:white; border-radius:5px; font-weight:bold;">Send Message</button>
    </form>
</main>

<?php include 'footer.php'; ?>
