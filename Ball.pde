class Ball{
  float x,y;
  int xspeed,yspeed;
  int direction = 0;
  Spieler spieler;
  
  Ball(String init,Spieler spieler){
    this.spieler = spieler;
    String[] params = init.split(",");
    if (params.length<5) return;
    this.x         = parseFloat(params[0]);
    this.y         = parseFloat(params[1]);
    this.xspeed    = parseInt(params[2]);
    this.yspeed    = parseInt(params[3]);
    this.direction = parseInt(params[4]);
  }
  
  String toString(){
    return "{\"x\":"+this.x+","+
            "\"y\":"+this.y+","+
            "\"xspeed\":"+this.xspeed+","+
            "\"yspeed\":"+this.yspeed+","+
            "\"direction\":"+this.direction+","+
            "\"spieler\":\""+this.spieler.name()+"\""+
           "}";
  }
}
