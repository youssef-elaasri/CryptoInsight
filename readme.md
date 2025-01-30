Docker compose :

To execute the projet locally with docker compose , you need to do minor changes on frontend and backend conecrning the api urls

frontend : go to /frontend/src/environments and change apiUrl on both files enviroment.ts ad environment.developement.ts to apiUrl: "http://localhost:8080/api/"

after that go to /frontend/src/app/controllers/cryptocurrency/cryptocurrency.service.ts
and websocket link connection link to :
this.stompClient.webSocketFactory = (): IStompSocket => {
return new SockJS(
"http://localhost:8080/sockjs-websocket"
) as IStompSocket;
};
