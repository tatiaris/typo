<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Typo</title>
        <link rel="stylesheet" href="./style.css">
        <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.js"></script>
        <script src="./functions.js"></script>
    </head>
    <body>
        <div class="full-width-container flex-center">
            <div onselectstart="return false" class="passage-container" id="passage-container">
                <span class="pchar"></span>
            </div>
        </div>
        <div class="full-width-container flex-center" style="height: 8%;">
            <div class="input-container flex-center">
                <input disabled oninput="check_input()" class="input" type="text" id="inp" placeholder="press 'enter' to start">
            </div>
        </div>
        <div onselectstart="return false" class="full-width-container flex-center">
            <div class="all-stats-container">
                <div class="title-container">
                    <span class="title">current passage stats</span>
                </div>
                <div class="stat-container flex-center">
                    <div class="stat-type">speed:</div>
                    <div class="stat-data" id="wpm"></div>
                </div>
                <div class="stat-container flex-center">
                    <div class="stat-type">accuracy:</div>
                    <div class="stat-data" id="accuracy"></div>
                </div>
                <div class="stat-container flex-center">
                    <div class="stat-type">time:</div>
                    <div class="stat-data" id="timer"></div>
                </div>
            </div>
            <div class="all-stats-container">
                <div class="title-container">
                    <span class="title">overall stats</span>
                </div>
                <div class="stat-container flex-center">
                    <div class="stat-type">average speed:</div>
                    <div class="stat-data" id="avg_wpm"></div>
                </div>
                <div class="stat-container flex-center">
                    <div class="stat-type">average accuracy:</div>
                    <div class="stat-data" id="avg_acc"></div>
                </div>
                <div class="stat-container flex-center">
                    <div class="stat-type">standard deviation:</div>
                    <div class="stat-data" id="std"></div>
                </div>
            </div>

        </div>
        <div class="full-width-container flex-center">
            <div class="chart-container">
                <canvas id="myChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="mistakes_chart"></canvas>
            </div>
        </div>
    </body>
</html>
