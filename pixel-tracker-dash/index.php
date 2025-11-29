<?php
session_start();

if (!isset($_SESSION['session_id'])) {
    $_SESSION['session_id'] = bin2hex(random_bytes(16));
}
$session_id = $_SESSION['session_id'];

$logFile = __DIR__ . "/pixel_log.txt";
$logs = [];

if (isset($_POST['clear_logs'])) {
    if (file_exists($logFile)) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $newLines = [];
        foreach ($lines as $line) {
            $entry = json_decode($line, true);
            if ($entry && $entry['session_id'] !== $session_id) {
                $newLines[] = $line;
            }
        }
        file_put_contents($logFile, implode(PHP_EOL, $newLines) . PHP_EOL);
    }
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

if (file_exists($logFile)) {
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach (array_reverse($lines) as $line) {
        $entry = json_decode($line, true);
        if ($entry && $entry['session_id'] === $session_id) {
            $logs[] = $entry;
        }
    }
}

?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Tracking Pixel Dashboard</title>
        <style>
            body { 
                font-family: Arial,sans-serif; 
                margin: 40px; 
                background: #f7f7f7; 
            }
            .container { 
                background: white; 
                padding: 25px; 
                border-radius: 10px; 
                max-width: 1200px; 
                margin: auto; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            }
            h1, h2 { 
                color: #333; 
                margin-bottom: 10px; 
            }
            .button-group { 
                display: flex; 
                gap: 10px; 
                flex-wrap: wrap; 
                margin-bottom: 15px; 
            }
            button, input[type=submit] { 
                padding: 6px 12px; 
                border-radius: 5px; 
                border: none; 
                background-color: #222; 
                color: white; 
                cursor: pointer; 
            }
            button:hover, input[type=submit]:hover { 
                background-color: #444; 
            }
            #searchBar { 
                width: 100%; 
                padding: 8px; 
                margin-bottom: 15px; 
                border-radius: 5px; 
                border: 1px solid #ccc; 
            }
            table { 
                border-collapse: collapse; 
                width: 100%; 
            }
            th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
            }
            th { 
                background-color: #222; 
                color: #fff; 
                cursor: pointer; 
                user-select: none; 
            }
            tr:nth-child(even) { 
                background-color: #f2f2f2; 
            }
            tr:hover { 
                background-color: #e1e1e1; 
            }
            pre { 
                background: #f0f0f0; 
                padding: 10px; 
                border-radius: 5px; 
                margin-top: 20px; 
            }
            .sort-indicator { 
                font-size: 12px; 
                margin-left: 5px; 
            }
        </style>
    </head>
    <body>
        <div class="container">
        <h1>Tracking Pixel Dashboard</h1>

        <!-- Buttons -->
        <div class="button-group">
        <form method="post" style="margin:0;">
            <button type="submit" name="clear_logs" onclick="return confirm('Clear your session logs?')">Clear My Logs</button>
        </form>
        <button onclick="location.reload()">Refresh Page</button>
        </div>

        <!-- Pixel URL -->
        <h2>Pixel URL</h2>
        <pre>https://<?=$_SERVER['HTTP_HOST']?>/pixel.php</pre>

        <!-- Recent Log Entries -->
        <h2>Recent Log Entries (Your Session)</h2>
        <input type="text" id="searchBar" placeholder="Type to filter logs dynamically...">

        <table id="logTable">
        <thead>
        <tr>
            <th data-col="time">Time <span class="sort-indicator">^</span></th>
            <th data-col="ip">IP <span class="sort-indicator">^</span></th>
            <th data-col="user_agent">User Agent <span class="sort-indicator">^</span></th>
            <th data-col="referrer">Referrer <span class="sort-indicator">^</span></th>
            <th data-col="page">Page <span class="sort-indicator">^</span></th>
        </tr>
        </thead>
        <tbody>
        <?php if (!empty($logs)): ?>
            <?php foreach ($logs as $log): ?>
            <tr>
                <td><?=htmlspecialchars($log['time'] ?? '')?></td>
                <td><?=htmlspecialchars($log['ip'] ?? '')?></td>
                <td><?=htmlspecialchars($log['user_agent'] ?? '')?></td>
                <td><?=htmlspecialchars($log['referrer'] ?? '')?></td>
                <td><?=htmlspecialchars($log['page'] ?? '')?></td>
            </tr>
            <?php endforeach; ?>
        <?php else: ?>
        <tr><td colspan="5" style="text-align:center;">No logs found for your session. Load the pixel by visiting other pages!</td></tr>
        <?php endif; ?>
        </tbody>
        </table>

        </div>

        <script>
        const searchBar = document.getElementById('searchBar');
        searchBar.addEventListener('input', function() {
            const filter = this.value.toLowerCase();
            const rows = document.querySelectorAll('#logTable tbody tr');
            rows.forEach(row => {
                row.style.display = Array.from(row.cells).some(cell => cell.textContent.toLowerCase().includes(filter)) ? '' : 'none';
            });
        });

        let sortDirections = {};
        const headers = document.querySelectorAll('#logTable th');
        headers.forEach((th, index) => {
            th.addEventListener('click', function() {
                const table = th.closest('table');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => r.style.display !== 'none');
                const colIndex = index;
                const colName = th.dataset.col;
                const currentDir = sortDirections[colName] || 'asc';
                const newDir = currentDir === 'asc' ? 'desc' : 'asc';
                sortDirections[colName] = newDir;

                rows.sort((a, b) => {
                    const aText = a.cells[colIndex].textContent.trim();
                    const bText = b.cells[colIndex].textContent.trim();
                    if (!isNaN(Date.parse(aText)) && !isNaN(Date.parse(bText))) {
                        return newDir === 'asc' ? new Date(aText) - new Date(bText) : new Date(bText) - new Date(aText);
                    }
                    return newDir === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
                });

                rows.forEach(r => tbody.appendChild(r));

                headers.forEach(h => h.querySelector('.sort-indicator').textContent = '^');
                th.querySelector('.sort-indicator').textContent = newDir === 'asc' ? '^' : 'v';
            });
        });
        </script>
    </body>
</html>
