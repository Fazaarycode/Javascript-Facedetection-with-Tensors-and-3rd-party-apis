<template>
  <div id="app">
    <InputFormValues />
  </div>
</template>

<script>
import InputFormValues from './components/InputFormValues.vue'

export default {
  name: 'App',
  components: {
    InputFormValues
  }
}
</script>

<style>
#app {
  text-align: center;
  background: yellow;
}
</style>
