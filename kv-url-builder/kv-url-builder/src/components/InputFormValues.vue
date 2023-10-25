<template>
  <div class="hello">
    <h1>{{ instructionMessage }}</h1>
    <div class="formElements">
      <input v-model="database" placeholder="database" />
      <select v-model="selected" placeholder="connection type">
        <option disabled value="">SID or Service Name</option>
        <option>sid</option>
        <option>servicename</option>
      </select>
      <input v-model="host" placeholder="host" />
      <input v-model="port" placeholder="port" />
      <input v-model="userName" placeholder="userName" />
      <input v-model="password" placeholder="password" />
      <input
        v-model="serviceElementName"
        placeholder="Value of sID/ ServiceName"
      />
    </div>
    <div class="generateUrl">
      <button v-on:click="generateUrl()">Generate Connection String</button>
    </div>

    <div class="generatedUrl">
      <p class="finalConnectionString" v-if="finalString !== ''">
        {{ finalString }}
      </p>
      <p class="copyToClipBoard" v-on:click="copyToClipBoard()">📋</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputFormValues",
  data() {
    return {
      instructionMessage: "Enter your field values",
      host: "",
      database: "",
      password: "",
      userName: "",
      port: "",
      selected: "",
      serviceElementName: "",
      finalString: "",
    };
  },
  methods: {
    generateUrl: function generateUrl() {
      this.finalString = `database=${this.database};user=${this.userName}&password=${this.password};${this.selected}=${this.serviceElementName};host=${this.host};port=${this.port};end`;
    },
    copyToClipBoard: function copyToClipBoard() {
      const elem = document.createElement("textarea");
      elem.value = this.finalString;
      document.body.appendChild(elem);
      elem.select();
      document.execCommand("copy");
      document.body.removeChild(elem);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  font-family: 'Noto Sans TC', sans-serif;
}
.formElements {
  display: flex;
  justify-content: center;
  padding: 30px;
  flex-direction: column;
}

.formElements > * {
  margin: 10px;
}

input,
select {
  height: 60px;
  font-size: 35px;
}

.generatedUrl {
  display: flex;
  justify-content: center;
}
.generateUrl > button {
  height: 50px;
  border: none;
  background: brown;
  font-size: 25px;
  color: white;

}

.generateUrl > button:hover {
  border-bottom: 12px solid orange;
}

.finalConnectionString {
  font-size: 35px;
}
.copyToClipBoard {
  font-size: 50px;
  margin-left: 20px;
  cursor: pointer;
  bottom: 20px;
  position: relative;
}
</style>
