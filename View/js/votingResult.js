var socket = io();
socket.emit("VotingResult", "Result Vote Section");
const username = document.getElementById("username");
const BJPV = document.getElementById("BJP");
const CongressV = document.getElementById("Congress");
const CPIV = document.getElementById("CPI");
const BSPV = document.getElementById("BSP");
const AAPV = document.getElementById("AAP");
const NPPV = document.getElementById("NPP");
let BJP ,Congress,BSP,AAP,CPI,NPP;
socket.on("VotingResult", (data) => {
    BJPV.innerHTML = data.BJP;
    username.innerHTML = data.username;
    CongressV.innerHTML = data.Congress;
    BSPV.innerHTML = data.BSP;
    AAPV.innerHTML = data.AAP;
    NPPV.innerHTML = data.NPP;
    CPIV.innerHTML = data.CPI;
    BJP = Number(data.BJP);
    Congress = Number(data.Congress);
    AAP = Number(data.AAP);
    BSP = Number(data.BSP);
    CPI =Number(data.CPI);
    NPP = Number(data.NPP);

    function closeSidebar() {
        if (sidebarOpen) {
            sidebar.classList.remove('sidebar-responsive');
            sidebarOpen = false;
        }
    }

    // ---------- CHARTS ----------

    // BAR CHART
    const barChartOptions = {
        series: [{
            data: [BJP,Congress,AAP, BSP, CPI,NPP],
            name: 'Votes',
        }, ],
        chart: {
            type: 'bar',
            background: 'transparent',
            height: 350,
            toolbar: {
                show: false,
            },
        },
        colors: ['#f1934a', '#a51d1d', '#ffdc52', '#5df8c9','#fd0169','#3639df'],
        plotOptions: {
            bar: {
                distributed: true,
                borderRadius: 4,
                horizontal: false,
                columnWidth: '40%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            opacity: 1,
        },
        grid: {
            borderColor: '#55596e',
            yaxis: {
                lines: {
                    show: true,
                },
            },
            xaxis: {
                lines: {
                    show: true,
                },
            },
        },
        legend: {
            labels: {
                colors: '#f5f7ff',
            },
            show: true,
            position: 'top',
        },
        stroke: {
            colors: ['transparent'],
            show: true,
            width: 2,
        },
        tooltip: {
            shared: true,
            intersect: false,
            theme: 'dark',
        },
        xaxis: {
            categories: ['BJP', 'Congress', 'AAP', 'BSP', 'CPI','NPP'],
            title: {
                style: {
                    color: '#f5f7ff',
                },
            },
            axisBorder: {
                show: true,
                color: '#55596e',
            },
            axisTicks: {
                show: true,
                color: '#55596e',
            },
            labels: {
                style: {
                    colors: '#f5f7ff',
                },
            },
        },
        yaxis: {
            title: {
                text: 'Vote-Count',
                style: {
                    color: '#f5f7ff',
                },
            },
            axisBorder: {
                color: '#55596e',
                show: true,
            },
            axisTicks: {
                color: '#55596e',
                show: true,
            },
            labels: {
                style: {
                    colors: '#f5f7ff',
                },
            },
        },
    };

    const barChart = new ApexCharts(
        document.querySelector('#bar-chart'),
        barChartOptions
    );
    barChart.render();

    // AREA CHART
    const areaChartOptions = {
        series: [{
            name: 'Voted',
            data: [31, 40, 28, 51, 42, 109, 100],
        },
            {
                name: 'Non Voted',
                data: [11, 32, 45, 32, 34, 52, 41],
            },
        ],
        chart: {
            type: 'area',
            background: 'transparent',
            height: 350,
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        colors: ['#00ab57', '#d50000'],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        dataLabels: {
            enabled: false,
        },
        fill: {
            gradient: {
                opacityFrom: 0.4,
                opacityTo: 0.1,
                shadeIntensity: 1,
                stops: [0, 100],
                type: 'vertical',
            },
            type: 'gradient',
        },
        grid: {
            borderColor: '#55596e',
            yaxis: {
                lines: {
                    show: true,
                },
            },
            xaxis: {
                lines: {
                    show: true,
                },
            },
        },
        legend: {
            labels: {
                colors: '#f5f7ff',
            },
            show: true,
            position: 'top',
        },
        markers: {
            size: 6,
            strokeColors: '#1b2635',
            strokeWidth: 3,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            axisBorder: {
                color: '#55596e',
                show: true,
            },
            axisTicks: {
                color: '#55596e',
                show: true,
            },
            labels: {
                offsetY: 5,
                style: {
                    colors: '#f5f7ff',
                },
            },
        },
        yaxis: [{
            title: {
                text: 'Purchase Orders',
                style: {
                    color: '#f5f7ff',
                },
            },
            labels: {
                style: {
                    colors: ['#f5f7ff'],
                },
            },
        },
            {
                opposite: true,
                title: {
                    text: 'Sales Orders',
                    style: {
                        color: '#f5f7ff',
                    },
                },
                labels: {
                    style: {
                        colors: ['#f5f7ff'],
                    },
                },
            },
        ],
        tooltip: {
            shared: true,
            intersect: false,
            theme: 'dark',
        },
    };

    const areaChart = new ApexCharts(
        document.querySelector('#area-chart'),
        areaChartOptions
    );
    areaChart.render();
});