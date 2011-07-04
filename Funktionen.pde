/** BALL ****/

void updateBall(String msg, WebSocketConnection conn) {
  if (mannschaft.size()==0) return;
  
  Spieler s = findeSpielerMitConnection(conn);
  
  if (s==null) return; // kein Spieler gefunden!

  String ball_paket = msg.substring(msg.indexOf("!")+1);
  
  ball = new Ball(ball_paket,s);
  
  println("Ball: "+ball); // Zeige die Infos des Balls (als JSON String)
  if(ball==null) return; // Es konnte kein Ball aus der Nachtricht gefiltert werden.
  
  println("Ball: "+ball); // Zeige die Infos des Balls (als JSON String)
  
  int next_spieler = mannschaft.indexOf(ball.spieler) + ball.side();
  
  // loope durch die mannschaft:
  // der rechte nachbar des letzten spielers ist der erste
  if (next_spieler >= mannschaft.size() ) next_spieler = 0;
  // der linke nachbar des ersten spielers ist der letzte
  if (next_spieler < 0 ) next_spieler = (mannschaft.size()  - abs(next_spieler)) %mannschaft.size();
  
  Spieler nachbar = mannschaft.get(next_spieler);
  
  //if (nachbar==null) s.send("go!"+ball); // stelle sicher, dass der Ball wieder irgendwo landet!?
  nachbar.send("go!"+ball);
}


/****** SERVER *****/

String getHostname(WebSocketConnection conn) {
  InetSocketAddress addr = (InetSocketAddress) conn.httpRequest().remoteAddress();
  String name = addr.hashCode()+"";
  println(name);
  return name;
}

void killConnections(){
  socket.broadcast("CLOSE");
  mannschaft.clear();
}


/***** SPIELER HANDLING ****/

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
  if (mannschaft.size()==1){
    ball = new Ball("0.5,"+random(-4,4)+",1",mannschaft.get(0));
    conn.send("go!"+ball); // shoot off the game on the first player
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



