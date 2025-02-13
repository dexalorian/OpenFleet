<!-- <template>
    <v-chart class="chart" :option="option" />
  </template>
  
  <script setup>
  import * as echarts from "echarts";
  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
  } from "echarts/components";
  import VChart, { THEME_KEY } from "vue-echarts";
  import { ref, provide } from "vue";
import { onMounted } from "vue";
  
  use([
    CanvasRenderer,
    TitleComponent,
    TooltipComponent,
    LegendComponent
  ]);
  
  provide(THEME_KEY, "light");

  const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';
const dataCount = 2e2;
const data = generateOHLC(dataCount);
  
  const option = ref({
    animation: false, 
  dataset: {
    source: data
  },
  title: {
    text: 'Data Amount: ' + echarts.format.addCommas(dataCount)
  },
  tooltip: {
    animation: false,
    trigger: 'axis',
    axisPointer: {
      type: 'line'
    }
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: false
      }
    }
  },
  grid: [
    {
      left: '10%',
      right: '10%',
      bottom: 200
    },
    {
      left: '10%',
      right: '10%',
      height: 80,
      bottom: 80
    }
  ],
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      // inverse: true,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
      animation: false
    },
    {
        animation: false,
      type: 'category',
      gridIndex: 1,
      boundaryGap: false,
      axisLine: { onZero: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      min: 'dataMin',
      max: 'dataMax'
    }
  ],
  yAxis: [
    {
      scale: true,
      splitArea: {
        show: true
      }
    },
    {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    }
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0, 1],
      start: 10,
      end: 100
    },
    {
      show: true,
      xAxisIndex: [0, 1],
      type: 'slider',
      bottom: 10,
      start: 10,
      end: 100
    }
  ],
  visualMap: {
    show: false,
    seriesIndex: 1,
    dimension: 6,
    pieces: [
      {
        value: 1,
        color: upColor
      },
      {
        value: -1,
        color: downColor
      }
    ]
  },
  series: [
    {
      type: 'candlestick',
      itemStyle: {
        color: upColor,
        color0: downColor,
        borderColor: upBorderColor,
        borderColor0: downBorderColor
      },
      encode: {
        x: 0,
        y: [1, 4, 3, 2]
      }
    },
    {
      name: 'Volumn',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        color: '#7fbe9e'
      },
      large: true,
      encode: {
        x: 0,
        y: 5
      }
    }
  ]
});

function generateOHLC(count) {
  let data = [];
  let xValue = +new Date(2011, 0, 1);
  let minute = 60 * 1000;
  let baseValue = Math.random() * 12000;
  let boxVals = new Array(4);
  let dayRange = 12;
  for (let i = 0; i < count; i++) {
    baseValue = baseValue + Math.random() * 20 - 10;
    for (let j = 0; j < 4; j++) {
      boxVals[j] = (Math.random() - 0.5) * dayRange + baseValue;
    }
    boxVals.sort();
    let openIdx = Math.round(Math.random() * 3);
    let closeIdx = Math.round(Math.random() * 2);
    if (closeIdx === openIdx) {
      closeIdx++;
    }
    let volumn = boxVals[3] * (1000 + Math.random() * 500);
    // ['open', 'close', 'lowest', 'highest', 'volumn']
    // [1, 4, 3, 2]
    data[i] = [
      echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', (xValue += minute)),
      +boxVals[openIdx].toFixed(2),
      +boxVals[3].toFixed(2),
      +boxVals[0].toFixed(2),
      +boxVals[closeIdx].toFixed(2),
      +volumn.toFixed(0),
      getSign(data, i, +boxVals[openIdx], +boxVals[closeIdx], 4) // sign
    ];
  }
  return data;
  function getSign(data, dataIndex, openVal, closeVal, closeDimIdx) {
    var sign;
    if (openVal > closeVal) {
      sign = -1;
    } else if (openVal < closeVal) {
      sign = 1;
    } else {
      sign =
        dataIndex > 0
          ? // If close === open, compare with close of last record
            data[dataIndex - 1][closeDimIdx] <= closeVal
            ? 1
            : -1
          : // No record of previous, set to be positive
            1;
    }
    return sign;
  }
}

onMounted(  )

  </script>
  
  <style scoped>
  .chart {
    height: 400px;
  }
  </style> -->

  <template>

        <div>
            
            <div class="flex flex-col w-96">Рынок логистических облигаций
                <Button variant="">Пополнить счет</Button>
                <p class="text-xs"> Фьючерс - превращается в обязательство владельца воспользоваться услугами 
                    логистической компании/ип которая выпустила фьючерс 
                    и в обязательство выпустившей компании такие услуги предоставить. Фьючерс это облегация?  </p>
                    <p>Рейтинги перевозчиков:</p>
                    <p>AAA</p>
                    <p>BBB</p>
                    <p>CCC</p>

                    <p>Биржа не занимается логистикой. Она только фиксирует, кто кому должен поставить товар.</p>
            </div>
            <div class="flex w-full h-96 border" ref="chartEl"></div>
            <div class="flext w-96">
                <div>На счету 2440 кубокилометра</div>
                <Input></Input>

                <div>Кол-во облигаций</div>
                <Input type=""></Input>
                <div>Начальная стоимость кубокилометра, RUB</div>
                <Input type=""></Input>
                <Button>Отправить заявку на выпуск облигаций</Button>
                <div>Общая стоимость пакета 384773 руб</div>


            </div>
        </div>

  </template>

<script setup lang="ts">

import * as echarts from 'echarts';
import { onMounted } from 'vue';
import { ref } from 'vue'
import Input from './components/ui/input/Input.vue';
import Button from './components/ui/button/Button.vue';

/** @type EChartsOption */
const option = {
    animation: false,
    title: { text: 'Фьючерс "Кубокилометр на март-2028. Мос. Обл"' },
    tooltip: { trigger: 'axis', transitionDuration: 0  },
    xAxis: {
        type: 'time',
        minInterval: 3600 * 1000,
        boundaryGap: false,
        splitNumber: 24,
        min: new Date('2023-01-01 00:00').getTime(),
        max: new Date('2023-01-04 23:59').getTime(), // One full day
        axisLabel: {
          formatter: '{HH}:00',
        },
    },
    yAxis: { type: 'value' },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
            type: 'slider', // Adds a draggable zoom bar
            show: true
        }
    ],
    series: [{
        animation: false,
        type: 'candlestick',
        barWidth: 5,  // Adjust candlestick width (default is auto)
            barMinWidth: 3, // Minimum width to prevent them from being too small
            barMaxWidth: 10,
        data: [
        [new Date('2023-01-01T09:00').getTime(), 120, 130, 135, 115],
                [new Date('2023-01-01T10:00').getTime(), 130, 125, 132, 120],
                [new Date('2023-01-01T11:00').getTime(), 125, 135, 140, 120],
                [new Date('2023-01-01T12:00').getTime(), 120, 130, 135, 115],
                [new Date('2023-01-01T13:00').getTime(), 130, 125, 132, 120],
                [new Date('2023-01-01T14:00').getTime(), 125, 135, 140, 120]
        ]
    }]
};

const chartEl = ref(null)

onMounted(() => {

    const chart = echarts.init( chartEl.value )
    chart.setOption(option);
    // chart.setOption(option, { notMerge: true, lazyUpdate: true });

})





</script>