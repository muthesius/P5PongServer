

void broadcastPositions() {
}


float speed   = 1;
float ball_pos = 0.0;

void updateBall() {
  ball_pos = (ball_pos + speed);
  
  int global_ball_pos = (int)ball_pos;
  
  float local_ball_pos = ball_pos - global_ball_pos;
  global_ball_pos = spieler.size()!=0 ? global_ball_pos % spieler.size() : 0;
  ball_pos = global_ball_pos + local_ball_pos;

  if (spieler.size()==0) return;
  
  Spieler s = spieler.get(global_ball_pos);
  
  s.send("go!");//{ \"x\":"+local_ball_pos+",\"y\":"+0.5+"}");

  
}


/****** SERVER *****/

void killConnections(){
  socket.broadcast("CLOSE");
  spieler.clear();
}


String getHostname(WebSocketConnection conn) {
  InetSocketAddress addr = (InetSocketAddress) conn.httpRequest().remoteAddress();
  //String name = addr.getHostName();
  String name = addr.hashCode()+"";
  //String name = conn.httpRequest().remoteAddress().toString();
  println(name);
  return name;
}


int zaehler = 0;
void addSpieler(WebSocketConnection conn) {
  String search_id = getHostname(conn);
  boolean contains = false;
  
  for (Spieler is : spieler) {
    if ( search_id.equals(is.id()) ) contains = true;
  }
  
  if(!contains) {
    Spieler ns = new Spieler(conn, "spieler-"+zaehler);
    spieler.add(ns);
    zaehler++;
    spielerJoined(ns);
  } else {
    println("spieler schon vorhanden");
  }
  
  println(spieler);
}


void entferneSpielerMitConnection(WebSocketConnection con)
{
  Spieler s = findeSpielerMitConnection(con);
  removeSpielerFromList(s);
}


Spieler findeSpielerMitConnection(WebSocketConnection con)
{
  Spieler foundspieler = null;
  for (Spieler s : spieler) {
    if ( getHostname(con).equals(s.id()) ) {
      foundspieler = s;
      return foundspieler;
    }
  }
  return foundspieler;
}

void removeSpielerFromList(Spieler s)
{
  spieler.remove(s);
}



