<template>
  <iframe id="iframe" class="w-full"
  height="500" width="500" :src="
        `/live.html`"
        scrolling="no" scrollbars="no" frameborder="0" 
        style="height: 100%; width: 100%; min-height: 500px; z-index: 100; overflow: hidden;">
    </iframe>
</template>

<style scoped>
    body{
        margin: 0;
    }
</style>