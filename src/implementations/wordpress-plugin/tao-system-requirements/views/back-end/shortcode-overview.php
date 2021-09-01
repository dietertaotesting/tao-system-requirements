<h1>TAO System Requirements and Downloads</h1>
<h2>Short code overview</h2>
<table class="widefat striped" style="max-width: 800px">
    <thead>
    <tr>
        <th>Short code</th>
        <th>Label</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <?php foreach ($data['shortcode-overview'] as $part): ?>
        <tr>
            <td><b>[<?=$part['code']?>]</b></td>
            <td><?=$part['label']?></td>
            <td><?=$part['description']?></td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>