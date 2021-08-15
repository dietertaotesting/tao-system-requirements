<?php
include ('./browsers.php');
include('./from-source.php');
?>

     <section class="sr-wrapper">
        <h2>Docker Image</h2>
        <p>When you are using TAO as a container image</p>
        <ul class="container">
            <?php foreach((server.virtualized.container) as $part): ?>
            <li class="{{this.key}}">
                <span class="title">{{this.label}}</span>
                <span class="versions">{{this.versions}}</span>
            </li>
            <?php endforeach; ?>
        </ul>
    </section>
     <section class="sr-wrapper">
        <h2>Viewports and Devices</h2>
        <h3>Tests we performed on mobile screens</h3>
        <div class="viewports-devices">
            <?php foreach((viewportDevices) as $part): ?>
            <details open>
                <summary>{{this.env.label}}</summary>
                <table>
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
                        <td>{{this.env.tao.release}} / {{this.env.tao.testRunner}}</td>
                    </tr>
                    {{#if this.env.deviceStr}}
                    <tr>
                        <th>Device</th>
                        <td>{{this.env.deviceStr}}</td>
                    </tr>
                    {{/if}}
                    <tr>
                        <th>Screen</th>
                        <td>{{this.env.screen.width}} × {{this.env.screen.height}} / {{this.env.screen.aspectRatio}} /
                            {{this.env.screen.orientation}}</td>
                    </tr>
                    </tbody>
                </table>
                {{#if this.interactions}}
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
                    <?php foreach((this.interactions) as $part): ?>
                    <tr>
                        <th>{{this.label}}</th>
                        <td>{{this.comment}}</td>
                    </tr>
                    <?php endforeach; ?>
                    {{/if}}
                    </tbody>
                </table>
            </details>
            <?php endforeach; ?>
        </div>
    </section>
</div>