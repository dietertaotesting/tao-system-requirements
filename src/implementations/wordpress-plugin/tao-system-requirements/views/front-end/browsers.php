<ul class="<?=key($data)?> tao-system-requirements">
    <?php foreach ($data['browsers'] as $part): ?>

        <li class="<?= $part['key'] ?>">
            <span class="icon"></span>
            <div class="title"><?= $part['label'] ?></div>
            <span class="versions"><?= $part['versionStr'] ?></span>
        </li>

    <?php endforeach; ?>
</ul>
