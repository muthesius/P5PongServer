/*
	Simple WebSocketServer Example
	http://github.com/muthesius/WebSocketP5
 */

import muthesius.net.*;
import org.webbitserver.*;

// Die Verbindung ist eine WebSocket
WebSocketP5 socket;

// Unsere Mannschaft eine ArrayList:
ArrayList<Spieler> mannschaft = new ArrayList<Spieler>();

PFont font;
void setup() {
  socket = new WebSocketP5(this,3000,"pongsocket");
  font = loadFont("SansSerif-48.vlw");
  textFont(font, 24);
  size(300,200);
  smooth();
}

void draw() {
  background(30);
  text("Anzahl der Spieler: "+mannschaft.size(), 10, 10+24);
}

void stop(){
  killConnections();
  socket.stop();
}

void mousePressed(){
  killConnections();
}


/** Netzwerkangelegenheiten: **/

static Ball ball = null; 

void websocketOnMessage(WebSocketConnection con, String msg){
  println(msg);
  boolean do_update = false;
  if ( msg.startsWith("finished!") ) {
    Spieler s = findeSpielerMitConnection(con);
    if (s==null) return;
    do_update = true;
  }
  else if ( msg.equals("byebye") ){
    entferneSpielerMitConnection(con);
    do_update = true;
  }
  if (do_update) updateBall(msg);
}

void websocketOnOpen(WebSocketConnection con){
  println("A client joined");
  addSpieler(con);
}
  
