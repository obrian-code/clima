Vue.component('custom-input',{
  props:{'code404':Boolean},
  data:()=>({
    search:'',
    hidden_msg:false
  }),
  template: `
  
  <div class="from_container">
  <span>
    <i class="fas fa-search"></i>
    <input type="text" placeholder="Buscar una ciudad ... " v-model="search"  @keyup.enter="buscame">
  </span>

  <span  :class="{hidden_msg}" class="msg">Busque una ciudad válida 😩</span>

</div>
  `,
  methods:{
    buscame(){
      this.$emit('send',this.search)
      this.search=""
    }
  }, 
 watch: {

        code404: function () {
                    if (this.code404==true) {
                      this.hidden_msg=true
              
                    }else{
                      this.hidden_msg=false
                    }

        }
    }
})

Vue.component('custom-data',{

  props: {'buscar':String},
  data(){
    return{

      name:'',
      country:'',
      temp:'',
      description:'',
      icon:'',
      humidity:'',
      temp_max:'',
      temp_min:'',
      url:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/',
      days:['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
      day:'',
      time:'',
      code_404:false
    }
  },
          template:`

          <div class="container_date_left">
          <div class="icon">
            <img :src="icon" alt="" srcset="">
            <span>{{description}}</span>
            </div>
            <div class="datos_temp_fech">
              <span class="temp">{{temp}} <sup>° C</sup></span>
              <span class="fech">{{day}}, {{time}}</span>
              </div>
              <div class="conten_img_country">
                <div class="img_country">
                  <span class="country_name">{{name}}, {{country}}</span>
                </div>
              
            </div>
        </div>
          `,
        
          methods:{
            search(){
              axios.get('https://api.openweathermap.org/data/2.5/weather?q='+this.buscar
                        +'&appid=f8ec163645e180f634459ba5aaadf9dd&units=metric&lang=es')
              .then(response=>{

                this.name=response.data.name
                this.country=response.data.sys.country
                this.temp=Math.round(response.data.main.temp)
                this.description=response.data.weather[0]["description"]
                this.icon=this.url+response.data.weather[0]["icon"]+".svg"
                this.humidity=response.data.main.humidity
                this.temp_max=Math.round(response.data.main.temp_max)
                this.temp_min=Math.round(response.data.main.temp_min)

                this.$emit('send',[
                {title:'Temp Maxima',value: Math.round(response.data.main.temp_max)+"°"},
                {title:'Temp Minima', value: Math.round(response.data.main.temp_min)+"°"},
                {title:'Se siente', value: Math.round(response.data.main.feels_like)+'°'},
                {title:'Humedad', value:response.data.main.humidity},
                {title:'Presión', value:response.data.main.pressure},
                {title:'Nivel del suelo', value:response.data.main.grnd_level},
                {title:'Ráfaga', value:response.data.wind.gust},
                {title:'Velocidad',value:response.data.wind.speed}])

                this.$emit("coord",(response.data.coord))
                this.$emit("code404",(this.code_404=false))
                }).catch(error=> {
                  if (error=="Error: Request failed with status code 404") {
                  
                    this.$emit("code404",(this.code_404=true))
                    console.log(" 😭 "+error)
                  }

                 
                })
            },

            printDate: function () {
              return new Date().getDay()
            },

            printHours:function(){
              return new Date().getHours()
            },

            printMinutes:function(){
              
              if (new Date().getMinutes()<10) {
           
                return 0+""+(new Date().getMinutes())
              }else{
                return new Date().getMinutes()
              }
              
            }
          }    
          ,
          watch: {

            buscar: function () {
              this.search()
            }

          },
          mounted(){
            this.search()
            this.day=this.days[this.printDate()]
            const self = this
            setInterval(function() {self.time=self.printHours()+":"+self.printMinutes()}, 2000)

          },
          
})

Vue.component('custom-prediction',{
  
  template:` 
  
  <div class="conten_today">
  
                <div class="card_today" v-for=" dato in info">
                    <div class="tooltip">

                      <span class="tooltip-content">{{dato.description}}</span>
                        <span class="card_today_title">{{dato.days}}</span>

                        <span class="card_today_img">
                           <img :src="url+dato.icon+svg" alt="" srcset="">
                        </span>

                          <span class="temp_cont">
                            <span class="temp_max">{{dato.max}}</span>
                            <span class="temp_min">{{dato.min}}</span>
                          </span>

                      </div>
              </div>

</div>
    `,

  props: {'buscar':String,'code404':Boolean},
  data:() => ({
    dato:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],
    value:'',
    info:[],
    url:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/',
    svg:'.svg',
    band:false
  }), 

  methods:{
    search(){

      axios.get('https://api.openweathermap.org/data/2.5/forecast?q='+
                this.buscar+'&appid=87e4f01705095dec0164761d3cb63252&units=metric&lang=es')
      .then(response=>{
                  this.info=[
                            {icon:(response.data.list[2].weather[0]["icon"]),
                            days:this.dato[new Date((response.data.list[2].dt_txt).slice(0, 10)).getDay()],
                            max:Math.round(response.data.list[2].main.temp_max),
                            min:Math.round(response.data.list[4].main.temp_min),
                            description:response.data.list[2].weather[0]["description"]},

                            {icon:(response.data.list[11].weather[0]["icon"]),
                            days:this.dato[new Date((response.data.list[11].dt_txt).slice(0, 10)).getDay()],
                            max:Math.round(response.data.list[11].main.temp_max),
                            min:Math.round(response.data.list[12].main.temp_min),
                            description:response.data.list[11].weather[0]["description"]},

                            {icon:(response.data.list[18].weather[0]["icon"]),
                            days:this.dato[new Date((response.data.list[18].dt_txt).slice(0, 10)).getDay()],
                            max:Math.round(response.data.list[18].main.temp_max),
                            min:Math.round(response.data.list[19].main.temp_min),
                            description:response.data.list[18].weather[0]["description"]},

                            {icon:(response.data.list[28].weather[0]["icon"]),
                            days:this.dato[new Date((response.data.list[28].dt_txt).slice(0, 10)).getDay()],
                            max:Math.round(response.data.list[28].main.temp_max),
                            min:Math.round(response.data.list[29].main.temp_min),
                            description:response.data.list[28].weather[0]["description"]},

                            {icon:(response.data.list[39].weather[0]["icon"]),
                            days:this.dato[new Date((response.data.list[39].dt_txt).slice(0, 10)).getDay()],
                            max:Math.round(response.data.list[39].main.temp_max),
                            min:Math.round(response.data.list[38].main.temp_min),
                            description:response.data.list[39].weather[0]["description"]}
                        ]

                          }).catch(error=> {
                            console.log(" 😭 "+error);
                      })

    }
  }    
  ,
  watch: {

    buscar: function () {
      this.search()
    }
  },
  mounted(){
    this.search()
  },
 
})

