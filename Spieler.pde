class Spieler {
  String name;
  String id;
  WebSocketConnection conn;
  Spieler(WebSocketConnection conn, String name)
  {
    this.name = name;
    this.conn = conn;
    this.id = getHostname(conn);
  }
  
  String id(){
    return this.id;
  }
  
  String name(){
    return this.name;
  }
  
  void send(String msg){
    conn.send(msg);
  }
  
}
