var app = new Vue({
  el: "#app",
  data: {
    perguntas: [],
    perguntasExibidas: [],
    indice: Math.floor(Math.random() * 29),
    indices: [],
    indiceResposta: 0,
    tempo: 15,
    tempoResposta: 0,
    tempoTotal: 0,
    vidas: 5,
    recorde: 0,
  },
  methods: {
    salvaIndice: function (indice) {
      this.indices.push(indice);
      // verificar se ainda ha perguntas, se nao mostrar tela final
    },
    trocarIndice: function () {
      while (this.indices.includes(this.indice)) {
        this.indice = Math.floor(Math.random() * 29);
      }
      this.salvaIndice(this.indice);
    },
    enviarResposta: function () {
      if (Number(this.indiceResposta) != this.pergunta["opc"]) {
        // evitar usao do '+'
        this.vidas = this.vidas - 1;
      }
      this.trocarIndice();
      this.tempo = 15;
    },
    jogarNovamente: function () {
      this.indiceResposta = 0;
      this.indice = Math.floor(Math.random() * 29);
      this.vidas = 5;
      this.indices = [];
      this.tempo = 15;
    },
    timer: function () {
      setInterval(() => {
        if (this.tempo > 0) {
          return (this.tempo = this.tempo - 1);
        }
      }, 1000);
    },
    checkRecorde: function () {
      let vidas = this.vidas;
      if (vidas >= 0) {
        this.recorde = localStorage.getItem("recorde");
        if (this.indices.length - 1 > this.recorde) {
          this.recorde = this.indices.length;
          localStorage.setItem("recorde", `${this.recorde}`);
        }
      }
    },
  },
  computed: {
    pergunta: function () {
      return this.perguntas[this.indice];
    },
    nivel: function () {
      let nivel = ((this.indices.length / 29) * 100).toFixed(2);
      return nivel;
    },
  },
  mounted: function () {
    this.timer();
    fetch("./db.json").then((resposta) => {
      resposta.json().then((json) => {
        this.perguntas = json;
      });
    });
  },
  watch: {
    tempo: function () {
      if (this.tempo <= 0) {
        this.vidas = this.vidas - 1;
        this.indiceResposta = 0;
      }
    },
    vidas: function () {
      this.checkRecorde();
    },
  },
});
