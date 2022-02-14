import {screen, render} from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import {BrowserRouter as Router } from "react-router-dom";
import GlobalStoreProvider from "../store/globalStore";
import axios_instance from "../services/globalAxios";
import MockAdapter from "axios-mock-adapter";
import { act } from 'react-dom/test-utils';
import {blankUser, rooms} from "./testData";


let mock;
mock = new MockAdapter(axios_instance);

beforeEach(async () => {
    mock.onGet(`/users/get_user/`).reply(200,  blankUser);
    mock.onGet("/chat/room/").reply(200,  rooms);
    mock.onGet("/users/logout/").reply(200,  []);
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


test('click logout and relocate to auth page', async  () => {

	const logoutButton = screen.getByRole("button", {name: "Logout"});
	expect(logoutButton).toBeInTheDocument();
	await act(async () => {
		await userEvent.click(logoutButton);
	});
	expect(mock.history.get[2].url).toEqual("/users/logout/");
	expect(await screen.findByRole("heading", {name: "Login"})); 

});