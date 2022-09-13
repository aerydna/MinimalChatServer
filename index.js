import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws, { WebSocketServer } from 'ws';
//serve static folder
const server=createServer((req,res)=>{
  return staticHandler(req,res,{public: 'public'})
});

let history = [];
const wss=new WebSocketServer({server})
wss.on('connection',(client)=>{
  console.log('Client connected !');
  client.on('message',(msg)=>{
    history.push(msg);
    console.log(`Message:${msg}`);

    //asking for history
    if(msg == "HIST"){
      console.log('asked for history');
      client.send('HISTORY|' + history.join("%\n%"));
    }

    broadcast(msg)
  })
});

function broadcast(msg) {       // (4)
  for(const client of wss.clients){
    if(client.readyState === ws.OPEN){
      client.send('ACTIVECHANNEL|' + msg)
    }
  }
}

server.listen(process.argv[2] || 8080,()=>{
  console.log(`server listening...`);
})