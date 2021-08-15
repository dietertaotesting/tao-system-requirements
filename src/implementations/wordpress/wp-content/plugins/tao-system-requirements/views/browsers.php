<ul class="<?=key($data)?>" data-tao-type="system-requirement">
    <?php foreach ($data['browsers'] as $part): ?>

        <li>
            <span class="icon"></span>
            <div class="title"><?= $part['label'] ?></div>
            <span class="versions"><?= $part['versionStr'] ?></span>
        </li>

    <?php endforeach; ?>
</ul>
