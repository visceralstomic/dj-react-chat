import {screen, render} from "@testing-library/react";
import LoginForm from "../components/loginForm";
import userEvent from "@testing-library/user-event";
import {BrowserRouter as Router } from "react-router-dom";
import GlobalStoreProvider from "../store/globalStore";


test('render login form', () => {
	render(
		<GlobalStoreProvider>
			<Router>
				<LoginForm />
			</Router>
		</GlobalStoreProvider>
	);

	const usernameLabel = screen.getByText(/Username/i);
	const passwordLabel = screen.getByText(/Password/i);
	const buttonLogin = screen.getByRole("button", {name: "Log in"});

	expect(usernameLabel).toBeInTheDocument();
	expect(passwordLabel).toBeInTheDocument();
});