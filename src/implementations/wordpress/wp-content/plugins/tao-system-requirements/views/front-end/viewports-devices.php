    <div class="<?=key($data)?> tao-system-requirements">
        <?php foreach($data['viewports-devices'] as $part): ?>
        <details open>
            <summary><?=$part['env']['label']?></summary>
            <table class="widefat striped">
                <colgroup>
                    <col class="th">
                    <col>
                </colgroup>
                <thead>
                <tr>
                    <th colspan="2">Environment</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>TAO</th>
                    <td><?=$part['env']['tao']['release']?> / <?=$part['env']['tao']['testRunner']?></td>
                </tr>
                <?php if($part['env']['deviceStr']): ?>
                <tr>
                    <th>Device</th>
                    <td><?=$part['env']['deviceStr']?>></td>
                </tr>
                <?php endif ?>
                <tr>
                    <th>Screen</th>
                    <td><?=$part['env']['screen']['width']?> × <?=$part['env']['screen']['height']?> / <?=$part['env']['screen']['aspectRatio']?> /
                        <?=$part['env']['screen']['orientation']?></td>
                </tr>
                </tbody>
            </table>
            <?php if($part['interactions']): ?>
            <table>
                <colgroup>
                    <col class="th">
                    <col>
                </colgroup>
                <thead>
                <tr>
                    <th colspan="2">Comments</th>
                </tr>
                </thead>
                <tbody>
                <?php foreach($part['interactions'] as $interaction): ?>
                <tr>
                    <th><?=$interaction['label']?></th>
                    <td><?=$interaction['comment']?></td>
                </tr>
                <?php endforeach; ?>
                <?php endif ?>
                </tbody>
            </table>
        </details>
        <?php endforeach; ?>
    </div>