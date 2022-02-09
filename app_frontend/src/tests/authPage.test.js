import {screen, render} from  "@testing-library/react";
import AuthPage from "../components/authPage";
import GlobalStoreProvider from "../store/globalStore";
import {BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";


test('render authentication page', () => {
	render(<GlobalStoreProvider> <Router> <AuthPage /> </Router> </GlobalStoreProvider >);
	const spanElem = screen.getByText(/Sign up/i);
	const loginHeader = screen.getByRole("heading", {name: "Login"});

	expect(spanElem).toBeInTheDocument();
	expect(loginHeader).toBeInTheDocument();
});


test('render authentication page toggle to register', async () => {
	render(<GlobalStoreProvider> <Router> <AuthPage /> </Router> </GlobalStoreProvider >);
	
	const spanElem = screen.getByText(/Sign up/i);
	await userEvent.click(spanElem);
	const registerHeader = screen.getByRole("heading", {name: "Register"});

	expect(registerHeader).toBeInTheDocument();
})