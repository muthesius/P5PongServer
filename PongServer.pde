/*
	Simple WebSocketServer Example
	http://github.com/muthesius/WebSocketP5
 */

import muthesius.net.*;
import org.webbitserver.*;

WebSocketP5 socket;

ArrayList<Spieler> spieler = new ArrayList<Spieler>();


void setup() {
  socket = new WebSocketP5(this,3000);
  frameRate(1);
}



void printDebug(){
  println(spieler);
}

void draw() {
  
  
  // verschicke die ballpostionen
  
  //printDebug();
  
  updateBall();
  
  broadcastPositions();
}

void stop(){
  socket.stop();
}


void mousePressed(){
  killConnections();
}

void websocketOnMessage(WebSocketConnection con, String msg){
  println(msg);

  if ( msg.equals("byebye") ) entferneSpielerMitConnection(con);
}


void websocketOnOpen(WebSocketConnection con){
  println("A client joined");
  addSpieler(con);
}
  