Vue.component('custom-data-highlight',{
  
  props:{'dato':Array},
  data:()=>({
    search:''
  }),
  template: `
 
  <div class="car_highligths">
        <span class="card_highligths_title">{{dato.title}}</span>
        <span class="card_highligths_value" v-if="dato.value!=null"> 
              {{dato.value}}
        </span>
        <span class="card_highligths_value" v-else>-</span>
  </div>

  `,
  methods:{
    buscame(){
      this.$emit('send',this.search)
      this.search=""
    },
    percent: function(value) {
      const { amount, max } = value;
      
      return Math.floor(amount/max * 100);
    }
  }
      
})


const app= new Vue({
  el:"#app",

  data(){
    return{
      datos:[],
      buscar:'kiev',
      code404:false,
      active:true,
      load:628,
      uvi:0,
      dew_point:0,
      window:{
        width:0,
        height:0
      },
      isactive:true
    }
  },

  created() {
    window.addEventListener("resize", this.handleResize);
        this.handleResize();
  },

  methods:{

    search(datos){
      this.buscar=datos
    },

    sendData(datos){
      this.datos=datos
    },

    code_404(dato){
      this.code404=dato
    },

    coord(dato){
 
      axios.get('https://api.openweathermap.org/data/2.5/onecall?lat='+
                (dato.lat)+'&lon='+(dato.lon)+'&appid=8d17470ec58936ead27ba55d1f752a06')
              .then(response=>{
    
            this.uvi=Math.round(response.data.current.uvi)
            this.dew_point=Math.round(response.data.current.dew_point)
         
                }).catch(error=> {
                  

                 
                })
    },

    toggle(){

      if (this.active==false) {
        this.active=true
      }else{
        this.active=false
      }

    },

    progresesBar(value){
        return  this.load=628 - ((value/100) * 628)   
    },

    handleResize() {

        this.window.width = window.innerWidth
        this.window.height = window.innerHeight
        
        if(this.window.width<700){
              this.isactive=true
        }else{
              this.isactive=false
        }

    }

  },
  

})
