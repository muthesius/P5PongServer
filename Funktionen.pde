
float speed   = 1;
float ball_pos = 0.0;


void updateBall(String msg) {
  ball_pos = (ball_pos + speed);
  
  int global_ball_pos = (int)ball_pos;
  
  float local_ball_pos = ball_pos - global_ball_pos;
  global_ball_pos = mannschaft.size()!=0 ? global_ball_pos % mannschaft.size() : 0;
  ball_pos = global_ball_pos + local_ball_pos;

  if (mannschaft.size()==0) return;
  
  Spieler s = mannschaft.get(global_ball_pos);
  
  
  String ball_paket = msg.substring(msg.indexOf("!")+1);
  ball = new Ball(ball_paket,s);
  
  println("Ball: "+ball);
  
  if (ball==null) return;
  s.send("go!"+ball);
}


/****** SERVER *****/

void killConnections(){
  socket.broadcast("CLOSE");
  mannschaft.clear();
}


String getHostname(WebSocketConnection conn) {
  InetSocketAddress addr = (InetSocketAddress) conn.httpRequest().remoteAddress();
  String name = addr.hashCode()+"";
  println(name);
  return name;
}


int zaehler = 0;
void addSpieler( WebSocketConnection conn ) {
  if(!spielerIDVorhanden(getHostname(conn))) {
    Spieler ns = new Spieler(conn, "spieler-"+zaehler);
    mannschaft.add(ns);
    zaehler++;
    spielerJoined(ns);
  } else {
    println("spieler schon vorhanden");
  }
  println(mannschaft);
}


boolean spielerIDVorhanden(String id){
  for (Spieler is : mannschaft){
    if ( id.equals(is.id()) ) return true;
  }
  return false;
}


void entferneSpielerMitConnection(WebSocketConnection con)
{
  Spieler s = findeSpielerMitConnection(con);
  removeSpielerFromList(s);
}


Spieler findeSpielerMitConnection(WebSocketConnection con)
{
  for (Spieler s : mannschaft) {
    if ( getHostname(con).equals(s.id()) ) return s;
  }
  return null;
}

void removeSpielerFromList(Spieler s)
{
  mannschaft.remove(s);
}



