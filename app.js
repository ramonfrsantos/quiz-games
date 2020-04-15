var app = new Vue({
  el: "#app",
  data: {
    perguntas: [],
    perguntasExibidas: [],
    indice: Math.floor(Math.random() * 29),
    indices: [],
    indiceResposta: 0,
    totalEstrelas: 0,
    tempo: 0,
    tempoBase: 0,
    vidas: 5,
    recorde: 0,
  },
  methods: {
    salvaIndice: function (indice) {
      this.indices.push(indice);
      // verificar se ainda ha perguntas, se nao mostrar tela final
    },
    trocarIndice: function () {
      this.salvaIndice(this.indice);
      while (this.indices.includes(this.indice)) {
        this.indice = Math.floor(Math.random() * 29);
      }
    },
    enviarResposta: function () {
      if (Number(this.indiceResposta) != this.pergunta["opc"]) {
        // evitar usao do '+'
        this.vidas = this.vidas - 1;
      }
      this.trocarIndice();
      this.totalEstrelas += this.estrelas;
    },
    pularPergunta: function () {
      this.trocarIndice();
    },
    jogarNovamente: function () {
      this.indiceResposta = 0;
      this.indice = Math.floor(Math.random() * 29);
      this.vidas = 5;
      this.indices = [];
    },
    timer: function () {
      // usar clearInterval ao inves do if
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
    estrelas: function () {
      let estrelas = 0;
      if (this.tempo / this.tempoBase >= 0.66) {
        estrelas = 3;
      } else if (this.tempo / this.tempoBase >= 0.33) {
        estrelas = 2;
      } else if (this.tempo / this.tempoBase > 0) {
        estrelas = 1;
      }
      return estrelas;
    },
    pergunta: function () {
      let pergunta = {
        pergunta: "Carregando perguntas, por favor aguarde!",
        op1: "Carregando",
        op2: "Carregando",
        op3: "Carregando",
        opc: 0,
      };

      this.perguntas.length > 0 && [(pergunta = this.perguntas[this.indice])];
      switch (pergunta["dificuldade"]) {
        case 1:
          this.tempo = 10;
          this.tempoBase = 10;
          break;
        case 2:
          this.tempo = 15;
          this.tempoBase = 15;
          break;
        case 3:
          this.tempo = 20;
          this.tempoBase = 20;
          break;
        default:
          this.tempo = 15;
          this.tempoBase = 15;
          break;
      }

      return pergunta;
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
Vue.config.productionTip = false;
