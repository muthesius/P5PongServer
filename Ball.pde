class Ball{
  float y       = 0.5;
  float yspeed  = 0;
  int direction = 1;
  
  Spieler spieler;
  
  Ball(String init,Spieler spieler){
    this.spieler = spieler;
    String[] params = init.split(",");
    if (params.length<3) return;
    this.y            = parseFloat(params[0]);
    this.yspeed       = parseFloat(params[1]);
    this.direction    = parseInt  (params[2]);
  }
  
  int side(){return this.direction;}
  
  String toString(){
    return "{\"y\":"+this.y+","+
            "\"yspeed\":"+this.yspeed+","+
            "\"direction\":"+this.direction+","+
            "\"spieler\":\""+this.spieler.name()+"\""+
           "}";
  }
}

