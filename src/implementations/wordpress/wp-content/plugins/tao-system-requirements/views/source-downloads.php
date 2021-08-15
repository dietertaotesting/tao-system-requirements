<ul class="<?=key($data)?>" data-tao-type="system-requirement">
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
