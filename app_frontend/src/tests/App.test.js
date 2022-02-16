import {screen, render} from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import {BrowserRouter as Router } from "react-router-dom";
import GlobalStoreProvider from "../store/globalStore";
import axios_instance, {SOCKET_URL} from "../services/globalAxios";
import MockAdapter from "axios-mock-adapter";
import { act } from 'react-dom/test-utils';
import {blankUser, rooms, new_room, partic} from "./testData";
import WS from "jest-websocket-mock";


let mock;
mock = new MockAdapter(axios_instance);

beforeEach(async () => {
    mock.onGet(`/users/get_user/`).reply(200,  blankUser);
    mock.onGet("/chat/room/").reply(200,  rooms);
    mock.onGet("/users/logout/").reply(200,  []);
    mock.onPost("/chat/room/").reply(201, new_room);
    mock.onGet(`/chat/participant/?room_id=${rooms[0].id}`).reply(200, partic);
    mock.onGet(`/users/?part_room=${rooms[0].id}`).reply(200, []);
    localStorage.setItem('IsLoggedIn', true)

	await act(async () => {
		render(<GlobalStoreProvider> <Router> <App /> </Router> </GlobalStoreProvider >);
	})

});

afterEach(() => {
    mock.reset();
});


test('render App page', async  () => {

   	expect(mock.history.get[0].url).toEqual(`/users/get_user/`);
   	expect(mock.history.get[1].url).toEqual('/chat/room/');
   	expect(screen.getByText(/testuser/i)).toBeInTheDocument();
   	expect(screen.getByText(/Select chat room or create one/i)).toBeInTheDocument();
});


test('check room list presence', async  () => {
	const rooom_name_reg = new RegExp("("  + rooms.map(room => room.name).join('|') + ")");

	expect(screen.queryAllByRole("button", {name: rooom_name_reg}).length).toEqual(rooms.length);
});


test('check room form presence', () => {
	expect(screen.getByPlaceholderText("Add chat room")).toBeInTheDocument();
	expect(screen.getByRole("button", {name: "Enter"})).toBeInTheDocument();
});


test('add room to list', async () => {
	const input = screen.getByRole("textbox");
	const button = screen.getByRole("button", {name: "Enter"});

	userEvent.type(input, new_room.name);
	userEvent.click(button);

	expect(await screen.findByRole("button", {name: new_room.name} )).toBeInTheDocument()


});

test('enter the room', async () => {
	window.HTMLElement.prototype.scrollIntoView = function() {};
	const server = new WS(`${SOCKET_URL}/ws/chat/${rooms[0].id}/`);

	const room = screen.getByRole('button', {name: rooms[0].name});

	await act(async () => {
		await userEvent.click(room);
	})

	await server.connected;

	await expect(server).toReceiveMessage(JSON.stringify({ command: "fetch_messages" }));
	server.send(JSON.stringify({ command: "messages", messages: [] }));

	expect(screen.getByText(/Room 1/i, {selector: ".chat-header"})).toBeInTheDocument();
	expect(screen.getByRole('button', {name:/Menu/i})).toBeInTheDocument();
});


test('click logout and relocate to auth page', async  () => {

	const logoutButton = screen.getByRole("button", {name: "Logout"});
	expect(logoutButton).toBeInTheDocument();
	await userEvent.click(logoutButton);
	expect(mock.history.get[2].url).toEqual("/users/logout/");
	expect(await screen.findByRole("heading", {name: "Login"})); 

});



