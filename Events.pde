
void spielerJoined(Spieler ns){
  println("ein neuer spieler mit dem namen"+ns.name()+" joined!");
}

void spielerScored(Spieler s, int score){
  println("Spieler "+s.name()+" hat gepunktet! Punktestand ist: "+score);
}
