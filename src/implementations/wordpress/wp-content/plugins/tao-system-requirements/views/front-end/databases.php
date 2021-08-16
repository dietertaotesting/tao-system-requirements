<ul class="<?=key($data)?> tao-system-requirements">
    <?php foreach($data['databases'] as $part): ?>
        <li>
            <span class="title"><?=$part['label']?></span>
            <span class="versions"><?=$part['versionStr']?></span>
        </li>
    <?php endforeach; ?>
</ul>
