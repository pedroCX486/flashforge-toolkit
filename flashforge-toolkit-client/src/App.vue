<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getPrinterData } from './shared/printerdata.service';

import flashForgeLogo from './assets/flashforge.webp';

const connectionStatus = ref('');
const printerStatus = ref('');
const printProgress = ref(0);
const extruderTemperature = ref('');
const printerAddress = ref('');

const isStreaming = ref(true);

onMounted(() => {
  getPrinterData().then(res => {
    connectionStatus.value = res.printerConnection;
    printerStatus.value = res.printerStatus;
    printProgress.value = res.printProgress;
    extruderTemperature.value = res.extruderTemperature;
    printerAddress.value = res.printerAddress;
  }).catch(() => {
    connectionStatus.value = 'Monitor API offline. (No Response)';
  });

  setInterval(() => {
    getPrinterData();
  }, 10 * 1000);
});
</script>

<template>
  <div class="logo">
    <img :src="flashForgeLogo" />

    <br />
    <p class="subtitle">Flashforge Web Monitor</p>
  </div>

  <div class="wrapper">
    <div class="stream-side" v-if="!!printerStatus">
      <img v-if="isStreaming" alt="Camera Stream" class="camera-stream"
        :src="'http://' + printerAddress + ':8080/?action=stream'" @error="isStreaming = true"/>
    </div>

    <div class="info-side">
      <p>Connection Status: {{ connectionStatus }}</p>

      <div v-if="!!printerStatus">
        <p>Printer Status: {{ printerStatus }}</p>
        <p>Extruder Temperature: {{ extruderTemperature }}</p>
        <div class="print-progress" v-if="!!printProgress">
          <p>Print Progress: {{ printProgress / 10 }}%</p>
          <progress max="1000" :value="printProgress" class="progress"></progress>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo {
  text-align: center;
  padding-bottom: 2rem;

  img {
    width: 40%;
  }

  .subtitle {
    margin-top: -5%;
  }
}

.wrapper {
  display: flex;
  background-color: rgb(57, 57, 57);
  border-radius: 5px;

  .stream-side {
    width: 50vw;
    border-right: 1px solid rgb(93, 93, 93);
    background-image: url('assets/no_cam.png');
    background-size: 3rem;
    background-repeat: no-repeat;
    background-position: center;

    .camera-stream {
      width: -webkit-fill-available;
      padding: 1rem;
    }
  }

  .info-side {
    width: -webkit-fill-available;
    padding: 1rem;

    .print-progress>p {
      margin: 0;
      padding: 0;
    }

    .print-progress>progress {
      width: -webkit-fill-available;
    }
  }
}

@media (hover: none) and (pointer: coarse) {
  .logo {
    img {
      width: 100%;
    }

    .subtitle {
      margin-top: -10%;
    }
  }

  .wrapper {
    flex-direction: column;

    .stream-side {
      min-height: 8rem;
      max-width: unset;
      width: -webkit-fill-available;
      border-bottom: 1px solid rgb(93, 93, 93);
    }
  }
}
</style>
