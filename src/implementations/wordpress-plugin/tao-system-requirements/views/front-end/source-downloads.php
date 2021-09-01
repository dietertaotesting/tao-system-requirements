<ul class="<?=key($data)?> tao-system-requirements">
    <?php foreach($data['source-downloads']['archives'] as $part): ?>
        <li>
            <a class="title" href="<?=$part['access']?>"><?=$part['label']?></a>
        </li>
    <?php endforeach; ?>
    <?php foreach($data['source-downloads']['vcs'] as $part): ?>
        <li>
            <a class="title" href="<?=$part['access']?>"><?=$part['label']?></a>
        </li>
    <?php endforeach; ?>
</ul>
