<ul class="<?=key($data)?>">
    <?php foreach($data['virtualized']['hosts'] as $part): ?>
        <li>
            <a class="title" href="<?=$part['access']?>"><?=$part['label']?></a>
        </li>
    <?php endforeach; ?>
    <?php foreach($data['virtualized']['containers'] as $part): ?>
        <li>
            <div><?=$part['label']?></div>
            <pre><?=$part['access']?></pre>
        </li>
    <?php endforeach; ?>
</ul>

